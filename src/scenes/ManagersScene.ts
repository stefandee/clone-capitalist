import Phaser from 'phaser';

import SceneKeys from '../consts/SceneKeys';
import {BusinessDefModel} from "~/model/BusinessDefModel";
import {ManagerDefModel} from "~/model/ManagerDefModel";
import {TextureKeys} from "~/consts/TextureKeys";
import {GenericButton} from "~/game/GenericButton";
import {ColorDef} from "~/consts/ColorDef";
import {FontDef} from "~/consts/FontDef";
import {HireManagerCard} from "~/game/HireManagerCard";

export default class ManagersScene extends Phaser.Scene {
  private static readonly MAX_ROWS: number = 5;

  private managerDefModel: ManagerDefModel;
  private businessDefModel: BusinessDefModel;

  constructor() {
    super(SceneKeys.Managers);
  }

  protected init() {
    this.managerDefModel = this.registry.get(ManagerDefModel.NAME) as ManagerDefModel;
    this.businessDefModel = this.registry.get(BusinessDefModel.NAME) as BusinessDefModel;
  }

  create() {
    const {width, height} = this.scale;

    const halfX = width * 0.5;
    const halfY = height * 0.5;

    // create the background
    const background = this.add.image(halfX, halfY, TextureKeys.ManagersBackground);

    // avoid bleeding pointer events through this modal
    background.setInteractive();

    // create the header
    this.add.image(halfX, halfY - 225, TextureKeys.Main, "popup-header-managers.png");

    this.add.text(halfX, halfY - 225, "Managers", {
      fontFamily: FontDef.Primary,
      fontSize: 48,
      color: ColorDef.MoneyCream,
      shadow: {fill: true, blur: 0, offsetY: 2},
    })
        .setScrollFactor(0)
        .setOrigin(0.5);

    // create the close button
    const closeButton: GenericButton = new GenericButton(
        this,
        "button-close-normal.png",
        "button-close-over.png",
        halfX + background.width / 2,
        halfY - background.height / 2);

    closeButton
        .on('pointerdown', () => {
          this.scene.sleep(SceneKeys.Managers);
        });

    this.add.existing(closeButton);

    // populate with managers data from ManagerDefModel
    this.createManagers();
  }

  private createManagers(): void {
    const {width, height} = this.scale;

    // TODO need data from ManagerDefModel and from PlayerModel
    const managerKeys = this.managerDefModel.managerKeys;

    let row = 0;
    let column = 0;

    // this.businessCards = [];

    managerKeys.forEach((key) => {
      const managerDef = this.managerDefModel.getManager(key);

      const card = new HireManagerCard(
          this,
          key,
          managerDef,
          this.businessDefModel.getBusiness(managerDef.business),
          width * 0.5 - 230 + column * 410,
          height * 0.5 - 140 + row * 77
      );
      this.add.existing(card);

      row++;

      if (row >= ManagersScene.MAX_ROWS) {
        row = 0;
        column++;
      }

      // this.businessCards.push(card);
    });
  }
}
