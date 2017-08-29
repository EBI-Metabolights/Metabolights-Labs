import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Dashboard } from '../../work-space/dashboard/dashboard';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

  constructor(private authService: AuthService) { }
  dashBoard: Dashboard;
  ngOnInit() {
  	this.dashBoard = this.authService.dashBoard;
  }

  logOut() {
  	this.authService.logout();
  }

}
