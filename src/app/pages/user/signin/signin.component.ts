import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {IndexedDbService} from '../../../services/indexedDb/indexed-db.service' 

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @ViewChild('usrForm') form: NgForm;
  didFail = false;
  isLoading = false;
  constructor(private authService: AuthService, public router :Router, public indexdb:IndexedDbService) {
  }

  ngOnInit() {
    this.authService.authIsLoading.subscribe(
      (isLoading: boolean) => this.isLoading = isLoading
    );
    this.authService.authDidFail.subscribe(
      (didFail: boolean) => this.didFail = didFail
    );
    this.indexdb.makeDatabase();
    this.indexdb.connectToDatabase();
  }

  onSubmit() {
    const usrName = this.form.value.username;
    const password = this.form.value.password;
    this.authService.signIn(usrName, password);
  }

  goToSignUp(){
    this.router.navigateByUrl('/signup');
  }
  goToConfirm(){
    this.router.navigateByUrl('/confirm');
  }
}
