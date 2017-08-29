export class User {
  	email: string;
	userName: string;
	joinDate: string;
	firstName: string;
	lastName: string;
	address: string;
	affiliation: string;
	affiliationUrl: string;
	role: string;
	orcid: string;

	deserialize(input) {
        this.email = input.email;
        this.userName = input.userName;
        this.joinDate = input.joinDate;
        this.firstName = input.firstName;
        this.lastName = input.lastName;
        this.address = input.address;
        this.affiliation = input.affiliation;
        this.affiliationUrl = input.affiliationUrl;
        this.role = input.role;
        this.orcid = input.orcid;       
        return this;
    }
}