import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Ortc } from '../../providers/ortc';

/*
  Generated class for the WriteMessages page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-write-messages',
  templateUrl: 'write-messages.html'
})

export class WriteMessagesPage {
	private channel:string;
	private message:string;
	private _ortc:any;
	private _nav:any;

	constructor(public navCtrl: NavController, public navParams: NavParams, public ortc:Ortc) {
		this._ortc = ortc;
		this._nav = navCtrl;
		this.channel = this._ortc.selectedChannel;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad WriteMessagesPage');
	}

	sendMessage(){
		this._ortc.send(this._ortc.user + ':' + this.message);
		this.myGoBack();
	}

	myGoBack() {
		this._nav.pop();
	}

}
