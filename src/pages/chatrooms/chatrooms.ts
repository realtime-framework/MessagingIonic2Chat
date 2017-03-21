import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Ortc } from '../../providers/ortc';
import { ChatPage } from '../chat/chat';
/*
  Generated class for the Chatrooms page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chatrooms',
  templateUrl: 'chatrooms.html'
})
export class ChatroomsPage {
  private visibleAddChannels:boolean = false;
  private _ortc:Ortc;
  private newChannel:string;
  private _nav:any;
  private _ngZone:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ortc:Ortc, public ngZone: NgZone) {
    this._ortc = ortc;
    this._nav = navCtrl;
    this._ngZone = ngZone;
    this._ortc.ortcPlugin.checkForNotifications();
  }

  addChannels(){
    this.visibleAddChannels = true;
  }

  addChannel(){
      if (this.newChannel === '') {
        return;
      };
      this._ortc.channels.push(this.newChannel);
      window.localStorage.setItem('channels', JSON.stringify(this._ortc.channels));
      this._ortc.ortcPlugin.log("saved channels: " + JSON.stringify(this._ortc.channels));
      this._ortc.ortcMessages[this.newChannel] = [];
      this._ortc.subscribeWithNotifications(this.newChannel);
      this.newChannel = '';
  }


  done(){
    this.visibleAddChannels = false;
  }

  removeChannel(item){
    this._ortc.ortcPlugin.unsubscribe({'channel':item}).then(function(){
      this._ortc.ortcPlugin.log("unsubscribe");
    });

    for(var i = 0; i < this._ortc.channels.length; i++) { 
      if(this._ortc.channels[i] == item){
        this._ortc.channels.splice(i, 1);
        break;
      }
    }
    window.localStorage.setItem('channels', JSON.stringify(this._ortc.channels));
  }

  selectedChannel(item){
    for(var i = 0; i < this._ortc.channels.length; i++) { 
      if(this._ortc.channels[i] == item){
        this._ortc.selectedChannel = this._ortc.channels[i];
       this._ortc.ortcPlugin.log('selected channel: ' + this._ortc.selectedChannel);
        break;
      }
    }
    this._nav.push(ChatPage);
  }
  
}
