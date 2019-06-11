import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../pages/user/user.model';
import {CognitoUserPool,CognitoUserAttribute,CognitoUser,AuthenticationDetails,CognitoUserSession} from 'amazon-cognito-identity-js';
import {IndexedDbService} from '../indexedDb/indexed-db.service' ;
import {ToastController} from '@ionic/angular';

const POOL_DATA = {
  UserPoolId:'key here',
  ClientId: 'key here'
}

const userPool = new CognitoUserPool(POOL_DATA);

@Injectable()
export class AuthService {
  
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authDidPass = new BehaviorSubject<boolean>(false);
  logedOut = new BehaviorSubject<boolean>(false);
  
  authStatusChanged = new Subject<boolean>();
  registeredUser: CognitoUser;


  constructor(private router: Router, private indexedDb:IndexedDbService, public toast:ToastController) {}
  signUp(username: string, email: string, password: string): void {
    this.authIsLoading.next(true);
    const user: User = {
      username: username,
      email: email,
      password: password
    };
    const attrList: CognitoUserAttribute[] = [];
    const emailAttribute = {
      Name: 'email',
      Value: user.email
    };
    attrList.push(new CognitoUserAttribute(emailAttribute));
    userPool.signUp(user.username,user.password,attrList,null,(err,result)=>{
      if(err){
        console.log(err);
        this.presentToast(err);
        this.authDidFail.next(true);
        this.authIsLoading.next(false);
        this.authDidPass.next(false);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      this.registeredUser = result.user;
      this.authDidPass.next(true);

    });
    return;
  }
  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool :userPool
    };
    const cognitUser = new CognitoUser(userData);
    cognitUser.confirmRegistration(code,true,(err, result)=>{
        if (err){
          console.log(err);
          this.presentToast(err);
          this.authDidFail.next(true);
          return;
        }
        this.authDidFail.next(false);
        this.authIsLoading.next(false);
        this.router.navigate(['']);
    });
  }
  signIn(username: string, password: string): void {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };
    const authDetails = new AuthenticationDetails(authData);
    const userData ={
      Username: username,
      Pool : userPool
    };
    const cognitoUser = new CognitoUser(userData);
    const self = this;
    cognitoUser.authenticateUser(authDetails,{
      onSuccess(result:CognitoUserSession){
        self.authStatusChanged.next(true);
        self.authDidFail.next(false);
        self.authIsLoading.next(false);
        
        cognitoUser.getDevice({
          onSuccess: function(result) {
            console.log("result:"+" ",result)
            var resultArray = [];
            var deviceKey :string;
            resultArray.push(result);
            resultArray.forEach(element => {
            deviceKey = element.Device.DeviceKey;
            });
            self.indexedDb.addRowDevciceKey(deviceKey);
          },
          onFailure: function(err) {
            alert(err);
          }
        });
      },
      onFailure(err){
        self.authDidFail.next(true);
        self.authIsLoading.next(false);
        console.log(err);
        self.presentToast(err);
      }
    });
  
    return;
  }
  getAuthenticatedUser() {
    return userPool.getCurrentUser();
    
  }
  logout() {

    this.getAuthenticatedUser().signOut();
    this.authStatusChanged.next(false); 
    
  }
  isAuthenticated(): Observable<boolean> {
   const user = this.getAuthenticatedUser();
    const obs = Observable.create((observer) => {
      if (!user) {
      observer.next(false);
    
      } else {
        user.getSession((err,session)=>{
          if(err){
            observer.next(false); 
          }else{
            if(session.isValid()){
              observer.next(true);
            }else{
              observer.next(false);
              
            }
          }
        });
      }
      observer.complete();
    });
    return obs;
  }
  initAuth() {
    this.isAuthenticated().subscribe(
      (auth) => this.authStatusChanged.next(auth)
    );
  }

  async presentToast(err) {
    const toast = await this.toast.create({
      message: err.message,
      duration: 2000
    });
    toast.present();
  }
}
