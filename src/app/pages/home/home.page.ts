import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { IndexedDbService } from "../../services/indexedDb/indexed-db.service";
import { ToastController } from "@ionic/angular";
import { PwaService } from "../../services/pwa/pwa.service";
import { AlertController } from "@ionic/angular";
import { MatSnackBar } from "@angular/material";
import { IosInstallComponent } from "../../components/ios-install/ios-install.component";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  users: Object;
  user: string;
  basket = [null];
  deviceKey: any;
  pushButton;
  promptEvent;
  ios: boolean;
  android: boolean;
  desktop: boolean;
  other: boolean;

  constructor(
    public auth: AuthService,
    private afMessaging: AngularFireMessaging,
    public indexedDb: IndexedDbService,
    public toast: ToastController,
    public pwa: PwaService,
    public alert: AlertController,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.indexedDb.makeDatabase();
    this.indexedDb.connectToDatabase();

    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };

    const isAndroid = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /Android/i.test(userAgent);
    };

    const isInStandaloneMode = () =>
      "standalone" in (window as any).navigator &&
      (window as any).navigator.standalone;

    if (isIos() && !isInStandaloneMode()) {
      this.ios = true;
    }

    if (isAndroid() && !isInStandaloneMode()) {
      this.android = true;
    }

    if (!isAndroid() && !isInStandaloneMode() && !isIos()) {
      this.other = true;
    }
  }

  installPwaIos() {
    this.snackBar.openFromComponent(IosInstallComponent, {
      duration: 8000,
      horizontalPosition: "center",
      panelClass: ["mat-elevation-z3"]
    });
  }

  installPwa(): void {
    this.pwa.promptEvent.prompt();
  }

  async confirmHomeAdd() {
    const alert = await this.alert.create({
      header: "Remove Item",
      message: "Do you want to add to HomeScreen?",
      buttons: [
        {
          text: "No",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {}
        },
        {
          text: "Yes",
          handler: () => {
            this.installPwa();
          }
        }
      ]
    });

    await alert.present();
  }

  async askPermission() {
    var self = this;
    if ("PushManager" in window) {
      this.pushButton = true;
      console.log("yep push is available");

      const permissionResult_1 = await new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(
          result
        ) {
          console.log(result);
        });
        if (permissionResult) {
          permissionResult.then(resolve, reject);
        }
      });
      if (permissionResult_1 !== "granted") {
        throw new Error("We weren't granted permission.");
      }
      if (permissionResult_1 === "granted") {
        this.afMessaging.requestToken.subscribe(
          token => {
            console.log(token);
            var result;
            this.indexedDb.getDeviceKey();
            var self = this;
            this.indexedDb.currentDeviceKey.subscribe(value => {
              result = value;
              self.deviceKey = result;
              this.tokenPostFetch(token, self.deviceKey);
            });
          },
          error => {
            console.error(error);
          }
        );
      }
    }
    if (!("PushManager" in window)) {
      self.presentToast(" Denied: Your Browser is in the dark ages");
    }
  }

  tokenPostFetch(token: string, deviceKey: string) {
    var self = this;
    this.auth.getAuthenticatedUser().getSession((err, session) => {
      if (err) {
        console.log(err);
      }

      fetch(
        "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/fcmtokens",
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.getIdToken().jwtToken
          },
          body: JSON.stringify({
            token: token,
            deviceKey: deviceKey
          })
        }
      )
        .then(function(result) {
          if (result) {
            console.log(result);
            self.presentToast("Push Added");
          }
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    });
  }

  async presentToast(message: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  getUserName() {
    let userName: string = this.auth.getAuthenticatedUser().getUsername();
    return userName;
  }

  getFetchAll() {
    this.auth.getAuthenticatedUser().getSession((err, session) => {
      if (err) {
        console.log(err);
      }
      const queryParam =
        "?accessToken=" + session.getAccessToken().getJwtToken();
      let urlParam = "single";
      console.log(
        "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/" +
          urlParam +
          queryParam
      );
      fetch(
        "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/" +
          urlParam +
          queryParam,
        {
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.getIdToken().jwtToken
          }
        }
      )
        .then(function(result) {
          if (result) {
            let data: Object = result.json();
            console.log(data);
          }
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    });
  }

  getFetchSingle() {
    return fetch(
      "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/single"
    );
  }

  // async GetUsers() {
  //   let response = await this.getFetchAll();
  //   //let data = await response.json();
  //   // this.users = data
  // }

  // async getUser() {
  //   let response = await this.getFetchSingle();
  //   this.user = await response.json();
  // }

  // public postFetch() {
  //   this.auth.getAuthenticatedUser().getSession((err, session) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }

  //     fetch(
  //       "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss",
  //       {
  //         mode: "cors",
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: session.getIdToken().jwtToken
  //         },
  //         body: JSON.stringify({
  //           name: this.getUserName(),
  //           age: 38,
  //           address: "crap street"
  //         })
  //       }
  //     )
  //       .then(function(result) {
  //         if (result) {
  //           console.log(result);
  //         }
  //       })
  //       .catch(function(error) {
  //         console.log("Request failed", error);
  //       });
  //   });
  // }
}

