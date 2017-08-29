export class Job {

	hide: boolean = false;
	mllprojectId: string = "";
	jobId: string = "";
	status: string = "";
	info: Object = {};
	updatedAt: String = "";
	createdAt: String = "";
	log: Object = {};

	deserialize(input) {

		this.mllprojectId = input.mllprojectId;
		this.jobId = input.jobId;
		this.status = input.status;
		this.info = input.info;
		this.updatedAt = input.updatedAt;
		this.createdAt = input.createdAt;
        this.hide = input.hide;

        return this;
    }
}
