import { Routes } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard }  from './auth-guard.service';

 
export const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: '', redirectTo: 'workspace/dashboard', pathMatch: 'full'},
    { path: '**', component: PageNotFoundComponent }
];