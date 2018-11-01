import {Component, Input, OnInit} from '@angular/core';
import {ChatItem} from '../chat-item.model';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input() message: ChatItem;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  isMine(): boolean {
    return this.message.email === this.authService.getUsername();
  }

}
