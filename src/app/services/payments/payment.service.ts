import { Injectable } from '@angular/core';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})


export class PaymentService {

  elements:any;
  stripe =  Stripe('pk_test_3s6zNLT19fUIpeMahBkFVYXu');
  constructor() {
    // this.elements = this.stripe.elements();public router:Router
  }
}
