export class CollectionValueReaderByKey<T> {
  private constructor(public readonly list: T[]) {}

  public static of<T>(list: T[]): CollectionValueReaderByKey<T> {
    return new CollectionValueReaderByKey<T>(list);
  }

  public findByKeyNameAndValue(key: string | string, value: string | string): T {
    if (!key || !value) return null;
    if (!this.list || this.list.length < 1) return null;

    for (let i = 0; i < this.list.length; i++) {
      const element = this.list[i];
      if (element == null) {
        continue;
      }
      if (element['' + key] == value) {
        return element;
      }
    }

    return null;
  }
}
