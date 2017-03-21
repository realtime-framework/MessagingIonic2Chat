import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Ortc provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Ortc {
	public ortcMessages:any = {};
	public unread:any = {};
	public channels:any = [];
	public ortcPlugin:any;
	public selectedChannel:string;
	public user:string = '';

	constructor(public http: Http) {
		this.ortcPlugin = window['plugins'].OrtcPushPlugin;		
		this.ortcPlugin.enableHeadsUpNotifications();	
		this.loadChannels();	
	}

	loadChannels(){
		if (window.localStorage.getItem('channels')) {
	  		this.channels = JSON.parse(window.localStorage.getItem('channels'));
	  		for (var i = 0; i < this.channels.length; i++) {
	    		var channel = this.channels[i];
	    		this.ortcMessages[channel] = [];
		  	}
		}
		this.ortcPlugin.log("channels: " + JSON.stringify(this.ortcMessages));
	}

	subscribeChannels(){
		for (var i = 0; i < this.channels.length; i++) {
    		var channel = this.channels[i];
    		this.ortcPlugin.log("channel: " + JSON.stringify(this.ortcMessages[channel]));
    		this.subscribeWithNotifications(channel);
	  	}
	}

	pushNotification(notification:any){

	}

	subscribeWithNotifications(channel){  
		console.log("onSubscribe");
		this.resetUnRead(channel);   
		this.ortcPlugin.subscribe({'channel':channel}).then(() => {
		      console.log("subscribe with push channel");
		  });
	}

  	resetUnRead(channel){
		this.unread[channel] = 0;
		return this.unread[channel];
	}

	send(message){
		this.ortcPlugin.send({'channel':this.selectedChannel,'message':message});
	}

}
