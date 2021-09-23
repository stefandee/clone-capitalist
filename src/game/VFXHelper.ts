import {TextureKeys} from "~/consts/TextureKeys";
import Phaser from "phaser";

export class VFXHelper {
  public static moneyFx(scene: Phaser.Scene) {
    const particles = scene.add.particles(TextureKeys.Main, "fx-money.png");

    const emitter = particles.createEmitter({
      frame: {
        frames: ["fx-money.png"],
        cycle: false,
        quantity: 1
      },
      x: 0,
      y: 0,
      speed: 100,
      gravityY: 100,
      lifespan: 1000,
      scale: 1.0,
      blendMode: Phaser.BlendModes.NORMAL,
      //frequency: -1,
      radial: true,
      angle: {min: 180, max: 360},
      rotate: { onEmit: () => Phaser.Math.Between(0, 360) },
      on: false
      //maxParticles: 16
    });

    // particles will fade out after their crossed a threshold in their lifespan
    emitter.setAlpha((p, k, t) => t < 0.8 ? 1.0 : 1.0 - (t - 0.8) / 0.2);

    return particles;
  }

  public static starsFx(scene: Phaser.Scene) {
    const particles = scene.add.particles(TextureKeys.Main, "fx-star.png");

    const emitter = particles.createEmitter({
      frame: {
        frames: ["fx-star.png"],
        cycle: false,
        quantity: 1
      },
      x: 0,
      y: 0,
      speed: 100,
      gravityY: 0,
      lifespan: 500,
      scale: 1.0,
      blendMode: Phaser.BlendModes.ADD,
      //frequency: -1,
      radial: true,
      angle: {min: 0, max: 360},
      rotate: { onEmit: () => Phaser.Math.Between(0, 360) },
      on: false
      //maxParticles: 16
    });

    // particles will fade out after their crossed a threshold in their lifespan
    emitter.setAlpha((p, k, t) => t < 0.8 ? 1.0 : 1.0 - (t - 0.8) / 0.2);

    return particles;
  }
}