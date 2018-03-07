import { Route } from '@angular/router';

import { WorkSpaceComponent } from './work-space.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsComponent } from './projects/projects.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard }  from '../auth-guard.service';
import { DashboardResolve } from './dashboard/dashboard.resolve';

export const WorkSpaceRoutes: Route[] = [
  {
    path: 'workspace',
    component: WorkSpaceComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        resolve: {
          dashBoard: DashboardResolve
        }
      },
      {
        path: 'projects',
        component: ProjectsComponent,
        resolve: {
          dashBoard: DashboardResolve
        }
      },
      {
        path: 'settings',
        component: SettingsComponent,
        resolve: {
          dashBoard: DashboardResolve
        }
      },
      {
        path: 'project/:id',
        component: ProjectComponent,
        resolve: {
          dashBoard: DashboardResolve
        }
      },
      {
        path: '',
        component: DashboardComponent,
      }
    ]
  }
];