
export class TokenHolder {

  constructor(public token: string,
              public nickname: string,
              private userId: number,
              public avatarPath: string,
              public language: string,
              public finPasswordSet: boolean,
              public referralReference: string) {}
}
