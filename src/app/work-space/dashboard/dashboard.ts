import { User } from "./user";
import { Project } from "../project/project";

export class Dashboard {
	user: User;
	projects: Project[] = [];
    createdAt: string = "";
    updatedAt: string = "";

	deserialize(input) {
        this.user = new User().deserialize(input.owner);
        this.createdAt = input.createdAt;
        this.updatedAt = input.updatedAt;
        for (let id in input.projects){
        	let indProject = input.projects[id];
        	let project = new Project().deserialize(indProject);
        	this.projects.push(project);
        }
        return this;
    }
}
