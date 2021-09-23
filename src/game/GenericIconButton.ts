import {GenericButton} from "~/game/GenericButton";
import {TextureKeys} from "~/consts/TextureKeys";

export interface IIconButtonSettings {
  frameIcon: string;
  x?: number;
  y?: number;
}

export class GenericIconButton extends GenericButton {
  constructor (scene: Phaser.Scene, frameNormal: string, frameOver: string, settings: IIconButtonSettings, x?: number, y?:number) {
    super(scene, frameNormal, frameOver, x, y);

    this.add(this.scene.add.image((settings.x === undefined) ? 0 : settings.x, (settings.y === undefined) ? 0 : settings.y, TextureKeys.Main, settings.frameIcon));
  }
}