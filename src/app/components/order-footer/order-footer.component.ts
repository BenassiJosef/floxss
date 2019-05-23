import { Component,Input, OnInit} from '@angular/core';
import {IndexedDbService} from '../../services/indexedDb/indexed-db.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-order-footer',
  templateUrl: './order-footer.component.html',
  styleUrls: ['./order-footer.component.scss']
})
export class OrderFooterComponent implements OnInit{
  
  @Input() url:boolean;
  @Input() product: Object;
  @Input() routeId: any;

  basketCount;

  constructor( public route:Router,public cart:IndexedDbService) { }

  ngOnInit() {

    this.cart.makeDatabase();
    this.cart.connectToDatabase();
    this.cart.putCount();
    this.cart.currentBasketCount.subscribe(value =>{
      this.basketCount = value
    });
   
  }

  getProduct(product){
    this.cart.addRow(product,this.routeId);
    this.cart.putCount();
    this.cart.presentToast(this.product);
  }

  goToBasket(){
      this.route.navigateByUrl('/basket');
  }
}