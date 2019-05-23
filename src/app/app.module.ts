import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {PwaService} from './services/pwa/pwa.service';
import { AuthService } from './services/auth/auth.service';
import { IndexedDbService } from './services/indexedDb/indexed-db.service';
import { PaymentService } from './services/payments/payment.service';
import {PaymentFormModule} from  './components/payment-form/payment-form.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { UpdateComponent } from './components/update/update.component';



@NgModule({
  declarations: [
  AppComponent,
  UpdateComponent,
],
  entryComponents: [

  ],

  imports: [
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule, 
    ServiceWorkerModule.register('/combined-sw.js', { enabled: environment.production }),
    PaymentFormModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService , IndexedDbService ,PaymentService,PwaService
    
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
