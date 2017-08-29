import { File } from './file';

export class Directory {

	title: string = "";
	files: File[] = [];
	directories: Directory[] = [];
	timeStamp: string = "";
	level: number = 0;
	path: string = "";
	
	deserialize(input) {
        this.title = input.title;
        this.files = input.files;
        this.directories = input.directories;
        this.timeStamp = input.timeStamp;
        this.level = input.level;
        this.path = input.path;
        return this;
    }
}
