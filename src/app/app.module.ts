import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule,HttpModule } from '@angular/http';

// Angular2 Bootstrap import
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Auth services
import { AuthGuard }      from './auth-guard.service';
import { AuthService }    from './auth.service';

// Router import
import { RouterModule }   from '@angular/router';
// Root level application routes import 
import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';

import { SharedModule } from './shared/shared.module';
import { WorkSpaceModule } from './work-space/work-space.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    WorkSpaceModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthGuard,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
