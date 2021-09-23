import {TextureKeys} from "~/consts/TextureKeys";
import {BusinessDefModel} from "~/model/BusinessDefModel";
import {UpgradeButton} from "~/game/UpgradeButton";
import SceneKeys from "~/consts/SceneKeys";
import {CustomEventsDef} from "~/consts/CustomEventsDef";
import {ManagerDefModel} from "~/model/ManagerDefModel";
import {PlayerModel} from "~/model/PlayerModel";

export class UpgradesPanel extends Phaser.GameObjects.Container {
  private managerDefModel: ManagerDefModel;
  private playerModel: PlayerModel;

  constructor (scene: Phaser.Scene, x?: number, y?:number) {
    super(scene, x, y);

    this.managerDefModel = this.scene.registry.get(ManagerDefModel.NAME) as ManagerDefModel;
    this.playerModel = this.scene.registry.get(PlayerModel.NAME) as PlayerModel;

    this.createUI();
  }

  private createUI(): void {
    // create the background
    this.add(this.scene.add.image(133, 320, TextureKeys.UpgradePanel));

    // create the avatar frame
    this.add(this.scene.add.image(117, 100, TextureKeys.Main, "avatar-frame.png"));

    // create the avatar
    this.add(this.scene.add.image(117, 100, TextureKeys.Main, "avatar01.png"));

    // TODO group avatar and frame into a button that opens a statistics popup when clicked

    // button: hire managers
    const buttonManagers = new UpgradeButton(this.scene, "Managers", 117, 240);
    this.add(buttonManagers);

    buttonManagers
      .on('pointerdown', () => {
        this.scene.scene.run(SceneKeys.Managers);
        this.scene.scene.moveBelow(SceneKeys.VFX, SceneKeys.Managers);
      } );

    this.scene.scene.get(SceneKeys.Game).events
        .on(CustomEventsDef.CashChanged, () => {
          // check if enough cash to buy any manager
          buttonManagers.activated = this.managerDefModel.canBuyAnyManagerExcept(this.playerModel.cash, this.playerModel.managers);
        });
  }
}