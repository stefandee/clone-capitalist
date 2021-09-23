import Phaser from 'phaser';

import {TextureKeys} from '../consts/TextureKeys';
import SceneKeys from '../consts/SceneKeys';
import {BusinessDefModel} from "~/model/BusinessDefModel";
import {ManagerDefModel} from "~/model/ManagerDefModel";
import {CurrencyFormatter} from "~/util/CurrencyFormatter";
import {PlayerModel} from "~/model/PlayerModel";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super(SceneKeys.Preloader)
  }

  preload() {
    this.loadTextures();
    this.loadData();

    // TODO setup callback on this.load and display a loading bar
  }

  create() {
    this.initModels();

    /*console.log(CurrencyFormatter.format(1524));
    console.log(CurrencyFormatter.format(1525909));
    console.log(CurrencyFormatter.format(999999999.05));
    console.log(CurrencyFormatter.format(2345678901));*/

    // if this is a returning player, proceed to "PlayerReturnScene"; if a new player, proceed to the game
    const playerModel: PlayerModel = this.registry.get(PlayerModel.NAME) as PlayerModel;

    if (playerModel.storageExists()) {
      this.scene.start(SceneKeys.PlayerReturn);
    } else {
      this.scene.start(SceneKeys.Game);
    }
  }

  private loadTextures(): void {
    this.load.image(TextureKeys.MainBackground, 'sprites/backgrounds/main-background.png');
    this.load.image(TextureKeys.ManagersBackground, 'sprites/backgrounds/popup-managers-background.png');
    this.load.image(TextureKeys.UpgradePanel, 'sprites/backgrounds/main-upgrade-panel.png');
    this.load.atlas(TextureKeys.Main, 'sprites/main.png', 'sprites/main.json');
  }

  private loadData(): void {
    this.load.json('businessDef', 'data/business-def.json');
    this.load.json('managerDef', 'data/manager-def.json');
  }

  /**
   * Initialize models and data models.
   *
   * Using the build-in Phaser registry to store these models and share them between scenes. As this resembles a locator
   * service type of pattern and because it is not type strict, it might not adhere to the SOLID principles. However, it
   * is pretty fast to use for a prototype or even for a small game.
   *
   * Alternatively, a DI container could be used (Inversify.js for instance), but requires additional setup that doesn't fall
   * into the time restrictions for this prototype. It is possible to refactor this, if necessary.
   */
  private initModels(): void {
    this.registry.set(BusinessDefModel.NAME, new BusinessDefModel(this.cache.json.get('businessDef')));
    this.registry.set(ManagerDefModel.NAME, new ManagerDefModel(this.cache.json.get('managerDef')));

    const playerModel = new PlayerModel();
    playerModel.loadFromStorage();

    this.registry.set(PlayerModel.NAME, playerModel);
  }
}
