import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentFormComponent } from './payment-form.component';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    {
      path: '',
      component: PaymentFormComponent
    }
  ];

@NgModule({

  imports: [IonicModule,CommonModule,RouterModule.forChild(routes)],
  declarations: [PaymentFormComponent],
  exports:[PaymentFormComponent]
})
export  class PaymentFormModule {}