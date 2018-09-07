export class ValidateError {
  constructor(
    public name?: string,
    public rule?: string,
    public correct?: boolean,
    public text?: string,
    public input?: HTMLInputElement,
  ) { }
}
