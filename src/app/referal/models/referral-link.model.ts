export class ReferralLink {
  public numberChild: number;
  public name: string;
  public link: string;
  public earnedBTC: number;
  public earnedUSD: number;
  public earnedUSDT: number;
  public main: boolean;
  public level: number | null;
  public userId: number | null;
  public userEmail: string | null;
  public childs?: ReferralLink[] | null;
}

export class RefParams {
  public name: string;
  public link: string;
  constructor(name: string, link: string) {
    this.name = name;
    this.link = link;
  }
}
