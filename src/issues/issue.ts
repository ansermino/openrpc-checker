export class DiffIssue {
  private readonly msg?: string;

  constructor(msg: string) {
    this.msg = msg;
  }

  public toString(): string {
    return `${this.msg}`;
  }
}
