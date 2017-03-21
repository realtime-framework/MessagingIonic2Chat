import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChatroomsPage } from '../chatrooms/chatrooms';
import { Ortc } from '../../providers/ortc';
import { ChatPage } from '../chat/chat';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  private isConnect:boolean = false;
  private currentlyStored:String = "Please insert your NickName!!!";
  private spanvisible:boolean = true;
  private inputvisible:boolean = false;
  private chatroomsdisable:boolean = true;
  private isConnected:String = "Not connect";
  private nick:string = "";
  private _nav: NavController;
  private _ortc:Ortc;
  private _ngZone:any;

  constructor(public navCtrl: NavController, public ortc:Ortc, public ngZone: NgZone) {
      this._ortc = ortc;
      this._nav = navCtrl;
      this._ngZone = ngZone;

      
      console.log("before connect");
      var OrtcPushPlugin = window['plugins'].OrtcPushPlugin;
      OrtcPushPlugin.connect(
      {
        'appkey':'ENTER-YOUR-REALTIME-APPKEY-HERE',
        'token':'appToken',
        'metadata':'androidMetadata',
        'projectId':'ENTER-YOUR-FIREBASE-SENDER-ID-HERE',
        'url':'https://ortc-developers.realtime.co/server/ssl/2.1/'
      }
      ).then( () => { 
          this._ortc.subscribeChannels();
          this.isConnect = true;
          this.chatroomsdisable = false;
          this.isConnected = "Got Connected";
          this.chatroomsdisable = false;
          console.log("connected");
          OrtcPushPlugin.getIsConnected().then((result) => {
            OrtcPushPlugin.log("isconnected: " + result);
          })
      });  


           

      if (window.localStorage.getItem('nickname') != null) {
        this.currentlyStored = window.localStorage.getItem('nickname');
        this._ortc.user = (window.localStorage.getItem('nickname'));
        this.spanvisible = false;
        this.inputvisible = true;
        this.connected();
        console.log("got nick");
      }
  }

  ionViewDidLoad() {
    var self = this;
    document.addEventListener("push-notification", 
    function(notification:any)
    {
      self._ngZone.run(() => {
        self._ortc.ortcPlugin.log("message: " + notification.payload);
        var parts;
        if (typeof notification.payload === 'string' || notification.payload instanceof String)
        {
          parts = notification.payload.split(":");
        }else{
          parts = notification.payload.message.split(":");
        }
        
        var channelMessages:any = self._ortc.ortcMessages[notification.channel];
        self._ortc.ortcPlugin.log("channelMessage: " + channelMessages);
        channelMessages.push({sender:parts[0], msg:parts[1]});
        
        if (notification.tapped == 1) {
          self._ortc.selectedChannel = notification.channel;
          self._nav.push(ChatPage);
        }
        
        if (self._nav.getActive().name !== "ChatPage" && self._nav.getActive().name !== "WriteMessagesPage") {
          console.log("window: " + self._nav.getActive().name);
          self._ortc.unread[notification.channel] = self._ortc.unread[notification.channel] + 1;
        }
        self._ortc.ortcPlugin.removeNotifications();      
      });
      
    }, false);  
  }


  gotoChatRooms(){
    this._nav.push(ChatroomsPage);
  }

  connected(){
    if (this.isConnect == true) {
      this.chatroomsdisable = false;
      this.isConnected = "Got Connected";
    }
  }

  updateStorage(){
    window.localStorage.setItem('nickname', this.nick);
    this._ortc.user = this.nick;
    this.spanvisible = false;
    this.inputvisible = true;
    this.currentlyStored = this.nick;
    this.connected();
    console.log("update storage");
  }

}
