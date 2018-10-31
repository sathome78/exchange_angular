import {Component, OnDestroy, OnInit} from '@angular/core';

import {AbstractDashboardItems} from '../abstract-dashboard-items';
import {ChatService} from './chat.service';
import {SimpleChat} from './simple-chat.model';
import {Subscription} from 'rxjs';
import {DateChatItem} from './date-chat-item.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent extends AbstractDashboardItems implements OnInit {
  /** dashboard item name (field for base class)*/
  public itemName: string;

  mesMock = '[{"date":"2017-07-13","messages":[{"email":"mshahidnawaz9@gmail.com","body":"Plz tell me the process of withdrawal from Exrates exchange to osome other Exchange","messageTime":"2017-07-13 14:32:12"},{"email":"mshahidnawaz9@gmail.com","body":"I want to withdraw my EDR to other exchange what\'s the proceaa","messageTime":"2017-07-13 14:31:25"},{"email":"fajar3budi@gmail.com","body":"Tes","messageTime":"2017-07-13 06:17:39"},{"email":"msswito@yahoo.com","body":"U","messageTime":"2017-07-13 04:09:57"},{"email":"msswito@yahoo.com","body":"U","messageTime":"2017-07-13 04:09:54"},{"email":"Nestorchirino@gmail.com","body":"hi","messageTime":"2017-07-13 00:50:11"}]},{"date":"2017-07-12","messages":[{"email":"mshahidnawaz9@gmail.com","body":"Hi","messageTime":"2017-07-12 23:21:29"},{"email":"mshahidnawaz9@gmail.com","body":"Hi","messageTime":"2017-07-12 23:08:27"},{"email":"akorede4odum@gmail.com","body":"EDR not fast selling?","messageTime":"2017-07-12 18:44:03"},{"email":"akorede4odum@gmail.com","body":"HI","messageTime":"2017-07-12 18:43:26"},{"email":"akorede4odum@gmail.com","body":"HI","messageTime":"2017-07-12 18:43:12"},{"email":"rusdianelfath@gmail.com","body":"Karna ada beberapa negara yg tidak menerima BTC","messageTime":"2017-07-12 11:43:36"},{"email":"rusdianelfath@gmail.com","body":"Berita buruk BTC. Perkiraan akan turun sampai 29 jt","messageTime":"2017-07-12 11:33:51"},{"email":"btozdolap@gmail.com","body":"Edr satabilen var mı ?","messageTime":"2017-07-12 10:21:03"},{"email":"fordayslife@gmail.com","body":"Buy EDR will gain next few days .. Buy always and save at mining","messageTime":"2017-07-12 09:56:15"},{"email":"jayatisuci23@gmail.com","body":"Apa exrates tdk punya dompet btc y.","messageTime":"2017-07-12 04:13:02"},{"email":"jayatisuci23@gmail.com","body":"Saya cari 2 alamat dompet btc ane kok gak ada y.","messageTime":"2017-07-12 04:12:23"},{"email":"jayatisuci23@gmail.com","body":"Gan ane pendatang baru.mau tanya apakah exrates punya alamat bitcoin","messageTime":"2017-07-12 04:11:11"}]},{"date":"2017-07-11","messages":[{"email":"umit.oktay@gmail.com","body":"ı SEND EDR FROM WALLET BUT DONT COME? WHY","messageTime":"2017-07-11 14:46:06"},{"email":"fordayslife@gmail.com","body":"EDR will be gain ","messageTime":"2017-07-11 11:11:19"},{"email":"fordayslife@gmail.com","body":"Don\'t sell EDR hold your edr because Alibaba.com will accept payment from EDR coin","messageTime":"2017-07-11 11:11:08"},{"email":"fordayslife@gmail.com","body":"Hello all","messageTime":"2017-07-11 11:10:27"},{"email":"rusdianelfath@gmail.com","body":"Saya jual edr harga Rp 400 hub 081388781200","messageTime":"2017-07-11 02:58:20"},{"email":"rusdianelfath@gmail.com","body":"Kabar coin atb gmn ?","messageTime":"2017-07-11 02:40:04"},{"email":"rusdianelfath@gmail.com","body":"Cuma 30 jutaann","messageTime":"2017-07-11 02:38:50"},{"email":"rusdianelfath@gmail.com","body":"Btc anjlokkk","messageTime":"2017-07-11 02:38:40"},{"email":"rusdianelfath@gmail.com","body":"Agam ki opo gann","messageTime":"2017-07-11 02:38:25"}]},{"date":"2017-07-10","messages":[{"email":"zaenalabidinzf@gmail.com","body":"yang mau deposito euro di AGAM perusahaan besar sudah di 35 negara lebih, WA 087870052819 dijamin profit terus no scam","messageTime":"2017-07-10 18:34:34"},{"email":"zaenalabidinzf@gmail.com","body":"saya jual 100 ribu edr harga 300 langsung gak pake exchanger .. 087870052819","messageTime":"2017-07-10 18:33:14"},{"email":"fatihbagceci86@gmail.com","body":"BURDA SATIŞ NASIL YAPILIYOR","messageTime":"2017-07-10 15:30:31"},{"email":"shailendra895@gmail.com","body":"withdrawal payment nahi aa rahi hai","messageTime":"2017-07-10 09:23:16"},{"email":"rusdianelfath@gmail.com","body":"Saya jual edr harga Rp 400 hub 081388781200","messageTime":"2017-07-10 05:14:13"}]},{"date":"2017-07-09","messages":[{"email":"ajet_terbuni@hotmail.com","body":"hi","messageTime":"2017-07-09 17:28:41"},{"email":"m21.sibal@gmail.com","body":"o.ç cevapta vermiyorlar","messageTime":"2017-07-09 11:48:08"},{"email":"m21.sibal@gmail.com","body":"allah aşkına bu borsa neye yarıyor biri bana soylesin","messageTime":"2017-07-09 11:47:47"},{"email":"m21.sibal@gmail.com","body":"hayatımda gördüğüm en saçma borsa extrates","messageTime":"2017-07-09 11:47:31"},{"email":"yilmaztutar@mynet.com","body":"satış işlemleri kaç gün sürer","messageTime":"2017-07-09 09:08:52"},{"email":"yilmaztutar@mynet.com","body":"burda satışa emir verdim.2 gün oldu hala ses yok","messageTime":"2017-07-09 09:06:45"},{"email":"fajar3budi@gmail.com","body":"EDR di Jual murah supaya balik modal yaaaa..... Murah boleh tapi jangan Murahan...  Seperti exrate yg bisa mempertahankan EDR supaya tidak murahan, walupun di hujat terus tapi exrate tetap menjaganya dengan baik...","messageTime":"2017-07-09 08:35:35"},{"email":"fajar3budi@gmail.com","body":"Tes","messageTime":"2017-07-09 08:31:49"}]},{"date":"2018-10-23","messages":[{"email":"anonymous","body":"test message","messageTime":"2018-10-23 09:39:07"},{"email":"anonymous","body":"test message","messageTime":"2018-10-23 09:39:06"},{"email":"anonymous","body":"test message","messageTime":"2018-10-23 09:39:06"},{"email":"anonymous","body":"test message","messageTime":"2018-10-23 09:39:00"},{"email":"anonymous","body":"test message","messageTime":"2018-10-23 09:39:00"},{"email":"anonymous","body":"test message","messageTime":"2018-10-23 09:39:00"},{"email":"anonymous","body":"Hi from Neptun","messageTime":"2018-10-23 00:07:08"},{"email":"anonymous","body":"Hi from Jupiter","messageTime":"2018-10-23 00:06:27"}]},{"date":"2018-10-22","messages":[{"email":"anonymous","body":"Hi from Moon","messageTime":"2018-10-22 23:58:45"},{"email":"anonymous","body":"Hi from Mars","messageTime":"2018-10-22 23:58:07"}]}]';


  // todo please implement sorting as backend returns sorted by date ascending with limit of 50 messages
  dateChatItems: DateChatItem [];

  constructor(private chatService: ChatService) {
    super();
  }

  ngOnInit() {
    this.itemName = 'chat';
    // this.chatService.findAllChatMessages().subscribe(messages => {
    //   if (messages.length) {
    //     this.dateChatItems = messages;
    //     this.addTodayIfNecessary();
    //   }
    // });
    this.dateChatItems = JSON.parse(this.mesMock);
    console.log(this.dateChatItems);
  }

  /**
   * to work properly we must be sure we have today wrapper to accept socket messages
   */
  addTodayIfNecessary() {
    const index = this.dateChatItems.length - 1;
    if (this.dateChatItems[index].date !== new Date()) {
      this.dateChatItems.push(new DateChatItem(new Date()));
    }
  }

  onSendChatMessage(message: string) {
    this.chatService.sendNewMessage(message)
      .subscribe(res => {
          console.log(res);
        },
        error1 => {
          console.log(error1);
        });
  }


}
