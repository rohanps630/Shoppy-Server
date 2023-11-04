export class RandomNumberGenetrator {
  public static gernerate(length: number) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
  }
}
