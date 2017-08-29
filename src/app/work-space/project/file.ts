export class File {

	title: string = "";
	timeStamp: string = "";
	index: number = 0;
	
	deserialize(input) {
        this.title = input.title;
        this.timeStamp = input.timeStamp;
        this.index = input.fileIndex;
        return this;
    }
}
