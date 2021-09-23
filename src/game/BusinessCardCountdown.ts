import {TextureKeys} from "~/consts/TextureKeys";
import {ColorDef} from "~/consts/ColorDef";
import {FontDef} from "~/consts/FontDef";

export class BusinessCardCountdown extends Phaser.GameObjects.Container {
  private label: Phaser.GameObjects.Text;

  constructor (scene: Phaser.Scene, x?: number, y?:number) {
    super(scene, x, y);

    this.createUI();
  }

  public updateLabel(v: string) {
    this.label.text = v;
  }

  protected createUI() {
    this.add(this.scene.add.image(0, 0, TextureKeys.Main, "b-card-countdown.png"));

    this.label = this.scene.add.text(0, 0, "0", {
      fontFamily: FontDef.Primary,
      fontSize: 18,
      strokeThickness: 1,
      stroke: ColorDef.DarkGray,
      color: ColorDef.QuiteWhite
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(this.label);
  }
}