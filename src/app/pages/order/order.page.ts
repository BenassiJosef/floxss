import { Component, OnInit, ViewChild, Renderer } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: "app-order",
  templateUrl: "./order.page.html",
  styleUrls: ["./order.page.scss"]
})
export class OrderPage implements OnInit {
  products: Object;
  order: string = "products"; // default button
  loader1 = true;
  loader2 = true;
  orders = [];
  panelOpenState = false;

  constructor(public auth: AuthService, public renderer: Renderer) {}

  ngOnInit() {
    this.storeProducts();
    // this.getOrders();
    this.getOrders();
  }

  fetchProducts() {
    return fetch(
      "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/products"
    );
  }

  segmentChanged(ev: any) {
    console.log("Segment changed", ev);
  }

  async storeProducts() {
    let response = await this.fetchProducts();
    let data = await response.json();
    this.products = data;
    this.loader1 = false;
  }

  async getOrders() {
    let response = await this.getOrderFetch();
    let data = await response.json();
    let flatArray = [];

    data.forEach(element => {
      flatArray.push(element);
    });
   
    this.orders = flatArray;
    this.loader2 = false;
  }
  public getOrderFetch() {
    return this.auth.getAuthenticatedUser().getSession((err, session) => {
      if (err) {
        console.log(err);
        return;
      }
      return fetch(
        "https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/getorders",
        {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: session.getIdToken().jwtToken
          }
        }
      );
    });
  }
}
