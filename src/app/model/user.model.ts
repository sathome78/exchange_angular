export class User {
  username: string;
  email: string;
  token: string;

  constructor(username: string, email: string, token: string) {
    this.username = username;
    this.email = email;
    this.token = token;
  }
}
