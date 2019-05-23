import { Component, OnInit, Injector } from '@angular/core';
import {ActivatedRoute,Router,Params} from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})

export class ProductPage implements OnInit {

  product:Object;
  routeId;
  loader:boolean= true;

  constructor(public route:ActivatedRoute, private router:Router) {
   
   }

  ngOnInit() {
    this.routeId = this.route.snapshot.params['id'];
    this.storeProduct();
    
  }
 
  fetchProduct(id){
    return fetch('https://gc3th7yyvj.execute-api.eu-west-2.amazonaws.com/dev/floxss/product/'+id,
    { mode: 'cors',
     method:'GET',
    headers:{
      'Content-Type': 'application/json',
    
    }
    });
  }

  async storeProduct(){
    
    let response = await this.fetchProduct(this.routeId);
    let data = await response.json();
    this.product = data;
    this.loader = false;
  }

}
