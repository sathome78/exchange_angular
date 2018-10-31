import {Injectable} from '@angular/core';
import {ChatItem} from './chat-item.model';
import {Subject} from 'rxjs';
import {Message} from '@stomp/stompjs';
import {environment} from '../../../environments/environment';
import {LangService} from '../../services/lang.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthenticationService} from 'ng-jwt';
import {StompService} from '@stomp/ng2-stompjs';
import {TOKEN} from '../../services/http.utils';
import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';
import {SimpleChat } from './simple-chat.model';
import {DateChatItem} from './date-chat-item.model';

@Injectable()
export class ChatService {

  chatListener: Subject<ChatItem> = new Subject<ChatItem>();

  simpleChatListener: Subject<SimpleChat> = new Subject<SimpleChat>();

  private stompSubscription: any;

  HOST = environment.apiUrl;

  constructor(private langService: LangService,
              private httpClient: HttpClient,
              private stompService: StompService) {
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
    this.stompSubscription = this.stompService
      .subscribe('/topic/chat/' + lang)
      .pipe(map((message: Message) => {
        // console.log(message);
        return message.body;
      }))
      .subscribe((message: string) => {
          // this.chatItems.push(ChatItem.fromString(message));
          this.simpleChatListener.next(SimpleChat.fromChatItem(ChatItem.fromString(message)));
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

