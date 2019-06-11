rimport { Injectable } from '@angular/core';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})


export class PaymentService {

  elements:any;
  stripe =  Stripe('key here');
  constructor() {
    // this.elements = this.stripe.elements();public router:Router
  }
}
