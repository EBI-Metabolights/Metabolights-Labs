import { NgModule } from '@angular/core';
import { NgbModule, NgbActiveModal, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WorkSpaceComponent } from './work-space.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProjectComponent } from './project/project.component';
import { TreeView } from './project/tree-view.component';
// Router import
import { RouterModule }   from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { WorkSpaceRoutes } from './work-space.routes';
import { SettingsComponent } from './settings/settings.component';
import { AuthService } from '../auth.service';
import { ProjectsService } from './projects/projects.service';
import { DashboardResolve } from './dashboard/dashboard.resolve';
import { ProjectsComponent } from './projects/projects.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(WorkSpaceRoutes)
  ],
  declarations: [WorkSpaceComponent, DashboardComponent, ProjectComponent, SettingsComponent, ProjectsComponent, TreeView],
  exports: [
    RouterModule
  ],
  providers: [
  	AuthService,
    ProjectsService,
    NgbActiveModal,
    NgbAlertConfig,
  	DashboardResolve
  ]
})
export class WorkSpaceModule { }
