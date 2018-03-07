import { Component, OnInit } from '@angular/core';
import { User } from "../dashboard/user";
import { AuthService } from "../../auth.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { contentHeaders } from '../../common/headers';
import { Http, Response, Headers } from '@angular/http';
import { LabsURL } from '../../common/globals';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	constructor(private authService: AuthService, private modalService: NgbModal, public http: Http, private fb: FormBuilder) { }

  	user: User;
  	settings: object;
  	galaxyInstances: object[];
  	addGalaxyModalRef: NgbModalRef;
  	editGalaxyModalRef: NgbModalRef;
  	deleteGalaxyModalRef: NgbModalRef;
  	closeResult: string;
  	addGalaxyDetailsForm: FormGroup;

  	ngOnInit() {
  		this.user = this.authService.dashBoard.user;
  		this.settings = this.authService.dashBoard.settings;
  		if(this.settings['galaxy']){
  			this.galaxyInstances = JSON.parse(this.settings['galaxy']);	
  		}
  		this.addGalaxyDetailsForm = this.fb.group({
	        'title'         : ["" , Validators.required],
	        'url'         	: ["" , Validators.required],
	        'apikey'        : ["" , Validators.required],
	        'description'   : "",
	        'error'			: ''
	    });
  	}

  	openGalaxyModal(content) {
  		this.addGalaxyModalRef = this.modalService.open(content);
	    this.addGalaxyModalRef.result.then((result) => {
	      this.closeResult = `Closed with: ${result}`;
	    }, (reason) => {
	      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	    });
	}

	openEditGalaxyModal(content, galaxyDetails) {
		this.addGalaxyDetailsForm = this.fb.group({
	        'title'         : [galaxyDetails.name , Validators.required],
	        'url'         : [galaxyDetails.url , Validators.required],
	        'apikey'         : [galaxyDetails.apikey , Validators.required],
	        'description'   : galaxyDetails.description
	    });

  		this.editGalaxyModalRef = this.modalService.open(content);
	    this.editGalaxyModalRef.result.then((result) => {
	      this.closeResult = `Closed with: ${result}`;
	    }, (reason) => {
	      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	    });
	}

	openDeleteGalaxyModal(content, galaxyDetails) {
		this.addGalaxyDetailsForm = this.fb.group({
	        'title'         : [galaxyDetails.name , Validators.required],
	        'url'         : [galaxyDetails.url , Validators.required],
	        'apikey'         : [galaxyDetails.apikey , Validators.required],
	        'description'   : galaxyDetails.description
	    });

  		this.deleteGalaxyModalRef = this.modalService.open(content);
	    this.deleteGalaxyModalRef.result.then((result) => {
	      this.closeResult = `Closed with: ${result}`;
	    }, (reason) => {
	      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	    });
	}

	submitForm(data) {

		let body = {};
		body["jwt"] = localStorage.getItem("jwt");
		body["user"] = localStorage.getItem("user");
		body["title"] = data.title;
		body["url"] = data.url;
		body["apikey"] = data.apikey;
		body["description"] = data.description;
		body["property"] = "galaxy";

		this.http.post(LabsURL['settings'], body, { headers: contentHeaders })
		.subscribe(
		  (response) => {
		  	this.authService.initializeWorkSpace().subscribe( data => {
		      	this.user = this.authService.dashBoard.user;
		  		this.settings = this.authService.dashBoard.settings;
		  		this.galaxyInstances = JSON.parse(this.settings['galaxy']);
		    });
		  	if(this.addGalaxyModalRef){
		  		this.addGalaxyModalRef.close();	
		  	}
		  	if(this.editGalaxyModalRef){
		  		this.editGalaxyModalRef.close();	
		  	}
		  },
		  error => {
		  	
		  }
		);
	}

	submitDeleteForm(data) {

		let body = {};
		body["jwt"] = localStorage.getItem("jwt");
		body["user"] = localStorage.getItem("user");
		body["url"] = data.url;
		body["delete"] = "deleteGalaxyInstance";
		body["property"] = "galaxy";

		this.http.post(LabsURL['settings'], body, { headers: contentHeaders })
		.subscribe(
		  (response) => {
		  	this.authService.initializeWorkSpace().subscribe( data => {
		      	this.user = this.authService.dashBoard.user;
		  		this.settings = this.authService.dashBoard.settings;
		  		this.galaxyInstances = JSON.parse(this.settings['galaxy']);
		    });
		  	if(this.deleteGalaxyModalRef){
		  		this.deleteGalaxyModalRef.close()
		  	}
		  },
		  error => {
		  	
		  }
		);
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
