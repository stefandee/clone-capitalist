import {TextureKeys} from "~/consts/TextureKeys";

export class GenericButton extends Phaser.GameObjects.Container {
  protected imageNormal: Phaser.GameObjects.Image;
  protected imageOver: Phaser.GameObjects.Image;

  constructor (scene: Phaser.Scene, frameNormal: string, frameOver: string, x?: number, y?:number) {
    super(scene, x, y);

    this.imageNormal = this.scene.add.image(0, 0, TextureKeys.Main, frameNormal);
    this.imageOver = this.scene.add.image(0, 0, TextureKeys.Main, frameOver);

    this.add(this.imageNormal);
    this.add(this.imageOver);

    this.initDefaultState();

    //.on('pointerdown', () => this.enterButtonActiveState() )
    //.on('pointerup', () => this.enterButtonOverState() );

    this.userEnableInteractive();
  }

  public userEnableInteractive() {
    this.imageNormal.visible = this.imageOver.visible = true;

    this.removeInteractive();
    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(-this.imageNormal.width / 2, -this.imageNormal.height / 2, this.imageNormal.width, this.imageNormal.height),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      useHandCursor: true }
    )
        .on('pointerover', () => this.enterButtonOverState() )
        .on('pointerout', () => this.enterButtonNormalState() );
  }

  public userDisableInteractive() {
    this.removeInteractive();
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
}