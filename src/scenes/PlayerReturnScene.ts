import Phaser from 'phaser'

import SceneKeys from '../consts/SceneKeys'
import {TextureKeys} from "~/consts/TextureKeys";
import {GenericLabelButton} from "~/game/GenericLabelButton";
import {PlayerModel} from "~/model/PlayerModel";
import {CurrencyFormatter} from "~/util/CurrencyFormatter";
import {ColorDef} from "~/consts/ColorDef";
import {TimeDurationFormatter} from "~/util/TimeDurationFormatter";
import {FontDef} from "~/consts/FontDef";
import {IOfflineStats, PlayerReturnService} from "~/services/PlayerReturnService";
import {BusinessDefModel} from "~/model/BusinessDefModel";

export class PlayerReturnScene extends Phaser.Scene {
  private offlineStats: IOfflineStats;

  constructor() {
    super(SceneKeys.PlayerReturn);
  }

  public init() {
    const service = new PlayerReturnService(
        this.registry.get(PlayerModel.NAME) as PlayerModel,
        this.registry.get(BusinessDefModel.NAME) as BusinessDefModel
    );

    this.offlineStats = service.computeOfflineStats();
  }

  create() {
    const {width, height} = this.scale;

    const halfX = width * 0.5;
    const halfY = height * 0.5;

    // create the background
    this.add.image(halfX, halfY, TextureKeys.MainBackground);

    // header label
    this.add.text(halfX, halfY - 260, "Welcome back, Capitalist!", {
      fontFamily: FontDef.Primary,
      fontSize: 64,
      color: ColorDef.HeaderBlue
    })
        .setScrollFactor(0)
        .setOrigin(0.5);

    // TODO time offline
    this.add.text(halfX, halfY - 180, `You were offline for ${TimeDurationFormatter.format(Math.floor(this.offlineStats.time / 1000))}`, {
      fontFamily: FontDef.Primary,
      fontSize: 32,
      color: ColorDef.ParagraphGray
    })
        .setScrollFactor(0)
        .setOrigin(0.5);

    // you earned X while you were gone.
    this.add.text(halfX, halfY - 60, "You've earned", {
      fontFamily: FontDef.Primary,
      fontSize: 32,
      color: ColorDef.ParagraphGray
    })
        .setScrollFactor(0)
        .setOrigin(0.5);

    this.add.text(halfX, halfY, `${CurrencyFormatter.plainFormat(this.offlineStats.profit)}`, {
      fontFamily: FontDef.Primary,
      fontSize: 40,
      color: ColorDef.HighlightGreen
    })
        .setScrollFactor(0)
        .setOrigin(0.5);

    this.add.text(halfX, halfY + 60, "while you were away.", {
      fontFamily: FontDef.Primary,
      fontSize: 32,
      color: ColorDef.ParagraphGray
    })
        .setScrollFactor(0)
        .setOrigin(0.5);

    // TODO motivational label!
    this.add.text(halfX, halfY + 140, "Let's make more profit!", {
      fontFamily: FontDef.Primary,
      fontSize: 40,
      color: ColorDef.ParagraphGray
    })
        .setScrollFactor(0)
        .setOrigin(0.5);

    // create the continue button to navigate to main (Game) scene
    this.createCloseButton();
  }

  private createCloseButton() {
    // create the close button
    const closeButton: GenericLabelButton = new GenericLabelButton(
        this,
        "button-green-normal.png",
        "button-green-over.png",
        "Awesome!",
        {
          fontFamily: FontDef.Primary,
          fontSize: 32,
          color: '#323232',
        },
        this.scale.width - 125,
        this.scale.height - 45);

    closeButton
        .on('pointerdown', () => {
          this.scene.stop(SceneKeys.PlayerReturn);
          this.scene.start(SceneKeys.Game);
        });

    this.add.existing(closeButton);
  }
}
