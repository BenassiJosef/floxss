import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OrderFooterModule } from '../../components/order-footer/order-footer.module';

import { IonicModule } from '@ionic/angular';

import { ProductPage } from './product.page';

const routes: Routes = [
  {
    path: '',
    component: ProductPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    OrderFooterModule
  ],
  declarations: [ProductPage]
})
export class ProductPageModule {}

