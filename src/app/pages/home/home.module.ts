import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { IosInstallComponent } from '../../components/ios-install/ios-install.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';



@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',component: HomePage
      }
    ]),
    MatSnackBarModule
  ],
  declarations: [HomePage,IosInstallComponent],
  entryComponents: [IosInstallComponent]

})
export class HomePageModule {}
