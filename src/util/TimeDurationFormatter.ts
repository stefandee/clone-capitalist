export class TimeDurationFormatter {
  public static format(sec: number): string {
    let h = Math.floor(sec / 3600);
    let m = Math.floor((sec - (h * 3600)) / 60);
    let s = sec - (h * 3600) - (m * 60);

    let hours = h.toString(), minutes = m.toString(), seconds = s.toString();

    if (h < 10) {
      hours = "0" + h.toString();
    }

    if (m < 10) {
      minutes = "0" + m.toString();
    }

    if (s < 10) {
      seconds = "0" + s.toString();
    }

    return hours + ':' + minutes + ':' + seconds;
  }
}