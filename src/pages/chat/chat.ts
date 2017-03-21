import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Ortc } from '../../providers/ortc';
import { WriteMessagesPage } from '../write-messages/write-messages';

/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  private _ortc:Ortc;
  private channel:string;
  private channelMessages:any=[];
  private user:string;
  private _nav:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ortc:Ortc) {
  	this._ortc = ortc;
  	this._nav = navCtrl;
  	this.channel = this._ortc.selectedChannel;
  	this.channelMessages = this._ortc.ortcMessages[this.channel];
  	this.user = this._ortc.user;
  	this._ortc.resetUnRead(this._ortc.selectedChannel);
  }

  myGoBack() {

  }

  compose(){
  	this._nav.push(WriteMessagesPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
