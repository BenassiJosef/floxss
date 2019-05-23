import { NgModule,forwardRef } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth-guard/auth-guard.service';


const routes: Routes = [

  {
    path: 'home', canActivate: [AuthGuard],
    loadChildren: './pages/home/home.module#HomePageModule'
  },
  {
    path: 'signup',
    loadChildren: './pages/user/signup/signup.module#SignupComponentModule'
  },
  {
    path: 'signin',
    loadChildren: './pages/user/signin/signin.module#SigninComponentModule'
  },
  {
    path: '',
    loadChildren: './pages/user/signin/signin.module#SigninComponentModule'
  },
  { path: 'order',  canActivate: [AuthGuard] ,loadChildren: './pages/order/order.module#OrderPageModule' },
  { path: 'product/:id', canActivate: [AuthGuard] , loadChildren: './pages/product/product.module#ProductPageModule' },
  { path: 'store', canActivate: [AuthGuard] ,loadChildren: './pages/store/store.module#StorePageModule' },
  { path: 'basket', loadChildren: './pages/basket/basket.module#BasketPageModule' },
  { path: 'checkout', loadChildren: './pages/checkout/checkout.module#CheckoutPageModule' },
  { path: 'confirm', loadChildren: './pages/user/confirm/confirm.module#ConfirmPageModule' },
 
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[forwardRef(() => AuthGuard)]
  
})

export class AppRoutingModule {}
