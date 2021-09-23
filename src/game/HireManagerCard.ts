import {IManagerDef} from "~/model/ManagerDefModel";
import {TextureKeys} from "~/consts/TextureKeys";
import {ColorDef} from "~/consts/ColorDef";
import {FontDef} from "~/consts/FontDef";
import {IBusinessDef} from "~/model/BusinessDefModel";
import {CurrencyFormatter} from "~/util/CurrencyFormatter";
import SceneKeys from "~/consts/SceneKeys";
import {GenericLabelButton} from "~/game/GenericLabelButton";
import {CustomEventsDef} from "~/consts/CustomEventsDef";
import {PlayerModel} from "~/model/PlayerModel";
import {PositionHelper} from "~/game/PositionHelper";

export class HireManagerCard extends Phaser.GameObjects.Container {
  private managerId: string;
  private managerDef: IManagerDef;
  private businessDef: IBusinessDef;
  private playerModel: PlayerModel;
  private hireButton: GenericLabelButton;

  constructor(scene: Phaser.Scene, managerId: string, managerDef: IManagerDef, businessDef: IBusinessDef, x?: number, y?: number) {
    super(scene, x, y);

    this.managerId = managerId;
    this.managerDef = managerDef;
    this.businessDef = businessDef;
    this.playerModel = this.scene.registry.get(PlayerModel.NAME) as PlayerModel;

    this.createUI();
  }

  protected createUI() {
    const bkg = this.scene.add.image(0, 0, TextureKeys.Main, "manager-card.png");
    this.add(bkg);

    const name = this.scene.add.text(0, -20, this.managerDef.name, {
      fontFamily: FontDef.Primary,
      fontSize: 24,
      color: ColorDef.HeaderBlue
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(name);

    const info = this.scene.add.text(0, 0, `Manages ${this.businessDef.displayName}`, {
      fontFamily: FontDef.Primary,
      fontSize: 14,
      color: ColorDef.LikeDirt
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(info);

    const cost = this.scene.add.text(0, 20, `${CurrencyFormatter.noFormat(this.managerDef.cost)}`, {
      fontFamily: FontDef.Primary,
      fontSize: 20,
      color: ColorDef.LikeDirt
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    cost.visible = !this.playerModel.isManagerHired(this.managerId);
    this.add(cost);

    this.hireButton = new GenericLabelButton(
        this.scene,
        "button-hire-normal.png",
        "button-hire-over.png",
        "Hire!",
        {
          fontFamily: FontDef.Primary,
          fontSize: 32,
          color: "#72685f"
        },
        160,
        0);

    this.hireButton
        .on('pointerdown', () => {
          if (this.playerModel.hireManager(this.managerId, this.managerDef)) {
            cost.visible = this.playerModel.isManagerHired(this.managerId);
            this.hireButton.visible = false;
            cost.visible = false;

            this.scene.scene.get(SceneKeys.Game).events.emit(CustomEventsDef.HireManager, this.managerId, this.managerDef);

            // emit particles event
            const pos = PositionHelper.getCanvasPoint(this.hireButton, this.scene.cameras.main);
            this.scene.scene.get(SceneKeys.VFX).events.emit(CustomEventsDef.MoneyVFX, 16, pos.x, pos.y);
          }
        } );

    this.add(this.hireButton);

    // listen to the cash event and configure accordingly
    this.scene.scene.get(SceneKeys.Game).events
        .on(CustomEventsDef.CashChanged, () => {
          this.updateButtonState();
        });

    this.updateButtonState();
  }

  private updateButtonState() {
    if (!this.playerModel.isManagerHired(this.managerId)) {
      this.hireButton.visible = (this.playerModel.cash >= this.managerDef.cost);
    } else {
      this.hireButton.visible = false;
    }
    // (this.playerModel.cash >= this.managerDef.cost) ? this.hireButton.userEnableInteractive() : this.hireButton.userDisableInteractive();
  }
}