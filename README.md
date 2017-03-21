# Mobile chat using Ionic 2 and Realtime Messaging

This example shows how to build a cross-platform chat app for iOS and Android using the Ionic 2 Framework and the Realtime Messaging platform.

The app allows users to define chat rooms (or groups) and exchange messages with all the users subscribing the room.

The users that are not using the app when a new message is published will receive a mobile push notification through APNS (iOS) or Firebase Cloud Messaging (Android).

[Ionic](http://ionicframework.com/) is an open source mobile SDK for developing native and progressive web apps.

[Realtime Messaging](https://framework.realtime.co/messaging/) is a cloud based message broker, enabling developers to build cross-platform apps that require realtime communication between devices.

**NOTE: If you're looking for an Ionic 1 example checkout [https://github.com/realtime-framework/MessagingIonicChat](https://github.com/realtime-framework/MessagingIonicChat) **

## Running this example
The folowing sub-sections of this guide will show you how to build and run the Ionic/Realtime chat app.

For a more detailed view over the development steps refer to last section of this document.

### Installing Ionic
If you already have Ionic installed you can skip this step.

Install Ionic and create a new project following the instructions available [here](http://ionicframework.com/getting-started/).

As soon as you are able to run the Ionic starting example project you can proceed with the remaining steps.


### Adding CordovaPush plugin

CordovaPush is the Realtime Messaging plugin for Ionic, Cordova and PhoneGap frameworks. It enables your app to receive (APNS/FCM) push notifications. 

This plugin will be responsible for sending and receiving the chat messages. It will also handle the push notifications when the users receive a chat message and they are not using the app.

To add the plugin to your project simply enter the following command in your project folder:

	ionic plugin add cordovapush 

If you want more details about this plugin you can check [this GitHub repository](https://github.com/realtime-framework/CordovaPush).

### Getting your Free Realtime Messaging subscription
If you already have a Realtime Messaging subscription you can skip this step.

Click [here](https://accounts.realtime.co/signup/) to register for a Realtime account and subscribe the Realtime Messaging service using the Free plan. 

You'll get a 6 alpha-numeric application key (aka appkey) and make note of it, you'll have to enter it in your app code when the connection to Realtime is established.

### Configuring push notifications

To receive push notifications from APNS (iOS) and Firebase Cloud Messaging (Android), you need to configure both platforms (or only the one you are intending to use) and enter their credentials in the Realtime Account Management website. This way Realtime will be able to send push notifications to your app.

#### Configuring for iOS (APNS)
Take a deep breath and follow [this step-by-step tutorial](http://messaging-public.realtime.co/documentation/starting-guide/mobilePushAPNS.html) to configure your Realtime subscription for iOS push notifications.

#### Configuring for Android (FCM)
It's a bit simpler than the iOS configuration and clearly the best way to go over it is following
[this step-by-step tutorial](http://messaging-public.realtime.co/documentation/starting-guide/mobilePushGCM.html) to configure your Realtime subscription for Firebase Cloud Messaging push notifications.

### Testing the app
Now that you have installed the plugin and configured the iOS and Android push notifications, you are only a few steps away from running our example app:

* Copy the `src` folder of this repository to your project `src` folder (if you haven't done it already) 
* Edit the file `src/pages/home/home.ts` and enter your Realtime application key and Firebase Cloud Messaging SenderID in the OrtcPushPlugin.connect method call.

Using the Ionic CLI comamnds, build and run the app in your platform of choice!



## Development steps
In this section we'll guide you through the main steps involved in developing our Ionic/Realtime chat app.

### Creating providers to share data between Ionic views

In file `providers/ortc.js` we added a provider to store the chat messages, to manage the currently selected chat and user nickname.

*	Received messages

	To manage the received messages we need to create a provider with the following code: 
	
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
		

### The login view

![](http://messaging-public.realtime.co/screenshots/2.1.0/ionic/login.png)

The starting view of our app.

It will connect to Realtime, request the user to enter a nickname and save it on the device local storage (or use the previously entered nickname if already configured).

The login view controller `Home.ts` is defined in file `pages/home/home.ts` and is responsible for connecting to Realtime with the following code: 

	var OrtcPushPlugin = window['plugins'].OrtcPushPlugin;
      OrtcPushPlugin.connect(
      {
        'appkey':'YOUR-APPKEY-HERE',
        'token':'appToken',
        'metadata':'androidMetadata',
        'projectId':'YOUR-FIREBASE-SENDER-ID-HERE',
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
	    
The login view is defined in `pages/home/home.html` and as soon as the user enters a nickname in the `nickname` input field, the `updateStorage` function is invoked.

It stores the user nickname in the local storage, set's its value in the `ortc` provider and updates the user interface if the Realtime connection is already established:
	
	updateStorage(){
		window.localStorage.setItem('nickname', this.nick);
		this._ortc.user = this.nick;
		this.spanvisible = false;
		this.inputvisible = true;
		this.currentlyStored = this.nick;
		this.connected();
		console.log("update storage");
	}

#### Handling incoming chat messages
  
Another important part of the Login controller is handling the incoming chat messages or push notifications. This is achieved by setting a listener for the `push-notification` event. This event is emitted by the CordovaPush plugin when a new message is received:

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

The `push-notification` listener parses the message received (with `[NICKNAME]:[MESSAGE]` format), pushes it to the `ortcmessages` provider message hash, updates the unread count and clears the pending push notifications buffer.

*Please keep in mind this is a simple messaging demo where the chat messages are not persisted outside the device. In a real scenario the chat messages should be saved in a database like [Realtime Cloud Storage](https://framework.realtime.co/storage/) and retrieved when the user selects the chat. This way messages are not lost if the user is not connected to the app and doesn't tap the received push notifications.*                               

### Chat rooms view

![](http://messaging-public.realtime.co/screenshots/2.1.0/ionic/chatroom.png)

The chat rooms view is defined in file `pages/chatRooms/chatRooms.html` and its controller in file `pages/chatRooms/chatRooms.ts`.

#### Subscribing to chat room channels
This view is responsible for subscribing to new chat rooms as well as listing the chat rooms already subscribed by the user. Each chat room maps to a Realtime pub/sub channel.

These channels are saved in the local storage, so when the view loads, we can iterate the channels list and subscribe them using push notifications with the following code in the `ortc` provider:

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

The `this._ortc. subscribeChannels()` function uses the CordovaPush plugin `subscribe` method to subscribe each chat room channel:
	
	subscribeChannels(){
		for (var i = 0; i < this.channels.length; i++) {
    		var channel = this.channels[i];
    		this.ortcPlugin.log("channel: " + JSON.stringify(this.ortcMessages[channel]));
    		this.subscribeWithNotifications(channel);
	  	}
	}
	
	subscribeWithNotifications(channel){  
		console.log("onSubscribe");
		this.resetUnRead(channel);   
		this.ortcPlugin.subscribe({'channel':channel}).then(() => {
		      console.log("subscribe with push channel");
		  });
	}
	


#### Adding a chat room
To add a new chat room we simply subscribe to the new Realtime Pub/Sub channel and add the new channel to local storage channels list.

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

#### Deleting a chat room
To delete an existing chat room we simply unsubscribe from the Realtime Pub/Sub channel and remove it from the local storage channels list.


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
	

### Chat messages view

![](http://messaging-public.realtime.co/screenshots/2.1.0/ionic/chat.png)

This view is responsible to list the chat messages in a given chat room.

The chat messages view is defined in file `pages/chat/chat.html` and the the controller in file `pages/chat/chat.ts`.

#### Showing the chat room messages

To show the messages as speach balloons we use the following code:

	<ion-content padding>
		<ion-list no-lines id="chatRooms-list2" class="listv">
	        <ion-list-header>
	          Messages
	        </ion-list-header>
	        <ion-item *ngFor="let message of channelMessages" style="width: 100%">
	        	<p class="bubble left" *ngIf="message.sender === user"><span style="font-size:20px;">{{message.sender}}:</span><br>{{message.msg}}</p>
	        	<p class="bubble right" *ngIf="message.sender !== user"><span style="font-size:20px;">{{message.sender}}:</span><br>{{message.msg}}</p>
	    	</ion-item>
	    </ion-list>
	</ion-content>

The balloon "alignment" to the left or right will depend whether the message sender is another user or the current user. To achieve this we are using the Angular `*ngIf` directive using the `message.sender` property to make the left/right decision by changing the CSS class used. 


### Composing a new message

![](http://messaging-public.realtime.co/screenshots/2.1.0/ionic/compose.png)

When the user composes a new message we send it to the chat room Realtime channel, using the `pages/writeMessage/writeMessage.ts` controller:
 
	sendMessage(){
		this._ortc.send(this._ortc.user + ':' + this.message);
		this.myGoBack();
	}
	
## Author
Realtime.co
