import {GenericButton} from "~/game/GenericButton";
import {ColorDef} from "~/consts/ColorDef";
import {FontDef} from "~/consts/FontDef";

export class BuyFirstBusinessButton extends GenericButton {
  constructor (scene: Phaser.Scene, frameNormal: string, frameOver: string, labelTop: string, labelBottom: string, x?: number, y?:number) {
    super(scene, frameNormal, frameOver, x, y);

    this.createLabels(labelTop, labelBottom);
  }

  protected createLabels(labelTop: string, labelBottom: string) {
    const textTop = this.scene.add.text(0, -13, labelTop, {
      fontFamily: FontDef.Primary,
      fontSize: 20,
      color: ColorDef.DarkGray
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(textTop);

    const textBottom = this.scene.add.text(0, 13, labelBottom, {
      fontFamily: FontDef.Primary,
      fontSize: 20,
      color: ColorDef.QuiteWhite
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(textBottom);
  }

}