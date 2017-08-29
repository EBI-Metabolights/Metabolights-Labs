import { Component, OnInit } from '@angular/core';
import { User } from "../dashboard/user";
import { AuthService } from "../../auth.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	constructor(private authService: AuthService) { }

  	user: User;

  	ngOnInit() {
  		this.user = this.authService.dashBoard.user;
  	}

}
