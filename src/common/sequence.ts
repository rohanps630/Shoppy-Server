export class Sequence<T, R> {
  private next: Sequence<T, R>;

  public addNext(next: Sequence<T, R>): this {
    if (this.next) {
      this.next.addNext(next);
    } else {
      this.next = next;
    }

    return this;
  }

  public async execute(context: T, arg: R): Promise<void> {
    if (this.next) {
      return await this.next.execute(context, arg);
    }

    return;
  }
}
