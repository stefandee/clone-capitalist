import {TextureKeys} from "~/consts/TextureKeys";
import {ColorDef} from "~/consts/ColorDef";
import {ICurrencyFormat} from "~/util/CurrencyFormatter";
import {FontDef} from "~/consts/FontDef";

export class BusinessCardProgressBar extends Phaser.GameObjects.Container {
  private labelTop: Phaser.GameObjects.Text;
  private labelBottom: Phaser.GameObjects.Text;
  private progress: Phaser.GameObjects.Image;
  private progressMaskGraphics: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, x?: number, y?: number) {
    super(scene, x, y);

    this.createUI();
  }

  public updateLabels(v: ICurrencyFormat) {
    this.labelTop.text = v.amount;

    // this.labelBottom.text = "billions";

    this.labelBottom.text = v.power ? v.power : "";
    this.labelBottom.visible = (v.power !== undefined);
  }

  /**
   * A number in the interval 0..1
   * @param {number} v
   */
  public updateProgress(v: number) {
    // TODO clamp v in 0..1 interval
    this.progress.scaleX = Phaser.Math.Clamp(v, 0, 1);
  }

  protected createUI() {
    this.progress = this.scene.add.image(-108, 0, TextureKeys.Main, "b-card-profit-progress.png");
    this.progress.setOrigin(0.0, 0.5);
    this.add(this.progress);

    /*
    //this.progress.setVisible(false);

    this.progressMaskGraphics = this.createMaskShape(this.progress.width, this.progress.height);
    //this.progressMaskGraphics.scaleX = 0.5;
    this.add(this.progressMaskGraphics);

    this.progress.setMask(this.progressMaskGraphics.createGeometryMask()); // new GeometryMask(this.scene, this.progressMaskGraphics);
    this.add(this.progress);
    */

    this.add(this.scene.add.image(0, 0, TextureKeys.Main, "b-card-profit-frame.png"));

    this.labelTop = this.scene.add.text(0, -7, "000000", {
      fontFamily: FontDef.Primary,
      fontSize: 24,
      color: ColorDef.AlmostBlack
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(this.labelTop);

    this.labelBottom = this.scene.add.text(0, 9, "power", {
      fontFamily: FontDef.Primary,
      fontSize: 14,
      color: ColorDef.AlmostBlack
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(this.labelBottom);
  }

  private createMaskShape(width: number, height: number): Phaser.GameObjects.Graphics {
    const graphics = new Phaser.GameObjects.Graphics(this.scene);

    graphics.fillStyle(0, 1);
    graphics.fillRect(-width / 2, -height / 2, width, height);

    /*graphics.save();
    graphics.fillStyle(0, 1);
    graphics.beginPath();
    graphics.moveTo(-width / 2, -height / 2);
    graphics.lineTo(width / 2, -height / 2);
    graphics.lineTo(width / 2, height / 2);
    graphics.lineTo(-width / 2, height / 2);

    graphics.closePath();
    graphics.fillPath();
    graphics.restore();*/

    return graphics;
  }
}