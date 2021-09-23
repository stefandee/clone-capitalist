import {TextureKeys} from "~/consts/TextureKeys";
import {PlayerModel} from "~/model/PlayerModel";
import {ColorDef} from "~/consts/ColorDef";
import {BuyOptionsFormatter} from "~/util/BuyOptionsFormatter";
import {CustomEventsDef} from "~/consts/CustomEventsDef";
import {FontDef} from "~/consts/FontDef";

export class BuyOptionsButton extends Phaser.GameObjects.Container {
  protected imageNormal: Phaser.GameObjects.Image;
  protected imageOver: Phaser.GameObjects.Image;
  private labelBuy: Phaser.GameObjects.Text;
  private labelBuyOption: Phaser.GameObjects.Text;
  protected playerModel: PlayerModel;

  constructor (scene: Phaser.Scene, x?: number, y?:number) {
    super(scene, x, y);

    this.playerModel = this.scene.registry.get(PlayerModel.NAME) as PlayerModel;

    // TODO create a random background
    for(let i = 0; i < 3; i++) {
      const bkgImage = this.scene.add.image(Phaser.Math.Between(-5, 5), Phaser.Math.Between(-5, 5), TextureKeys.Main, "button-buy-settings-over.png");
      bkgImage.scale = Phaser.Math.Between(0.9, 1.0);
      bkgImage.rotation = Phaser.Math.DEG_TO_RAD * Phaser.Math.Between(-30, 30);
      this.add(bkgImage);
    }

    this.imageNormal = this.scene.add.image(0, 0, TextureKeys.Main, "button-buy-settings-normal.png");
    this.imageOver = this.scene.add.image(0, 0, TextureKeys.Main, "button-buy-settings-over.png");

    this.add(this.imageNormal);
    this.add(this.imageOver);

    this.labelBuy = this.scene.add.text(-20, -12, "Buy", {
      fontFamily: FontDef.Primary,
      fontSize: 16,
      strokeThickness: 1,
      stroke: ColorDef.DarkGray,
      color: ColorDef.QuiteWhite
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5)
        .setRotation(-Phaser.Math.DEG_TO_RAD * 10);

    this.add(this.labelBuy);

    this.labelBuyOption = this.scene.add.text(0, 9, "x1", {
      fontFamily: FontDef.Primary,
      strokeThickness: 1,
      stroke: ColorDef.DarkGray,
      fontSize: 32,
      color: ColorDef.QuiteWhite
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(this.labelBuyOption);

    this.initDefaultState();
    this.updateBuyOptions();

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-this.imageNormal.width / 2, -this.imageNormal.height / 2, this.imageNormal.width, this.imageNormal.height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true }
    )
        .on('pointerover', () => this.enterButtonOverState() )
        .on('pointerout', () => this.enterButtonNormalState() )
        .on("pointerdown", this.changeBuyOptions, this);
  }

  protected initDefaultState(): void {
    this.imageOver.visible = false;
  }

  protected enterButtonOverState(): void {
    this.imageOver.visible = true;
    this.imageNormal.visible = false;
  }

  protected enterButtonNormalState(): void {
    this.imageOver.visible = false;
    this.imageNormal.visible = true;
  }

  protected changeBuyOptions() {
    this.playerModel.nextBuyOption();
    this.updateBuyOptions();

    this.scene.events.emit(CustomEventsDef.ChangeBuyOptions);
  }

  protected updateBuyOptions() {
    this.labelBuyOption.text = BuyOptionsFormatter.format(this.playerModel.buyOptions);
  }
}