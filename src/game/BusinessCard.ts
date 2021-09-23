import {IBusinessDef} from "~/model/BusinessDefModel";
import {PlayerModel} from "~/model/PlayerModel";
import {TextureKeys} from "~/consts/TextureKeys";
import {CurrencyFormatter} from "~/util/CurrencyFormatter";
import {ColorDef} from "~/consts/ColorDef";
import {BuyFirstBusinessButton} from "~/game/BuyFirstBusinessButton";
import {GenericIconButton} from "~/game/GenericIconButton";
import {BusinessCardOwned} from "~/game/BusinessCardOwned";
import {BusinessCardProgressBar} from "~/game/BusinessCardProgressBar";
import {BuyBusinessButton} from "~/game/BuyBusinessButton";
import {BuyOptionsFormatter} from "~/util/BuyOptionsFormatter";
import {BuyOptions} from "~/types/BuyOptions";
import {BusinessCardCountdown} from "~/game/BusinessCardCountdown";
import {TimeDurationFormatter} from "~/util/TimeDurationFormatter";
import {CustomEventsDef} from "~/consts/CustomEventsDef";
import SceneKeys from "~/consts/SceneKeys";
import {FontDef} from "~/consts/FontDef";
import {IManagerDef} from "~/model/ManagerDefModel";
import {PositionHelper} from "~/game/PositionHelper";

export class BusinessCard extends Phaser.GameObjects.Container {
  private static readonly COUNTDOWN_UPDATE_TIME: number = 1000.0;

  private playerModel: PlayerModel;
  private businessType: string;
  private businessDef: IBusinessDef;

  private uiReady: Phaser.GameObjects.Container;
  private uiReadyToBuy: Phaser.GameObjects.Container;
  private uiUnavailable: Phaser.GameObjects.Container;

  private buttonActivate: GenericIconButton;
  private owned: BusinessCardOwned;
  private progressBar: BusinessCardProgressBar;
  private buttonBuyBusiness: BuyBusinessButton;
  private countdown: BusinessCardCountdown;

  private lastT: number = -1;

  constructor(scene: Phaser.Scene, businessType: string, businessDef: IBusinessDef, x?: number, y?: number) {
    super(scene, x, y);

    this.businessDef = businessDef;
    this.businessType = businessType;
    this.playerModel = this.scene.registry.get(PlayerModel.NAME) as PlayerModel;

    this.createUI();
  }

  public update(t: number, dt: number): void {
    const progress = this.playerModel.getBusinessProgress(this.businessType);
    const now = new Date().getTime();

    if (!progress) {
      // activate the appropriate ui
      this.uiUnavailable.visible = (this.playerModel.cash < this.businessDef.cost);
      this.uiReadyToBuy.visible = !this.uiUnavailable.visible;
      return;
    }

    // check if the business has a manager and has gone idle; if so, reactivate it
    if (progress.nextTimeStamp !== undefined && now >= progress.nextTimeStamp) {
      // calculate and update the profit
      this.playerModel.cash += progress.owned * this.businessDef.profit;
      // console.log("business produced " + progress.owned * this.businessDef.profit + " profit!");

      if (progress.manager) {
        // console.log("manager is auto-activating the business!");
        progress.nextTimeStamp = now + this.businessDef.time * 1000;
      } else {
        // console.log("business is now idling!");
        progress.nextTimeStamp = undefined;
        this.buttonActivate.userEnableInteractive();
        this.updateCountdown();
      }

      this.progressBar.updateProgress(0.0);

      this.scene.events.emit(CustomEventsDef.CashChanged);

      // save to storage
      this.playerModel.saveToStorageAt(now);
    }

    if (progress.nextTimeStamp !== undefined && now <= progress.nextTimeStamp) {
      // console.log("progress scale " + (1.0 - (progress.nextTimeStamp - now) / (this.businessDef.time * 1000)));
      this.progressBar.updateProgress(1.0 - (progress.nextTimeStamp - now) / (this.businessDef.time * 1000));

      // every second, refresh the countdown timer label
      if (this.lastT === -1 || t - this.lastT >= BusinessCard.COUNTDOWN_UPDATE_TIME) {
        this.lastT = t;
        this.updateCountdown();
      }
    }
  }

  /**
   * There are 3 main states:
   * * 0 businesses owned and player has money to buy;
   * * 0 businesses owned and player doesn't have money to buy;
   * * one or more businesses owned
   */
  private createUI(): void {
    const progress = this.playerModel.getBusinessProgress(this.businessType);

    // only create the necessary states and switch between them
    if (progress) {
      this.createReadyUI();
    } else {
      this.createUnavailableUI();
      this.createReadyToBuyUI();
    }

    this.updateState();
  }

  private createUnavailableUI() {
    this.uiUnavailable = new Phaser.GameObjects.Container(this.scene);

    this.uiUnavailable.add(this.scene.add.image(0, 0, TextureKeys.Main, "b-card-unavailable.png"));

    const businessName = this.scene.add.text(0, -13, `${this.businessDef.displayName}`, {
      fontFamily: FontDef.Primary,
      fontSize: 20,
      color: ColorDef.DarkGray
    })
        .setOrigin(0.5, 0.5);

    this.uiUnavailable.add(businessName);

    const initialCostTag = this.scene.add.text(0, 13, `${CurrencyFormatter.noFormat(this.businessDef.cost)}`, {
      fontFamily: FontDef.Primary,
      fontSize: 18,
      color: ColorDef.QuiteWhite
    })
        .setOrigin(0.5, 0.5);

    this.uiUnavailable.add(initialCostTag);

    this.add(this.uiUnavailable);
  }

  private createReadyToBuyUI() {
    this.uiReadyToBuy = new Phaser.GameObjects.Container(this.scene);

    const button = new BuyFirstBusinessButton(
        this.scene,
        "button-buy-first-business-normal.png",
        "button-buy-first-business-over.png",
        this.businessDef.displayName,
        CurrencyFormatter.plainFormat(this.businessDef.cost)
    );

    this.uiReadyToBuy.add(button);

    button
        .once('pointerdown', this.buyFirstBusiness, this);

    this.scene.tweens.add({
      targets: this.uiReadyToBuy,
      scaleX: {value: 1.1, duration: 197},
      scaleY: {value: 0.9, duration: 283},
      ease: "Linear",
      yoyo: true,
      loop: -1
    });

    this.add(this.uiReadyToBuy);
  }

  private createReadyUI() {
    this.uiReady = new Phaser.GameObjects.Container(this.scene);

    // add the icon button (activates the business if it doesn't have a manager)
    this.buttonActivate = new GenericIconButton(this.scene, "b-card-icon-frame-normal.png", "b-card-icon-frame-over.png", {
      frameIcon: `business-icon-${this.businessType}.png`
    }, -140, 0);
    // this.buttonActivate.disableInteractive();

    this.buttonActivate
        .on("pointerdown", this.activateBusiness, this);

    this.uiReady.add(this.buttonActivate);

    // add the business counter
    this.owned = new BusinessCardOwned(this.scene, -140, 35);
    this.uiReady.add(this.owned);

    // add the progress bar
    this.progressBar = new BusinessCardProgressBar(this.scene, 16, -18);
    this.progressBar.updateProgress(0.0);
    this.uiReady.add(this.progressBar);

    // add the buy button
    this.buttonBuyBusiness = new BuyBusinessButton(this.scene, -25, 26);
    this.uiReady.add(this.buttonBuyBusiness);

    this.buttonBuyBusiness
        .on("pointerdown", this.buyBusiness, this);

    // event: update the buy business button when buy options change (on Game scene events)
    this.scene.scene.get(SceneKeys.Game).events
        .on(CustomEventsDef.ChangeBuyOptions, this.updateBuyBusiness, this);

    this.scene.scene.get(SceneKeys.Game).events
        .on(CustomEventsDef.CashChanged, this.handleCashChanged, this);

    this.scene.scene.get(SceneKeys.Game).events
        .on(CustomEventsDef.HireManager, this.handleHireManager, this);

    // add the countdown timer
    this.countdown = new BusinessCardCountdown(this.scene, 89, 26);
    this.uiReady.add(this.countdown);

    this.add(this.uiReady);
  }

  private updateState() {
    const progress = this.playerModel.getBusinessProgress(this.businessType);

    if (!progress) {
      this.uiUnavailable.visible = (this.playerModel.cash < this.businessDef.cost);
      this.uiReadyToBuy.visible = !this.uiUnavailable.visible;
    } else {
      this.uiUnavailable && (this.uiUnavailable.visible = this.uiReadyToBuy.visible = false);
      this.uiReady.visible = true;

      this.updateBusinessOwned();
      this.updateProgressBarLabels();
      this.updateBuyBusiness();
      this.updateCountdown();

      // business has a manager, so it cannot be clicked
      progress.manager && this.buttonActivate.userDisableInteractive();
    }
  }

  private updateProgressBarLabels() {
    const progress = this.playerModel.getBusinessProgress(this.businessType);

    if (progress) {
      const profit: number = progress.owned * this.businessDef.profit;
      this.progressBar.updateLabels(CurrencyFormatter.format(profit));
    }
  }

  private updateBusinessOwned() {
    const progress = this.playerModel.getBusinessProgress(this.businessType);

    if (progress) {
      this.owned.updateLabel(progress.owned.toString());
    }
  }

  private updateBuyBusiness() {
    const progress = this.playerModel.getBusinessProgress(this.businessType);

    if (progress) {
      const buyParams = this.playerModel.buyBusiness(this.businessType, this.businessDef, true);
      const buyOptions = this.playerModel.buyOptions;
      const hasCash = buyParams.cost <= this.playerModel.cash;
      const adjustedCost = buyParams.cost > 0 ? buyParams.cost : progress.currentCost;

      const isActive = hasCash &&
          ((buyOptions === BuyOptions.BuyMax && buyParams.amount > 0) ||
          (buyOptions === BuyOptions.Buy1 && buyParams.amount >= 1) ||
          (buyOptions === BuyOptions.Buy10 && buyParams.amount >= 10) ||
          (buyOptions === BuyOptions.Buy100 && buyParams.amount >= 100));

      this.buttonBuyBusiness.updateParams(
          (buyOptions === BuyOptions.BuyMax) ? ("x" + buyParams.amount.toString()) : BuyOptionsFormatter.format(buyOptions),
          CurrencyFormatter.format(adjustedCost, CurrencyFormatter.MILLION),
          isActive
      );
    }
  }

  private updateCountdown() {
    const progress = this.playerModel.getBusinessProgress(this.businessType);

    if (progress) {
      const time = (progress.nextTimeStamp === undefined) ? this.businessDef.time : ((progress.nextTimeStamp - new Date().getTime()) / 1000);
      this.countdown.updateLabel(TimeDurationFormatter.format(Math.floor(time)));
    }
  }

  private activateBusiness() {
    // only allowed to interact if the business doesn't have a manager
    const progress = this.playerModel.getBusinessProgress(this.businessType);

    if (!progress) {
      return;
    }

    if (progress.nextTimeStamp !== undefined) {
      console.log("cannot activate business, it's already active!");
      return;
    }

    if (progress.manager === undefined) {
      // console.log("activate business!!!");
      const now = new Date().getTime();

      progress.nextTimeStamp = now + this.businessDef.time * 1000;
      this.playerModel.saveToStorageAt(now);

      this.buttonActivate.userDisableInteractive();
      this.progressBar.updateProgress(0);

      const pos = PositionHelper.getCanvasPoint(this.buttonActivate, this.scene.cameras.main);
      this.scene.scene.get(SceneKeys.VFX).events.emit(CustomEventsDef.StarsVFX, 12, pos.x, pos.y);
    }
  }

  private buyBusiness() {
    // buy businesses according to the buyOptions
    this.playerModel.lastOnlineTimestamp = new Date().getTime();
    this.playerModel.buyBusiness(this.businessType, this.businessDef);
    this.updateBuyBusiness();
    this.updateBusinessOwned();
    this.updateProgressBarLabels();

    this.scene.events.emit(CustomEventsDef.CashChanged);

    // emit particles event
    const pos = PositionHelper.getCanvasPoint(this.buttonBuyBusiness, this.scene.cameras.main);
    this.scene.scene.get(SceneKeys.VFX).events.emit(CustomEventsDef.MoneyVFX, 16, pos.x, pos.y);
  }

  private buyFirstBusiness() {
    const result = this.playerModel.buyFirstBusiness(this.businessType, this.businessDef);

    // console.log("buy first business: " + result.amount + " " + result.cost);
    if (result.amount > 0) {
      this.createReadyUI();
      this.updateState();
      this.scene.events.emit(CustomEventsDef.CashChanged);

      // emit particles event
      const pos = PositionHelper.getCanvasPoint(this.uiReadyToBuy, this.scene.cameras.main);
      this.scene.scene.get(SceneKeys.VFX).events.emit(CustomEventsDef.MoneyVFX, 16, pos.x, pos.y);
    }
  }

  private handleCashChanged() {
    this.updateBuyBusiness();
  }

  private handleHireManager(managerId: string, managerDef: IManagerDef) {
    // check if manager is handling this business
    // console.log("handleHireManager", managerId, managerDef,this.businessType);

    if (managerDef.business !== this.businessType) {
      // console.log("this is a manager of a different business!");
      return;
    }

    const progress = this.playerModel.getBusinessProgress(this.businessType);

    if (!progress) {
      // console.log("handleHireManager: there is no progress for ", this.businessType);
      return;
    }

    // auto-start the business
    if (progress.nextTimeStamp === undefined) {
      // console.log("manager is auto-start this business after being hired!");

      // TODO this code is duplicated, refactor
      const now = new Date().getTime();

      progress.nextTimeStamp = now + this.businessDef.time * 1000;
      this.playerModel.saveToStorageAt(now);

      this.buttonActivate.userDisableInteractive();
      this.progressBar.updateProgress(0);
    }
  }
}
