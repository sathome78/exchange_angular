
export class ApiKeyItem {
  alias: string;
  allowTrade: boolean;
  allowWithdraw: boolean;
  generationDate: string;
  id: number;
  publicKey: string;
  userId: number;
}

export class NewApiKeyItem {
  alias: string;
  allowAcceptById: boolean;
  allowTrade: boolean;
  allowWithdraw: boolean;
  generationDate: string;
  id: number;
  permissions: any[];
  privateKey: string;
  publicKey: string;
  userEmail: string;
  userId: number;
}
