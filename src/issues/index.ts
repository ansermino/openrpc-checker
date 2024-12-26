export class DiffIssue {
  private readonly msg?: string;

  constructor(msg: string) {
    this.msg = msg;
  }

  public toString(): string {
    return `${this.msg}`;
  }
}

export * from './method';
export * from './methodParams';
export * from './methodResult';
