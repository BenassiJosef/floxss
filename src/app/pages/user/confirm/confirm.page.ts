import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {



  constructor(public authService:AuthService) { }

  ngOnInit() {
  }

  onConfirm(formValue: { usrName: string, validationCode: string }) {
    this.authService.confirmUser(formValue.usrName, formValue.validationCode);
  }

}
