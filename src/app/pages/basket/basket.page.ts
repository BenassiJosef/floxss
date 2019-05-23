import { Component, OnInit } from "@angular/core";
import { IndexedDbService } from "../../services/indexedDb/indexed-db.service";
import { ModalController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { PaymentFormComponent } from "../../components/payment-form/payment-form.component";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-basket",
  templateUrl: "./basket.page.html",
  styleUrls: ["./basket.page.scss"]
})
export class BasketPage implements OnInit {
  basket = [null];
  prices = [0];
  price = [0];
  total = 0;
  location: string;

  constructor(
    public indexDb: IndexedDbService,
    public alertController: AlertController,
    public route: Router,
    public modalController: ModalController,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.indexDb.getCartItems();

    // this.getOrderFetch();
    this.indexDb.currentBasket.subscribe(value => {
      this.basket = value;
      this.prices = value;

      for (let i = 0; i < this.prices.length; i++) {
        this.price[i] = this.prices[i]["price"];
      }
      if (!this.price.length) {
      } else {
        this.total = this.price.reduce(this.getSum);
      }
    });

    this.getitems();

    this.indexDb.getLocation();
    this.indexDb.currentLocation.subscribe(value => {
      this.location = value;
    });
  }

  getSum(total, num) {
    return total + num;
  }

  deleteCartItem(item) {
    this.indexDb.deleteItemCart(item);
    this.prices = [];
    this.price = [];
    this.total = null;
  }

  async presentAlertConfirm(item) {
    const alert = await this.alertController.create({
      header: "Remove Item",
      message: "Are you sure you want to remove" + " " + item.name,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {}
        },
        {
          text: "Yes",
          handler: () => {
            this.deleteCartItem(item);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertBasket() {
    const alert = await this.alertController.create({
      header: "No Items In Basket To Pay For!",
      message: "Choose Some Grub",
      buttons: [
        {
          text: "Ok",
          handler: () => {}
        }
      ]
    });

    await alert.present();
  }

  async presentAlertLocation() {
    const alert = await this.alertController.create({
      header: "No Location Chosen!",
      message: "We cant send your order anywhere Bra!",
      buttons: [
        {
          text: "Ok",
          handler: () => {
            this.route.navigateByUrl("/store");
          }
        }
      ]
    });

    await alert.present();
  }

  getitems() {
    let items: Object;
    this.indexDb.db.cartItems.toArray(response => {
      items = response;
    });
  }

  goToCheckout() {
    this.route.navigateByUrl("/checkout");
  }
  async presentModal(price) {
    if (this.location === null) {
      this.presentAlertLocation();
    } else if (!this.basket.length) {
      this.presentAlertBasket();
    } else {
      let total = price.reduce(this.getSum);
      const modal = await this.modalController.create({
        mode: "md",
        cssClass: "modalCss",
        component: PaymentFormComponent,
        componentProps: { amount: total, label: "your order" },
        showBackdrop: true,
        backdropDismiss: false
      });
      return await modal.present();
    }
  }

  // public getOrderFetch(){
  //  this.auth.getAuthenticatedUser().getSession((err,session)=>{
  //     if(err){
  //       console.log(err);
  //       return;
  //     }
  //   fetch('https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/getorders',
  //   { mode: 'cors',
  //     method:'POST',
  //     headers:{
  //       'Content-Type': 'application/json',
  //      'Authorization': session.getIdToken().jwtToken
  //     }
  //   }).then(function (result) {
  //     if(result){
  //       console.log("resultGetOrders",result.json());
  //     }
  //   })
  //   .catch(function (error) {
  //     console.log('Request failed', error);
  //   });
  // });

  // }

  // async getOrders(){
  //    let response = await this.getOrderFetch();
  //     let data = await response.json();
  //     console.log(data);
  // }

  // public postOrderFetch(){

  //   this.auth.getAuthenticatedUser().getSession((err,session)=>{

  //     var today = new Date();
  //     var dd = String(today.getDate()).padStart(2, '0');
  //     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  //     var yyyy = today.getFullYear();
  //     let date = dd + '/' + mm + '/' + yyyy;

  //     var today = new Date();
  //     var time = today.getHours() + ":" + today.getMinutes();
  //     let orderId = Math.floor(Math.random() * 10000000000).toString();

  //     if(err){
  //       console.log(err);
  //       return;
  //     }else{

  //     fetch('https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/postorders',
  //     { mode: 'cors',
  //       method:'POST',
  //       headers:{
  //         'Content-Type': 'application/json',
  //         'Authorization': session.getIdToken().jwtToken
  //       },
  //       body: JSON.stringify({
  //        orders:this.basket ,orderId:orderId, date:date, time:time , locationName:this.location
  //         }),
  //     })
  //     .then(function (result) {
  //       if(result){
  //         console.log(result);
  //       }
  //     })
  //     .catch(function (error) {
  //       console.log('Request failed', error);
  //     });

  //   }
  //    });

  // }
}
