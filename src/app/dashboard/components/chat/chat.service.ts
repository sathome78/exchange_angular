import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {StompService} from '@stomp/ng2-stompjs';
import {Subject, Observable} from 'rxjs';

import {ChatItem} from './chat-item.model';
import {environment} from 'environments/environment';
import {LangService} from 'app/shared/services/lang.service';
import {TOKEN} from 'app/shared/services/http.utils';
import {SimpleChat } from './simple-chat.model';

@Injectable()
export class ChatService{

  simpleChatListener: Subject<SimpleChat> = new Subject<SimpleChat>();

  private stompSubscription: any;

  HOST = environment.apiUrl;

  constructor(private langService: LangService,
              private httpClient: HttpClient,
              private stompService: StompService) {
    // this.setStompSubscription('en');
  }
  /**
   * this method subscribes for chat event and works as cold stream
   * it receives only recent messages, created after subscription
   * best usage is in client while listening to language update event
   * when language gets updated new subscription is established
   *
   * @param lang - current language must be set to lower case
   */
  setStompSubscription(lang: string) {
    this.stompService
      .subscribe('/topic/chat/' + lang)
      .subscribe(msg => {
        // console.log(JSON.parse(msg.body));
        this.simpleChatListener.next(JSON.parse(msg.body));
      });
  }

  /**
   * in this release this feature is not supported;
   *
   * @param {ChatItem} message
   */
  private sendMessage(message: ChatItem) {
    const that = this;
    const destination = '/topic/chat/' + that.langService.getLanguage();
    this.stompService.publish(destination, JSON.stringify(message), {EXRATES_REST_TOKEN: localStorage.getItem(TOKEN)});
  }

  unsubscribeStomp() {
    this.stompSubscription.unsubscribe();
  }

  /**
   * Returns all massages from backend (limit not supported now) and sets to chatItems
   * and sends them via event channel
   *
   * @returns void
   *
   */
  findAllChatMessages(): Observable<IDateChat[]> {
    const url = this.HOST + '/info/public/v2/chat/history';
    const lang = 'en';
    const params = {
      params: new HttpParams().append('lang', lang),
    };
    return this.httpClient.get<IDateChat[]>(url, params);
      // .subscribe(
      // (messages: SimpleChat[]) => {
      //   this.simpleChatItems = messages;
      //   this.simpleChatListener.next(messages);
      // });
  }

  /**
   * Sends public message via http message, never update object keys as they must coincide with backend
   * no need to add this message on front end as we're supposed to get after successful store via stomp
   *
   * @param {string} message   - text of the message - required
   * @param {string} email  - authenticated user email, not required
   * @returns {Promise<ChatItem>}
   *
   */
  sendNewMessage(message: string, email?: string): Observable<ChatItem> {
    const url = this.HOST + '/info/public/v2/chat';
    const body = {
      'EMAIL': email ? email : '',
      'LANG': this.langService.getLanguage().toUpperCase(),
      'MESSAGE': message
    };
    return this.httpClient.post<ChatItem>(url, body);
  }

  isValidChatItem(message: string): boolean {
    return JSON.parse(message).nickname;
  }

}

export interface IDateChat {
   date: Date;
   messages: SimpleChat[];
}

