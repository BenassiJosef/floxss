import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { AngularFireMessaging } from "@angular/fire/messaging";

import { AuthService } from './services/auth/auth.service';
import {IndexedDbService} from './services/indexedDb/indexed-db.service' ;
import { PwaService } from "./services/pwa/pwa.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
 

  ngOnInit(){

      this.authService.authStatusChanged.subscribe(
        (authenticated) => {
          this.isAuthenticated = authenticated;
          if (authenticated) {
            this.router.navigateByUrl('/home');
          } else {
            this.router.navigateByUrl('/signin');
          }
        }
      );
      this.authService.initAuth();
      this.indexedDb.makeDatabase();
      this.indexedDb.connectToDatabase();
      this.incomingPushMessage();
  }

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private indexedDb: IndexedDbService,
    private pwa :PwaService,
    private afMessaging :AngularFireMessaging
  ) {
   this.initializeApp();
   this.pwa.getAddHomeEvent();
  }

  onLogout() {
    this.authService.logout();
    this.indexedDb.clearDeviceKeyLocation();

  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  incomingPushMessage(){
    this.afMessaging.messaging.subscribe( (payload) => {
     console.log("new message received. ", payload);
     
   });
}
}
