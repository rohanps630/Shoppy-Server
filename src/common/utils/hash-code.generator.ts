export class HashCodeGenerator {
  public static gernerate(string: string = ''): number {
    if (!string) return 0;

    string = string.trim();
    if (string.length < 1) return 1;

    const length = string.length;
    let hash = 0,
      i = 0,
      chr = 0;

    if (length === 0) return hash;
    for (i = 0; i < length; i++) {
      chr = string.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
    }

    return hash;
  }
}
