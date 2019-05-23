import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  confirmUser = false;
  didFail = false;
  didPass = false;
  isLoading = false;
  @ViewChild('usrForm') form: NgForm;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.authIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading
    );
    this.authService.authDidFail.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );
    this.authService.authDidPass.subscribe(
      (didPass: boolean) => this.didPass = didPass
    );
  }

  onSubmit() {
    const usrName = this.form.value.username;
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authService.signUp(usrName, email, password);
  }

  onDoConfirm() {
    this.confirmUser = true;
  }

  onConfirm(formValue: 
    { usrName: string, 
      validationCode: string }){
    this.authService.confirmUser(formValue.usrName, formValue.validationCode);
  }
}