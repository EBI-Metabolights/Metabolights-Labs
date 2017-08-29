import { Job } from "../project/job";

export class Project {

	settings: string = "";
	projectLocation: string = "";
	asperaSettings: string = "";
	id : string = "";
	title: string = "";
	description: string = "";
	updatedAt: String = "";
	createdAt: String = "";
	isBusy: boolean = false;
	jobs: Job[] = [];
	
	deserialize(input) {
        this.settings = input.settings;
        this.projectLocation = input.projectLocation;
        this.asperaSettings = input.asperaSettings;
        this.title = input.title;
        this.description = input.description;
        this.id = input.id;
        this.createdAt = input.createdAt;
        this.updatedAt = input.updatedAt;
        this.isBusy = input.busy;

        for (let id in input.jobs){
        	let job = input.jobs[id];
        	let projectJob = new Job().deserialize(job);
        	this.jobs.push(projectJob);
        }

        return this;
    }
}
