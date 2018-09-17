import {Injectable} from '@angular/core';
import {User} from '../model/user.model';

@Injectable()
export class UserService {

  authenticate(): User {
    return new User('username', 'email', 'token');
  }

}
