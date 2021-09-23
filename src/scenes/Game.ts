import Phaser from 'phaser';
import SceneKeys from '../consts/SceneKeys';
import {TextureKeys} from "../consts/TextureKeys";
import {UpgradesPanel} from "~/game/UpgradesPanel";
import {BusinessDefModel} from "~/model/BusinessDefModel";
import {PlayerModel} from "~/model/PlayerModel";
import {ColorDef} from "~/consts/ColorDef";
import {CurrencyFormatter} from "~/util/CurrencyFormatter";
import {BusinessCard} from "~/game/BusinessCard";
import {BuyOptionsButton} from "~/game/BuyOptionsButton";
import {FontDef} from "~/consts/FontDef";

export default class Game extends Phaser.Scene {
  private static readonly MAX_ROWS: number = 5;

  private static readonly AUTO_SAVE_DELAY: number = 2000;

  private businessDefModel: BusinessDefModel;
  private playerModel: PlayerModel;

  private mainCurrency: Phaser.GameObjects.Text;

  private currencyAmount: number;

  private businessCards: BusinessCard[];

  private timerAutoSave;

  constructor() {
    super(SceneKeys.Game);
  }

  protected init(): void {
    this.businessDefModel = this.registry.get(BusinessDefModel.NAME) as BusinessDefModel;
    this.playerModel = this.registry.get(PlayerModel.NAME) as PlayerModel;
  }

  protected create(): void {
    // console.log("Game#create");

    /*this.events
        .on(CustomEventsDef.MoneyVFX, () => console.log("capturing vfx event in game scene!"));*/

    const width = this.scale.width;
    const height = this.scale.height;

    // create the background
    this.add.image(width / 2, height / 2, TextureKeys.MainBackground);

    // create the upgrade panel
    const panel = new UpgradesPanel(this, -133, 0);
    this.add.existing(panel);

    this.tweens.add({
      targets: panel,
      x: {value: 0, duration: 250},
      ease: "Quad.easeOut",
    });

    // create the main view and currency
    this.createCurrency();

    this.createMainView();

    this.createBuyOptions();

    this.setupAutoSave();

    this.scene.launch(SceneKeys.VFX);
    this.scene.bringToTop(SceneKeys.VFX);
  }

  public update(t: number, dt: number) {
    // only update when necessary;
    // TODO since this is will be quite often updated, perhaps only update it once/seconds? (if there are any performance issues)
    if (this.currencyAmount !== this.playerModel.cash) {
      this.mainCurrency.text = CurrencyFormatter.plainFormat(this.playerModel.cash);
    }

    this.businessCards.forEach((element) => {
      element.update(t, dt);
    });
  }

  private createCurrency() {
    this.currencyAmount = this.playerModel.cash;

    this.mainCurrency = this.add.text(280, 40, `${CurrencyFormatter.plainFormat(this.playerModel.cash)}`, {
      fontFamily: FontDef.Primary,
      fontSize: 64,
      color: ColorDef.MoneyCream
    })
        .setOrigin(0.0, 0.5);
  }

  private createMainView() {
    const businessTypes = this.businessDefModel.businessKeys;

    let row = 0;
    let column = 0;

    this.businessCards = [];

    businessTypes.forEach((value) => {
      const card = new BusinessCard(this, value, this.businessDefModel.getBusiness(value), 440 + column * 320, 130 + row * 100);

      row++;

      if (row >= Game.MAX_ROWS) {
        row = 0;
        column++;
      }

      this.add.existing(card);
      this.businessCards.push(card);
    });
  }

  private createBuyOptions() {
    const button = new BuyOptionsButton(this, 890, 45);
    this.add.existing(button);
  }

  private setupAutoSave() {
    this.timerAutoSave = this.time.addEvent({
      delay: Game.AUTO_SAVE_DELAY, // mili-seconds
      callback: this.autoSave,
      //args: [],
      callbackScope: this,
      loop: true
    });
  }

  /**
   * Auto-save to local storage. Game is saved anyway when the player does actions (buy business, collect profit),
   * but it's necessary in order to save the last time stamp the player was online.
   */
  private autoSave() {
    this.playerModel.saveToStorageAt(new Date().getTime());
  }
}
