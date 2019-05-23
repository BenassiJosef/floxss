import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { OrderFooterComponent } from './order-footer.component';
import {LocationUiModule} from  '../../pages/location-ui/location-ui.module'
import { IonicModule } from '@ionic/angular';

@NgModule({

  imports: [IonicModule,CommonModule,LocationUiModule],
  declarations: [OrderFooterComponent],
  exports:[OrderFooterComponent]
})
export  class OrderFooterModule {}