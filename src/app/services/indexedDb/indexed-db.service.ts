import { Injectable } from "@angular/core";
import Dexie from "dexie";
import { BehaviorSubject } from "rxjs/";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class IndexedDbService {
  db: any;
  dbLocation: any;
  rows: Product[] = [];
  count: number;

  location = new BehaviorSubject<string>(null);
  currentLocation = this.location.asObservable();

  deviceKey= new BehaviorSubject<string>(null);
  currentDeviceKey= this.deviceKey.asObservable();

  basketCount = new BehaviorSubject<number>(+"");
  currentBasketCount = this.basketCount.asObservable();

  basket = new BehaviorSubject([]);
  currentBasket = this.basket.asObservable();

  prices = [];

  total = new BehaviorSubject<object>(null);
  currentTotal = this.total.asObservable();

  newProduct: Product = new Product("", "", "", +"", "");
  newLocation: Location = new Location("", "", +"", +"");
  newDeviceKey: DeviceKey = new DeviceKey("");

  constructor(public toastController: ToastController) {}

  makeDatabase(): void {
    this.db = new Dexie("Floxss");
    this.db.version(1).stores({
      cartItems: "orderNumber",
      chosenLocation: "locationId",
      deviceKeys: "deviceKeys"
    });
  }

  connectToDatabase(): void {
    this.db.open().catch(error => {
      alert("Errod during connecting to database : " + error);
    });
  }

  clearBasketLoction(): void {
    this.db.cartItems.clear();
    this.loadRows();
  }

  clearRowsLocation(): void {
    this.db.chosenLocation.clear();;
    this.loadRows();
  }

  clearDeviceKeyLocation(): void {
    this.db.deviceKeys.clear();
  }

  loadRows(): void {
    this.db.cartItems.toArray().then(p => (this.rows = p));
  }

  loadLocationRows(): void {
    this.db.chosenLocation.toArray().then(p => (this.rows = p));
  }

  loadDeviceKeyRows(): void {
    this.db.deviceKeys.toArray().then(p => (this.rows = p));
  }
  addRowDevciceKey(key) {
    console.log(key);
    this.db.deviceKeys.add({
      deviceKeys: key,
    });
    this.loadDeviceKeyRows();
    this.newDeviceKey = new DeviceKey("");
  }

  addRowLocation(location) {
    this.clearRowsLocation();
    this.db.chosenLocation.add({
      locationId: location.locationId,
      lat: location.lat,
      lng: location.lng,
      name: location.name
    });
    this.loadLocationRows();
    this.newLocation = new Location("", "", +"", +"");
  }
  addRow(product, routeId): void {
    this.db.cartItems.add({
      orderNumber: Math.random(),
      productId: routeId,
      name: product.name,
      desc: product.desc,
      price: product.price,
      img: product.img
    });
    this.loadRows();
    this.newProduct = new Product("", "", "", +"", "");
  }
  getCount() {
    return this.db.cartItems.count();
  }

  async putCount() {
    let count = await this.getCount();
    let data = await count;
    this.basketCount.next(data);
  }

  async presentToast(product) {
    const toast = await this.toastController.create({
      message: product.title + " " + "has been added to your basket!",
      duration: 2000
    });
    toast.present();
  }

  getCartItems() {
    let self = this;
    this.db.cartItems.toArray(response => {
      self.setCartItems(response);
    });
  }

  async setCartItems(response) {
    let data = await response;
    this.basket.next(data);
    this.getPrices();
  }

  getLocation() {
    let self = this;
    this.db.chosenLocation.each(response => {
      self.setLocation(response);
    });
  }


  getDeviceKey() {
    let self = this;
    this.db.deviceKeys.each(response => {
      self.setDeviceKey(response);
    });
  }

  async setDeviceKey(response) {
    let data = await response;
    this.deviceKey.next(data.deviceKeys); 
  }

  async setLocation(response) {
    let data = await response;
    this.location.next(data.name);
  }

  deleteItemCart(item) {
    this.db.cartItems.delete(item.orderNumber);
    this.getCartItems();
    this.putCount();
  }

  getSum(total, num) {
    return total + num;
  }

  getPrices() {
    let self = this;
    this.db.cartItems.toArray(response => {
      self.setPrice(response);
    });
  }

  async setPrice(response) {
    let self = this;
    let r = await response;

    for (let i = 0; i < r.length; i++) {
      self.prices[i] = r[i]["price"];
    }
    if (!this.prices.length) {
    } else {
      this.total.next(this.prices.reduce(this.getSum));
    }
  }
}

export class Product {
  constructor(
    public title: string,
    public desc: string,
    public productId: string,
    public price: number,
    public img: string
  ) {}
}

export class Location {
  constructor(
    public locationId: string,
    public name: string,
    public lat: number,
    public lng: number
  ) {}
}


export class DeviceKey {
  constructor(
    public deviceKey: string,
  ) {}
}

