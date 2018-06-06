import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Project } from '../project/project';
import { Job } from '../project/job';
import { Directory } from '../project/directory';
import { File } from '../project/file';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contentHeaders } from '../../common/headers';
import { LabsURL } from '../../common/globals';
import { Observable } from 'rxjs/Observable';
import { Jsonp, Http, Response, Headers } from '@angular/http';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

declare var $: any;
declare var AW4: any;

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {


  @ViewChild('projectLocked') projectLocked: ElementRef;
  @ViewChild('projectStudyLocked') projectStudyLocked: ElementRef;

  server: string = "";
  processing: boolean = false;
  uploadInprogress: boolean = false;
  project: Project;
  id: string;
  projectIndex: any;
  files: string[] = [];
  mzMLFiles: string[] = [];
  nmrMLFiles: string[] = [];
  histories: object[] = [];
  selectedHistory: string = "";
  selectedGalaxy: string = "";
  selectedGalaxyInstance: any;
  galaxyInstances: any;
  selectedFiles: File[];
  selectedFilesFlag: boolean[];

  loadingModalRef: NgbModalRef;
  loadingProjectModalRef: NgbModalRef;
  editingModalRef: NgbModalRef;
  asperaMessageModalRef: NgbModalRef;
  deleteConfirmationModalRef: NgbModalRef;
  mzml2isaModalRef: NgbModalRef;
  nmrml2isaModalRef: NgbModalRef;
  submitAsStudyModalRef: NgbModalRef;
  jobsModalRef: NgbModalRef;
  error: any = null;

  exportToGalaxyModalRef: NgbModalRef;

  closeResult: string;
  editProjectDetailsForm : FormGroup;
  token: String;
  projectStructure: Directory;
  isaTabDirectories: Directory[] = [];
  processedFolders: string[] = [];
  selectedDirectories: Directory[] = [];
  $: any;
  fileIndex:number = 1;

  @Input()
  public alerts: Array<IAlert> = [];

  MIN_CONNECT_VERSION = "3.6.0.0";
  CONNECT_AUTOINSTALL_LOCATION = "//d3gcli72yxqn2z.cloudfront.net/connect/v4";
  //CONNECT_LOCATION = "http://asperasoft.com/connect2";
  //connect_id = "aspera-web";
  asperaWeb: any; 

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private modalService: NgbModal, public http: Http, private jsonp: Jsonp, private fb: FormBuilder) { 
    this.selectedFiles = [];
    this.projectStructure = new Directory();
  }

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  initForms(){
    this.editProjectDetailsForm = this.fb.group({
      'title'         : [this.project.title , Validators.required],
      'description'   : this.project.description
    });
  }

  updateSelectedFilesList(e, index, filename){
    if(e.target.checked){
      this.selectedFiles[index] = filename;
    }else{
      this.selectedFiles.splice(index, 1);
    }
  }

  // selectAllFiles(e){
  //   if(e.target.checked){
  //     this.selectedFiles = this.files;
  //   }else{
  //     this.selectedFiles = [];
  //   }
  // }

  deleteSelectedFiles(){
    if(this.selectedFiles.length <= 0 && this.selectedDirectories.length <= 0){
      return alert("No selection provided");
    }

    let filesToDelete = [];

    filesToDelete = this.selectedFiles.filter(function(n){ return n != undefined }); 

    let body = {};
    body["jwt"] = localStorage.getItem("jwt");
    body["user"] = localStorage.getItem("user");
    body["id"] = this.project.id;
    body["files"] = []

    if(this.selectedDirectories.length > 0){
      body["directories"] = [];
    }

    filesToDelete.forEach(file => {
      if (file != undefined){
        body["files"].push(file.title.replace("/", ""));
      }
    })

    this.selectedDirectories.forEach(sDirectory => {
        body["files"].push(sDirectory.path);
    })

    this.http.post(LabsURL['delete'], body, { headers: contentHeaders })
        .subscribe(
          response => {
            this.deleteConfirmationModalRef.close();
            this.alerts.push({
              id: 1,
              type: 'success',
              message: 'File(s) delete successful!',
            });
            this.ngOnInit();
          },
          error => {
            this.alerts.push({
              id: 1,
              type: 'danger',
              message: 'Project update unsuccessful! Error',
            });
          }
    );
  }

  openExportDataToGalaxyModal(content){
     this.error = null;
    if( this.selectedFiles.length <= 0){
      alert("Please select files to export");
    }else{
      this.exportToGalaxyModalRef = this.modalService.open(content);
      this.exportToGalaxyModalRef.result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  getGalaxyHistories(galaxyUrl){
    this.error = null;

    
    this.galaxyInstances.forEach( (instance) =>{
      if (instance.url == galaxyUrl){
        this.selectedGalaxyInstance = instance;
      }
    })

    this.histories = [];

    this.jsonp.get(this.selectedGalaxyInstance.url + "api/histories?key=" + this.selectedGalaxyInstance.apikey + "&callback=JSONP_CALLBACK").map(res => {
       this.histories = res.json();
    }).subscribe( response => {
      this.error = response;
    })
  }

  onChangeGalaxyInstance(event, galaxy){
    this.selectedGalaxy = galaxy;
    this.getGalaxyHistories(galaxy)
  }

  onChangeGalaxyHistory(event, history){
    this.selectedHistory = history
  }

  exportFilesToGalaxy(){
    if(this.selectedFiles.length <=0){

      alert("Please select files to export");

    }else{

      this.processing = true;
      let fileInputs = "";
      this.selectedFiles.forEach( file => {
        if (fileInputs == ""){
          fileInputs = LabsURL['download'] + "?apikey=" + this.token + "&path=" + this.project.id + file.title 
        }else{
          fileInputs = fileInputs + "\\n" + LabsURL['download'] + "?apikey=" + this.token + "&path=" + this.project.id + file.title 
        }
      })

      let body = new FormData();
      body.append('tool_id', 'upload1');
      body.append('history_id', this.selectedHistory);
      body.append('inputs', '{"file_count":1,"file_type":"auto","files_0|to_posix_lines":"False","files_0|url_paste":"' + fileInputs + '"}');
      const contentHeaders = new Headers();
      contentHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

      this.http.post(this.selectedGalaxyInstance.url + "api/tools?key=" + this.selectedGalaxyInstance.apikey, body)
        .subscribe(
          (response) => {
            this.exportToGalaxyModalRef.close();
            this.selectedFiles = [];
            this.processing = false;
            this.alerts.push({
              id: 1,
              type: 'success',
              message: 'Files exported to galaxy successfully',
            });
          },
          error => {
            console.log(error)
            if(error.status == 0){
              this.alerts.push({
                id: 1,
                type: 'success',
                message: 'Files exported to galaxy successfully <br><a target="_blank" href="' + this.selectedGalaxyInstance.url + 'history/view_multiple">view in galaxy</a',
              });
            }
            this.exportToGalaxyModalRef.close();
            this.selectedFiles = [];
            this.processing = false;
            this.processing = false;
          }
      );
    }
  }

  ngOnInit() {
  	this.route.params.forEach((params: Params) => {
      this.id = params['id'];
    });
    console.log(this.id)
    this.files = [];
    for(let i in this.authService.dashBoard.projects){
    	if (this.authService.dashBoard.projects[i].id == this.id){
    		this.project = this.authService.dashBoard.projects[i];
        this.initForms();
        this.token = (JSON.parse(this.project.asperaSettings).asperaURL).split("/")[0];
        this.projectIndex = i;
        break;
      }
    }
    this.server = LabsURL['domain'];
    if (this.project!==undefined && this.project.isBusy){
      this.openLoadingProjectModal(this.projectStudyLocked);
      this.getProjectDetails();
    }
    this.getProjectContent(this.id);
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    });

    if(this.authService.dashBoard.settings['galaxy']){
      this.galaxyInstances = JSON.parse(this.authService.dashBoard.settings['galaxy']);
    }
  }



  submitForm(body: any){
      body["jwt"] = localStorage.getItem("jwt");
      body["user"] = localStorage.getItem("user");
      body["id"] = this.project.id;

      this.http.post(LabsURL['editProjectDetails'], body, { headers: contentHeaders })
        .subscribe(
          (response) => {
            let project = new Project().deserialize(JSON.parse(response.json().content));
            this.project = project;
            //this.authService.dashBoard.projects.push(project);
            this.editingModalRef.close();
            this.initForms();
            this.alerts.push({
              id: 1,
              type: 'success',
              message: 'Project ' + this.project.title + ' update successful!',
            });
          },
          error => {
            this.alerts.push({
              id: 1,
              type: 'danger',
              message: 'Project update unsuccessful! Error',
            });
            console.log(error.text());
          }
      );
  }

  asperaUpload(){
      this.asperaWeb = new AW4.Connect({sdkLocation: this.CONNECT_AUTOINSTALL_LOCATION, minVersion: this.MIN_CONNECT_VERSION});
      var connectInstaller = new AW4.ConnectInstaller({sdkLocation : this.CONNECT_AUTOINSTALL_LOCATION});
      var statusEventListener = function (eventType, data) {
          if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.INITIALIZING) {
            connectInstaller.showLaunching();
          } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.FAILED) {
            connectInstaller.showDownload();
          } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.OUTDATED) {
            connectInstaller.showUpdate();
          } else if (eventType === AW4.Connect.EVENT.STATUS && data == AW4.Connect.STATUS.RUNNING) {
            connectInstaller.connected();
          }
      };
      this.asperaWeb.addEventListener(AW4.Connect.EVENT.STATUS, statusEventListener);
      this.asperaWeb.initSession();
      this.asperaMessageModalRef.close();
      this.asperaWeb.showSelectFileDialog({
        success: (function(dataTransferObj){
          this.buildUploadSpec(dataTransferObj)
        }).bind(this),
        error: function (error) {
          alert(error);
          console.error(error);
        }
      });

  }

  showAsperaWaitingMessage(content){
    this.asperaMessageModalRef = this.modalService.open(content);
  }

  // Note: Files uploaded through Aspera might take some time to appear in the project folder. 

  buildUploadSpec(dataTransferObj) {
    var transferSpecs = [{
      "aspera_connect_settings": {
        // allow_dialogs is true by default.
        // Added for clarity.
        "allow_dialogs": true,
        "back_link": location.href
      },
      "transfer_spec": {}
    }]

    var params = {}
    var asperaSettings = JSON.parse(this.project.asperaSettings);
    params["remote_user"] = asperaSettings.asperaUser;
    params["remote_password"] = asperaSettings.asperaSecret;
    params['remote_host'] = "hx-fasp-1.ebi.ac.uk" //asperaSettings.asperaServer;
    
    // params['fasp_port'] = 33001;
    params['target_rate_kbps'] = 45000;
    params['min_rate_kbps'] = 0;
    params['lock_policy'] = false;
    params['lock_target_rate'] = false;
    params['direction'] = "send";
    params['lock_min_rate'] = false;
    params['rate_policy'] = "fair";
    params['cipher'] = "aes-128";
    params['ssh_port'] = 33001;

    transferSpecs[0]["transfer_spec"] = params;

    transferSpecs[0]["transfer_spec"]['paths'] = [];
    var files = dataTransferObj.dataTransfer.files;
    for (var i = 0, length = files.length; i < length; i += 1) {
      // Local path
      var pathSet = {src : files[i].name};
      var srcPath = pathSet.src || '';
      var destPath = '';
      var paths = transferSpecs[0]["transfer_spec"]['paths'];
      if (!paths) {
        transferSpecs[0]["transfer_spec"]['paths'] = [];
      }
      (transferSpecs[0]["transfer_spec"]['paths']).push({
        'source': srcPath,
        'destination': destPath
      });
    }
    transferSpecs[0]["transfer_spec"]['destination_root'] = "/dev/userSpace/" + asperaSettings.asperaURL ;

    var finalConfig = {};
    finalConfig['transfer_specs'] = transferSpecs;
    var requestId = this.asperaWeb.startTransfers(finalConfig, {success: function(data){
      console.log("Upload started");
    }});
  }

  getProjectDetails(){
    let body = {
      "jwt" : localStorage.getItem("jwt"),
      "user" : localStorage.getItem("user"),
      "id" : this.id
    }
    let updatedProject: Project = null;
    this.http.post(LabsURL['projectDetails'], body, { headers: contentHeaders })
    .subscribe(
      (response) => {
        let updatedProject = new Project().deserialize(JSON.parse(response.json().content));;
        if (updatedProject.isBusy){
          setTimeout(() => { this.getProjectDetails(); }, 5000);
        }else{

          this.authService.dashBoard.projects[this.projectIndex] = updatedProject;
          this.project = updatedProject;
          
          if(this.loadingProjectModalRef){
            this.loadingProjectModalRef.close();
          }
          if(this.loadingModalRef){
            this.loadingModalRef.close();
          }
          this.alerts.push({
            id: 1,
            type: 'success',
            message: 'Project ' + updatedProject.title + ' cloning successful!',
          });
        }
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
      );
  }

  open(content) {
    this.modalService.open(content);
  }

  openEditModal(content) {
    this.editingModalRef = this.modalService.open(content);
    this.editingModalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openMzml2IsaModal(content){
    this.mzml2isaModalRef = this.modalService.open(content);
  }

  openNmrml2IsaModal(content){
    this.nmrml2isaModalRef = this.modalService.open(content);
  }

  openSubmitAsStudyModal(content){
    this.submitAsStudyModalRef = this.modalService.open(content);
  }

  openJobsModal(content){
    if(this.project.jobs.length > 0){
      this.jobsModalRef = this.modalService.open(content);
    }
  }

  openDeleteConfirmationModal(content) {
    if(this.selectedFiles.length <= 0 && this.selectedDirectories.length <= 0 ){
      alert("No selection provided");
      return;
    }
    this.deleteConfirmationModalRef = this.modalService.open(content);
    this.deleteConfirmationModalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openLoadingModal(content) {
    this.loadingModalRef = this.modalService.open(content, { backdrop : "static" });
    this.loadingModalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openLoadingProjectModal(content) {
    this.loadingProjectModalRef = this.modalService.open(content, { backdrop : "static" });
    this.loadingProjectModalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  submitProjectAsStudy(isUpdate){

    this.processing = true;

    let body = {
      "jwt" : localStorage.getItem("jwt"),
      "user" : localStorage.getItem("user"),
      "project_id" : this.id
    }

    this.http.post(LabsURL['submitProject'], body, { headers: contentHeaders })
    .subscribe(
      (response) => {
           this.processing = false;
           if(this.submitAsStudyModalRef != undefined){
             this.submitAsStudyModalRef.close();
           }
           let respJob = JSON.parse(response.json().content);
           let projectJob = new Job().deserialize(respJob);
           
           this.alerts.push({
              id: this.alerts.length + 1,
              type: 'success',
              message: 'Job Satus: '+ projectJob.status +' | ID: ' + projectJob.jobId ,
           });

           this.openLoadingProjectModal(this.projectStudyLocked);
           this.project.isBusy = true;
      },
      error => {
        this.processing = false;
        console.log(error.text());
      }
    );

  }

  displayJobLogs(job: Job){
    let body = {
      "jwt" : localStorage.getItem("jwt"),
      "user" : localStorage.getItem("user"),
      "id" : this.id
    }

    if(job != undefined){
      body["jobId"] = job.jobId;
      if (Object.keys(job.log).length  == 0){
        this.http.post(LabsURL['getJobLogs'], body, { headers: contentHeaders })
        .subscribe(
          (response) => {
            job.log = JSON.parse((JSON.parse(response.json().content).log).replace(/\\n\\n/g, "</p><p>").replace(/\\n/g, "<br/>"));
            $("#job_"+job.jobId).collapse('toggle');
          },
          error => {
            console.log(error.text());
          }
        );
      }else{
        $("#job_"+job.jobId).collapse('toggle');
      }
    }
  }

  getJobStatus(job: Job){
    if(this.mzMLFiles.length > 0){
      this.convertMzml2isa(job);
    }else{
      this.convertNmrml2isa(job);
    }
  }

  convertNmrml2isa(job: Job){

    this.processing = true;

    let body = {
      "jwt" : localStorage.getItem("jwt"),
      "user" : localStorage.getItem("user"),
      "id" : this.id
    }

    if(job != undefined){
      body["jobId"] = job.jobId;
    }

    this.http.post(LabsURL['convertNMRMLToISA'], body, { headers: contentHeaders })
    .subscribe(
      (response) => {
         this.processing = false;
         if(this.nmrml2isaModalRef != undefined){
           this.nmrml2isaModalRef.close();
         }
         let respJob = JSON.parse(response.json().content);
         let projectJob = new Job().deserialize(respJob);
         if (job == undefined){
           this.alerts.push({
              id: this.alerts.length + 1,
              type: 'success',
              message: 'Job Submitted Successful | ID: ' + projectJob.jobId + " ( STATUS: " + projectJob.status + ")",
           });
           this.project.jobs.push(projectJob);
         }else{
           this.alerts.push({
              id: this.alerts.length + 1,
              type: 'success',
              message: 'Job Satus: '+ projectJob.status +' | ID: ' + projectJob.jobId ,
           });
           job.status = projectJob.status;
           job = projectJob;
         }
         this.getProjectContent(this.id);
      },
      error => {
        this.processing = false;
        console.log(error.text());
      }
    );

  }

  convertMzml2isa(job: Job){

    this.processing = true;

    let body = {
      "jwt" : localStorage.getItem("jwt"),
      "user" : localStorage.getItem("user"),
      "id" : this.id
    }

    if(job != undefined){
      body["jobId"] = job.jobId;
    }
    

    this.http.post(LabsURL['convertMZMLToISA'], body, { headers: contentHeaders })
    .subscribe(
      (response) => {
          this.processing = false;
         if(this.mzml2isaModalRef != undefined){
           this.mzml2isaModalRef.close();
         }
         let respJob = JSON.parse(response.json().content);
         let projectJob = new Job().deserialize(respJob);
         if (job == undefined){
           this.alerts.push({
              id: this.alerts.length + 1,
              type: 'success',
              message: 'Job Submitted Successful | ID: ' + projectJob.jobId + " ( STATUS: " + projectJob.status + ")",
           });
           this.project.jobs.push(projectJob);
         }else{
           this.alerts.push({
              id: this.alerts.length + 1,
              type: 'success',
              message: 'Job Satus: '+ projectJob.status +' | ID: ' + projectJob.jobId ,
           });
           job.status = projectJob.status;
           job = projectJob;
         }
         this.getProjectContent(this.id);
      },
      error => {
        this.processing = false;
        console.log(error.text());
      }
    );

  }

  getProjectContent(id) {
  	let body = {
      "jwt" : localStorage.getItem("jwt"),
      "user" : localStorage.getItem("user"),
      "id" : id
    }
    this.processing = true;
    this.http.post(LabsURL['projectContent'], body, { headers: contentHeaders })
    .subscribe(
      (response) => {
        this.processing = false;
        this.selectedFiles = [];
        this.processedFolders = [];
        this.projectStructure = new Directory();
        this.files = [];
        let body = JSON.parse(response.json().content);
        for (var i in body){
          var file = body[i];
          if(file.indexOf(".info") > -1 || file.indexOf(".log") > -1){
            //console.log("Ignoring log and info files");
          }else{
            this.files.push(file);
          }

          if(file.indexOf(".mzML") > -1 || file.indexOf(".mzml") > -1 || file.indexOf(".imzML") > -1){
             this.mzMLFiles.push(file);
          }

          if(file.indexOf(".nmrML") > -1 || file.indexOf(".nmrml") > -1){
             this.nmrMLFiles.push(file);
          }

          if(file.indexOf(".aspx") > -1){
            this.uploadInprogress = true;
          }
        }
        this.renderRichFileStructure();
        this.checkForValidISATabFiles();
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
    );
  }

  checkForValidISATabFiles(){
    let allFilesExist = [false, false, false];

    this.projectStructure.files.forEach(file => {
        if (file.title.indexOf("i_") == 1){
          allFilesExist[0] = true;
        }else if(file.title.indexOf("s_") == 1){
          allFilesExist[1] = true;
        }else if(file.title.indexOf("a_") == 1){
          allFilesExist[2] = true;
        }
    })

    if( allFilesExist.indexOf(false) == -1){
        this.isaTabDirectories.push(this.projectStructure);
    }
  }

  renderRichFileStructure(){
    this.projectStructure = new Directory();
    this.projectStructure.title = "root";
    this.projectStructure.level = 0;
    this.projectStructure = this.recursivelyDigFolder("/", this.projectStructure, 1);
  }

  recursivelyDigFolder(folderPath:string , directory:Directory, depth:number){
    this.files.forEach(file => {
      if (file.indexOf(folderPath) == 0 && file != folderPath){
        if((file.split("/").length - 1 <= depth) && file.indexOf(".") == -1){
          if (this.processedFolders.indexOf(file) == -1){
            this.processedFolders.push(file);
            let subDirectory = new Directory();
            subDirectory.title = file.split("/").slice(-1)[0];
            subDirectory.path = file;
            subDirectory.level = depth;
            directory.directories.push(this.recursivelyDigFolder(file, subDirectory, depth + 1));
          }
        }else{
          if ((file.split("/").length - 1) <= depth){
            let subFile = new File();
            subFile.title = file;
            subFile.index = this.fileIndex;
            this.fileIndex = this.fileIndex + 1
            directory.files.push(subFile);
          }
        }
      }
    })
    return directory;
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
