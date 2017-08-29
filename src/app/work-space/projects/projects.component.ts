import { Input, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from '../project/project';
import { AuthService } from '../../auth.service';
import { contentHeaders } from '../../common/headers';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
//import { ProjectsService } from './projects.service';
import { LabsURL } from '../../common/globals';
import { Http, Response, Headers } from '@angular/http';

@Component({
  selector: 'app-projects',
  templateUrl: 'projects.component.html',
  styleUrls: ['projects.component.css']
})
export class ProjectsComponent implements OnInit {

  	projects: Project[];
    selectedProject: Project;
    closeResult: string;
    createProjectForm : FormGroup;
    modalRef: NgbModalRef;
    deleteConfirmationModalRef: NgbModalRef;
    waitingModalRef: NgbModalRef;
    cloningProject: Boolean = false;
    
    @Input()
    public alerts: Array<IAlert> = [];

    constructor(public http: Http, private authService: AuthService, private router: Router, private modalService: NgbModal,private fb: FormBuilder) {
      this.initForms();
    }

    initForms(){
      this.createProjectForm = this.fb.group({
        'title'         : ["", Validators.required],
        'description'   : "",
        'cloneProject'  : false,
        'studyId'       : ""
      });
    }

    closeAlert(alert: IAlert) {
      const index: number = this.alerts.indexOf(alert);
      this.alerts.splice(index, 1);
    }

  	ngOnInit() {
  		this.projects = this.authService.dashBoard.projects;
      this.selectedProject = this.projects[0];
  	}

  	getId(uuid){
  		return uuid.split("-")[0]; 
  	}

    onSelect(project: Project) {
      this.router.navigate(['/workspace/project', project.id]);
    }

    setSelected(project: Project) {
      this.selectedProject = project;
    }

    open(content) {
      this.modalRef = this.modalService.open(content);

      this.modalRef.result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    openDeleteConfirmationModal(content) {
      this.deleteConfirmationModalRef = this.modalService.open(content);
      this.deleteConfirmationModalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    deleteSelectedProject(){
      let body = {};
      body["jwt"] = localStorage.getItem("jwt");
      body["user"] = localStorage.getItem("user");
      body["project_id"] = this.selectedProject.id;
      body["files"] = []

      this.http.post(LabsURL['deleteProject'], body, { headers: contentHeaders })
          .subscribe(
            response => {
              this.deleteConfirmationModalRef.close();
              let selectedProjectIndex = 0;
              let projectIndex = 0;
              
              this.authService.dashBoard.projects.forEach( aProject => {
                if(aProject.id == this.selectedProject.id){
                  selectedProjectIndex = projectIndex;
                  return;
                }
                projectIndex = projectIndex + 1;
              })

              this.authService.dashBoard.projects.splice(selectedProjectIndex, 1);
              this.projects = this.authService.dashBoard.projects;

              this.alerts.push({
                id: 1,
                type: 'success',
                message: 'Project deleted successfully!',
              });
              this.ngOnInit();
            },
            error => {
              this.alerts.push({
                id: 1,
                type: 'danger',
                message: 'Project delete unsuccessful! Error',
              });
            }
      );
    }

    submitForm(body: any, waiting){

      this.waitingModalRef = this.modalService.open(waiting);

      if(body.cloneProject == true){
        if (body.studyId == "" || body.studyId == null ){
           alert('Please provide a valid MetaboLights Study ID');
           return;
        }else{
           this.cloningProject = true;
        }
      }

      this.modalRef.close();

      body["jwt"] = localStorage.getItem("jwt");
      body["user"] = localStorage.getItem("user");

      this.http.post(LabsURL['createProject'], body, { headers: contentHeaders })
        .subscribe(
          (response) => {
            this.cloningProject = false;
            let project = new Project().deserialize(JSON.parse(response.json().content));
            this.setSelected(project);
            this.authService.dashBoard.projects.push(project);
            this.projects = this.authService.dashBoard.projects;
            
            this.alerts.push({
              id: 1,
              type: 'success',
              message: 'Project ' + project.title + ' creation successful!',
            });
            this.initForms();
            this.waitingModalRef.close();
          },
          error => {
            this.alerts.push({
              id: 1,
              type: 'danger',
              message: 'Project creation unsuccessful! Error',
            });
            console.log(error.text());
          }
      );
      //this.authService.initializeWorkSpace();
    }

    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
    }
}

export interface IAlert {
  id: number;
  type: string;
  message: string;
}