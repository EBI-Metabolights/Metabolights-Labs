import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { contentHeaders } from './common/headers';
import { LabsURL } from './common/globals';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';
import { Dashboard } from './work-space/dashboard/dashboard';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	constructor(public router: Router, public http: Http) {}

	dashBoard: Dashboard;
	isLoggedIn: boolean = false;
	redirectUrl: string;
	errorMessage: string;

	login(body): void {
		this.http.post(LabsURL['authenticate'], body, { headers: contentHeaders })
		.subscribe(
			(response) => {
				localStorage.setItem('jwt', response.headers.get("jwt"));
				localStorage.setItem('user', response.headers.get("user"));
				this.isLoggedIn = true;
				this.router.navigate(['workspace','dashboard']);
			},
			error => {
				alert(error.text());
				console.log(error.text());
			}
			);
	}

	logout(): void {
		localStorage.removeItem('jwt');
		localStorage.removeItem('user');
		this.isLoggedIn = false;
		this.router.navigate(['login']);
	}

	initializeWorkSpace(): Observable<any> {
		let body = {
			"jwt" : localStorage.getItem("jwt"),
			"user" : localStorage.getItem("user")
		}
		return this.http.post(LabsURL['initialise'], body, { headers: contentHeaders })
		.map(
			(response) => {
				let body = JSON.parse(response.json().content);
				let dashBoard = new Dashboard().deserialize(body);
				this.dashBoard = dashBoard;
				return dashBoard;
			},
			error => {
				alert(error.text());
				console.log(error.text());
			}
		);
	}
}