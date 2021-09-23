import {TextureKeys} from "~/consts/TextureKeys";
import {ColorDef} from "~/consts/ColorDef";
import {FontDef} from "~/consts/FontDef";

export class BusinessCardOwned extends Phaser.GameObjects.Container {
  private label: Phaser.GameObjects.Text;
  private progress: Phaser.GameObjects.Image;

  constructor (scene: Phaser.Scene, x?: number, y?:number) {
    super(scene, x, y);

    this.createUI();
  }

  public updateLabel(v: string) {
    this.label.text = v;
  }

  protected createUI() {
    this.add(this.scene.add.image(0, 0, TextureKeys.Main, "b-card-owned-bkg.png"));

    this.progress = this.scene.add.image(0, 0, TextureKeys.Main, "b-card-owned-progress.png");
    this.add(this.progress);

    this.add(this.scene.add.image(0, 0, TextureKeys.Main, "b-card-owned-frame.png"));

    this.label = this.scene.add.text(0, 0, "0", {
      fontFamily: FontDef.Primary,
      fontSize: 16,
      strokeThickness: 1,
      stroke: ColorDef.DarkGray,
      color: ColorDef.QuiteWhite
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(this.label);
  }
}