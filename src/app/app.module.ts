import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ChatroomsPage } from '../pages/chatrooms/chatrooms';
import { ChatPage } from '../pages/chat/chat';
import { WriteMessagesPage } from '../pages/write-messages/write-messages';
import { Ortc } from '../providers/ortc';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatroomsPage,
    ChatPage,
    WriteMessagesPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatroomsPage,
    ChatPage,
    WriteMessagesPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Ortc]
})
export class AppModule {}
