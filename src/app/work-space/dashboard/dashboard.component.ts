import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Dashboard } from './dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	dashBoard : Dashboard = null ;

	constructor(public authService: AuthService, private route: ActivatedRoute) {
		this.dashBoard = this.route.snapshot.data['dashBoard'];
	}

	ngOnInit() {
	}

}
