import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { contentHeaders } from '../../common/headers';
import { LabsURL } from '../../common/globals';
import { Router } from '@angular/router';
import { Http, Response, Headers } from '@angular/http';

@Injectable()
export class ProjectsService {

  constructor(public router: Router, public http: Http) { }

  getProjects(body){

  }
}