export class PositionHelper {
  /**
   * Phaser doesn't seem to have a builtin way of transforming between local and global coordinates.
   * This is just a stitched version, might not work in all cases.
   *
   * @param obj
   * @returns {Phaser.Math.Vector2}
   */
  public static getCanvasPoint(obj, cam) {
    let mat = obj.getWorldTransformMatrix();

    // world position;
    let x = mat.getX(0, 0);
    let y = mat.getY(0, 0);

    // convert world position into canvas pixel space
    // let cam = this.scene.cameras.main;
    let displayScale = cam.scaleManager.displayScale;
    mat = cam.matrix;
    let tx = mat.getX(x - cam.scrollX, y - cam.scrollY) / displayScale.x;
    let ty = mat.getY(x - cam.scrollX, y - cam.scrollY) / displayScale.y;
    // x = Math.round(tx);
    // y = Math.round(ty);

    return new Phaser.Math.Vector2(Math.round(tx), Math.round(ty));
  }
}