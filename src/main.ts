import Phaser from 'phaser'

import Preloader from "./scenes/Preloader";
import Game from "./scenes/Game";
import ManagersScene from "./scenes/ManagersScene";
import {PlayerReturnScene} from "~/scenes/PlayerReturnScene";
import VFX from "~/scenes/VFX";

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 960,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug: true
		}
	},
	scene: [Preloader, Game, ManagersScene, PlayerReturnScene, VFX]
};

export default new Phaser.Game(config)
