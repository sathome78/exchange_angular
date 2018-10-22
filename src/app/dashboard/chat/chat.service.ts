import {Injectable} from '@angular/core';
import {ChatItem} from './chat-item.model';
import {Subject} from 'rxjs';
import {Message} from '@stomp/stompjs';
import {environment} from '../../../environments/environment';
import {LangService} from '../../services/lang.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthenticationService} from 'ng-jwt';
import {StompService} from '@stomp/ng2-stompjs';
import {MEDIA_TYPE_JSON, TOKEN} from '../../services/http.utils';
import {Observable} from 'rxjs';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class ChatService {

  chatItems: ChatItem [] = [];
  chatListener: Subject<ChatItem[]> = new Subject<ChatItem[]>();

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
    this.findAllChatMessages();
    this.stompSubscription = this.stompService
      .subscribe('/app/topic/chat/' + lang)
      .pipe(map((message: Message) => {
        console.log(message);
        return message.body;
      }))
      .subscribe((message: string) => {
        if (this.isValidChatItem(message)) {
          this.chatItems.push(ChatItem.fromString(message));
          this.chatListener.next(this.chatItems.sort(chatItemComp));
        }
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
  findAllChatMessages() {
    const url = this.HOST + '/info/public/v2/chat/history';
    const lang = this.langService.getLanguage().toLowerCase();
    const params = {
      params: new HttpParams().append('lang', lang),
      headers: MEDIA_TYPE_JSON
    };
    this.httpClient.get<ChatItem[]>(url, params)
      .subscribe(
      (messages: ChatItem[]) => {
        this.chatItems = messages;
        this.chatListener.next(this.chatItems.sort(this.chatItemComp));
      });
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
    return this.httpClient.post<ChatItem>(url, body, {headers: MEDIA_TYPE_JSON});
  }

  isValidChatItem(message: string): boolean {
    return JSON.parse(message).nickname;
  }

  chatItemComp(left: ChatItem, right: ChatItem) {
    return left.id > right.id ? 1 : -1;
  }

}

export function chatItemComp(left: ChatItem, right: ChatItem) {
  return left.id > right.id ? 1 : -1;
}

