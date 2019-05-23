import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { LocationUiComponent } from './location-ui.component';
import { IonicModule } from '@ionic/angular';

@NgModule({

  imports: [IonicModule,CommonModule,RouterModule],
  declarations: [ LocationUiComponent ],
  exports:[LocationUiComponent]
})
export  class LocationUiModule {}