/**
 * Class model for api error
 */
export class APIError {
  constructor(
    public url: string,
    public cause: string,
    public detail: string,
    public args: string[],
    public title: string,
    public uuid: string,
    public code: number | string,
  ) {}
}
