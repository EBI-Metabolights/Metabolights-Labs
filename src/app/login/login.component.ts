import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public router: Router, private authService: AuthService) {}

  ngOnInit() {
    if(this.authService.isLoggedIn){
	  	this.router.navigate(['workspace/dashboard']);
	  }
  }

  login(event, email, secret) {
    event.preventDefault();
    let body = JSON.stringify({ email, secret });
    this.authService.login(body);
  }

}
