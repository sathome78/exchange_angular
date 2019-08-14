/**
 * Class model for api error
 */
export class APIErrorReport {
  constructor(
    public userEmail: string,
    public url: string,
    public method: string,
    public respStatus: number | string,
    public responseBody: string,
  ) {}
}

