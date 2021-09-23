import {GenericButton} from "~/game/GenericButton";

export class GenericLabelButton extends GenericButton {
  constructor (scene: Phaser.Scene, frameNormal: string, frameOver: string, label: string, style?: object, x?: number, y?:number) {
    super(scene, frameNormal, frameOver, x, y);

    this.createLabel(label, style);
  }

  protected createLabel(label: string, style?: object) {
    const text = this.scene.add.text(0, 0, label, style)
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(text);
  }
}