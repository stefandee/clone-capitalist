import {GenericButton} from "~/game/GenericButton";
import {ColorDef} from "~/consts/ColorDef";
import {ICurrencyFormat} from "~/util/CurrencyFormatter";
import {TextureKeys} from "~/consts/TextureKeys";
import {FontDef} from "~/consts/FontDef";

export class BuyBusinessButton extends GenericButton {
  private labelAmount: Phaser.GameObjects.Text;
  private labelPower: Phaser.GameObjects.Text;
  private labelBuy: Phaser.GameObjects.Text;
  private labelBuyOption: Phaser.GameObjects.Text;
  private imageInactive: Phaser.GameObjects.Image;
  private prevActive?: boolean;

  constructor (scene: Phaser.Scene, x?: number, y?:number) {
    super(scene, "b-card-buy-button-normal.png", "b-card-buy-button-over.png", x, y);

    this.createUI();
  }

  public userEnableInteractive() {
    super.userEnableInteractive();

    this.imageInactive && (this.imageInactive.visible = false);
  }

  public userDisableInteractive() {
    super.userDisableInteractive();

    this.imageNormal.visible = this.imageOver.visible = false;
    this.imageInactive && (this.imageInactive.visible = true);
  }

  public updateParams(buyOptions: string, costFormat: ICurrencyFormat, isActive: boolean) {
    if (this.prevActive === undefined || this.prevActive !== isActive) {
      isActive ? this.userEnableInteractive() : this.userDisableInteractive();
      this.prevActive = isActive;
    }

    this.labelAmount.text = costFormat.amount;

    this.labelPower.text = costFormat.power ? costFormat.power : "";
    this.labelPower.visible = (costFormat.power !== undefined);

    this.labelBuyOption.text = buyOptions;
  }

  protected createUI() {
    this.imageInactive = this.scene.add.image(0, 0, TextureKeys.Main, "b-card-buy-button-disabled.png");
    this.add(this.imageInactive);

    this.labelBuy = this.scene.add.text(-65, -9, "Buy", {
      fontFamily: FontDef.Primary,
      fontSize: 18,
      strokeThickness: 1,
      stroke: ColorDef.DarkGray,
      color: ColorDef.QuiteWhite
    })
        .setScrollFactor(0)
        .setOrigin(0.0, 0.5);

    this.add(this.labelBuy);

    this.labelBuyOption = this.scene.add.text(-65, 9, "x1", {
      fontFamily: FontDef.Primary,
      strokeThickness: 1,
      stroke: ColorDef.DarkGray,
      fontSize: 18,
      color: ColorDef.QuiteWhite
    })
        .setScrollFactor(0)
        .setOrigin(0.0, 0.5);

    this.add(this.labelBuyOption);

    this.labelAmount = this.scene.add.text(65, -8, "000000", {
      fontFamily: FontDef.Primary,
      fontSize: 24,
      strokeThickness: 1,
      stroke: ColorDef.DarkGray,
      color: ColorDef.QuiteWhite
    })
        .setScrollFactor(0)
        .setOrigin(1.0, 0.5);

    this.add(this.labelAmount);

    this.labelPower = this.scene.add.text(65, 9, "power", {
      fontFamily: FontDef.Primary,
      fontSize: 14,
      color: ColorDef.AlmostBlack
    })
        .setScrollFactor(0)
        .setOrigin(1.0, 0.5);

    this.add(this.labelPower);
  }

}