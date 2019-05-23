import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { PaymentService } from "../../services/payments/payment.service";
import { ModalController } from "@ionic/angular";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { IndexedDbService } from "../../services/indexedDb/indexed-db.service";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-payment-form",
  templateUrl: "./payment-form.component.html",
  styleUrls: ["./payment-form.component.scss"]
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  
  loading = false;
  toPay = true;

  basket = [null];
  location: string;

  @Input() amount: number; // Total amount
  @Input() label: string; // Label for product/purchase

  chargeAmount = this.amount;

  elements: any;
  paymentRequest: any;
  prButton: any;

  @ViewChild("payElement") payElement;

  @ViewChild("cardNumber") cardNumberElement: ElementRef;
  @ViewChild("cardExpiry") cardExpiryElement: ElementRef;
  @ViewChild("cardCvc") cardCvcElement: ElementRef;

  stripe; // : stripe.Stripe;
  cardNumber;
  cardExpiry;
  cardCvc;
  cardErrors;
  confirmation;

  constructor(
    private cd: ChangeDetectorRef,
    public pmt: PaymentService,
    public modalController: ModalController,
    public alertController: AlertController,
    public route: Router,
    public indexed: IndexedDbService,
    public auth: AuthService
  ) {}
  clientSecret;

  getSum(total, num) {
    return total + num;
  }

  elementStyles = {
    base: {
      color: "#fff",
      fontWeight: 600,
      fontFamily: "Quicksand, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",

      ":focus": {
        color: "#424770"
      },

      "::placeholder": {
        color: "#9BACC8"
      },

      ":focus::placeholder": {
        color: "#CFD7DF"
      }
    },
    invalid: {
      color: "#fff",
      ":focus": {
        color: "#FA755A"
      },
      "::placeholder": {
        color: "#FFCCA5"
      }
    }
  };

  elementClasses = {
    focus: "focus",
    empty: "empty",
    invalid: "invalid"
  };

  ngOnInit() {
    this.indexed.getCartItems();
    this.indexed.currentBasket.subscribe(value => {
      this.basket = value;
    });

    this.indexed.getLocation();
    this.indexed.currentLocation.subscribe(value => {
      this.location = value;
    });
    this.elements = this.pmt.stripe.elements();

    this.cardNumber = this.elements.create("cardNumber", {
      style: this.elementStyles,
      classes: this.elementClasses
    });
    this.cardNumber.mount(this.cardNumberElement.nativeElement);

    this.cardExpiry = this.elements.create("cardExpiry", {
      style: this.elementStyles,
      classes: this.elementClasses
    });
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);

    this.cardCvc = this.elements.create("cardCvc", {
      style: this.elementStyles,
      classes: this.elementClasses
    });

    this.cardCvc.mount(this.cardCvcElement.nativeElement);

    this.cardNumber.addEventListener("change", ({ error }) => {
      this.cardErrors = error && error.message;
    });
  }

  async handleForm(e) {
    e.preventDefault();
    let self = this;
    this.pmt.stripe
      .createToken(this.cardNumber, this.cardCvc, this.cardExpiry)
      .then(function(result) {
        if (result.error) {
          // Inform the customer that there was an error.
          self.cardErrors = result.error.message;
        } else {
          // Send the token to your server.
          self.loading = true;

          fetch(
            " https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/charge",
            {
              mode: "cors",
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                amount: 3000,
                token: result.token.id
              })
            }
          )
            .then(function(result) {
              return result.json();
            })
            .then(function(resultJson) {
              if (typeof resultJson.statusCode === "undefined") {
                console.log("pass 200");
                self.loading = false;
                self.postOrderFetch();
                self.successPaymentAlert();
              } else {
                console.log(resultJson.message);
                self.loading = false;
                self.errorPaymentAlert(resultJson.message);
              }
            });
        }
      });
  }

  public postOrderFetch() {
    this.auth.getAuthenticatedUser().getSession((err, session) => {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();
      let date = dd + "/" + mm + "/" + yyyy;

      var today = new Date();
      var time = today.getHours() + ":" + today.getMinutes();
      let orderId = Math.floor(Math.random() * 10000000000).toString();

      if (err) {
        console.log(err);
        return;
      } else {
        fetch(
          "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/postorders",
          {
            mode: "cors",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: session.getIdToken().jwtToken
            },
            body: JSON.stringify({
              orders: this.basket,
              orderId: orderId,
              date: date,
              time: time,
              locationName: this.location
            })
          }
        )
          .then(function(result) {
            if (result) {
              console.log(result);
            }
          })
          .catch(function(error) {
            console.log("Request failed", error);
          });
      }
    });
  }

  ngOnDestroy(): void {}

  async mountButton() {
    const result = await this.paymentRequest.canMakePayment();

    if (result) {
      this.prButton.mount(this.payElement.nativeElement);
    } else {
      console.error("your browser is old school!");
    }
  }

  close() {
    this.modalController.dismiss();
  }

  async successPaymentAlert() {
    const alert = await this.alertController.create({
      header: "Payment Succesful!",
      message: "You will now be sent a confirmation email!",
      backdropDismiss: false,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            console.log("Confirm Ok");
            this.close();
            this.route.navigateByUrl("/home");
            this.indexed.clearBasketLoction();
            this.indexed.clearRowsLocation();
          }
        }
      ]
    });
    await alert.present();
  }

  async errorPaymentAlert(error) {
    const alert = await this.alertController.create({
      header: "Payment Error!",
      message: error,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            console.log("Confirm Ok");
          }
        }
      ]
    });
    await alert.present();
  }
}
