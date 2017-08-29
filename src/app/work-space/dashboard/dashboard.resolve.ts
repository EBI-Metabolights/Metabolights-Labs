import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Dashboard } from './dashboard';

@Injectable()
export class DashboardResolve implements Resolve<Dashboard> {

  constructor(private authService: AuthService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.authService.initializeWorkSpace();
  }
}