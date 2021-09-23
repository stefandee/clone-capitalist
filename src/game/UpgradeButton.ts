import {TextureKeys} from "~/consts/TextureKeys";
import {FontDef} from "~/consts/FontDef";

export class UpgradeButton extends Phaser.GameObjects.Container {
  private imageActivated: Phaser.GameObjects.Image;
  private imageNormal: Phaser.GameObjects.Image;
  private imageOver: Phaser.GameObjects.Image;

  constructor (scene: Phaser.Scene, label: string, x?: number, y?:number) {
    super(scene, x, y);

    this.imageNormal = this.scene.add.image(0, 0, TextureKeys.Main, "button-upgrade-normal.png");
    this.imageOver = this.scene.add.image(0, 0, TextureKeys.Main, "button-upgrade-over.png");
    this.imageActivated = this.scene.add.image(-81, -3, TextureKeys.Main, "button-upgrade-ready.png");

    this.add(this.imageNormal);
    this.add(this.imageOver);

    const text = this.scene.add.text(0, -3, label, {
      fontFamily: FontDef.Primary,
      fontSize: 32,
      // align: "center",
      color: '#574f47'
    })
        .setScrollFactor(0)
        .setOrigin(0.5, 0.5);

    this.add(text);
    this.add(this.imageActivated);

    this.initDefaultState();

    this.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(-100, -20, 200, 40),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        useHandCursor: true }
      )
        .on('pointerover', () => this.enterButtonOverState() )
        .on('pointerout', () => this.enterButtonNormalState() );
        //.on('pointerdown', () => this.enterButtonActiveState() )
        //.on('pointerup', () => this.enterButtonOverState() );
  }

  public set activated(v: boolean) {
    this.imageActivated.visible = v;
  }

  protected initDefaultState(): void {
    this.imageOver.visible = false;
    this.imageActivated.visible = false;
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