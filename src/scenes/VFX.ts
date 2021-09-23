import Phaser from "phaser";
import SceneKeys from "~/consts/SceneKeys";
import {VFXHelper} from "~/game/VFXHelper";
import {CustomEventsDef} from "~/consts/CustomEventsDef";

/**
 * Visual Effects Layer
 *
 * Is displayed on top of all scenes.
 */
export default class VFX extends Phaser.Scene {
  private particlesMoneyFx;
  private particlesStarsFx;

  constructor() {
    super(SceneKeys.VFX);
  }

  protected create(): void {
    // particles
    this.particlesMoneyFx = VFXHelper.moneyFx(this);
    this.particlesStarsFx = VFXHelper.starsFx(this);

    // events
    this.events
        .on(CustomEventsDef.MoneyVFX, this.handleMoneyVFX, this);
    this.events
        .on(CustomEventsDef.StarsVFX, this.handleStarsVFX, this);
  }

  /**
   * TODO Coordinates received are in Canvas space, so they should be transformed to local space.
   *
   * @param {number} count
   * @param {number} x
   * @param {number} y
   */
  private handleMoneyVFX(count: number, x: number, y:number) {
    this.particlesMoneyFx.emitParticle(count, x, y);
  }

  private handleStarsVFX(count: number, x: number, y:number) {
    this.particlesStarsFx.emitParticle(count, x, y);
  }
}