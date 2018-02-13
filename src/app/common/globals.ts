var environment = "dev";
var server = "//localhost:8080/metabolights/webservice/";

if (environment == "prod"){
	server = "//www.ebi.ac.uk/metabolights/webservice/";
}else if (environment == "dev"){
	server = "//wwwdev.ebi.ac.uk/metabolights/webservice/";
}

export const LabsURL 			= {};
// Application
LabsURL['authenticate'] 		= server + 'labs/authenticate';

// Workspace
LabsURL['initialise'] 			= server + 'labs-workspace/initialise';
LabsURL['createProject'] 		= server + 'labs-workspace/createProject';
LabsURL['deleteProject'] 		= server + 'labs-workspace/deleteProject';

// Project
LabsURL['projectContent'] 		= server + 'labs-project/content';
LabsURL['projectDetails'] 		= server + 'labs-project/details';
LabsURL['submitProject'] 		= server + 'labs-project/submitProject';
LabsURL['editProjectDetails'] 	= server + 'labs-project/editDetails';
LabsURL['delete'] 				= server + 'labs-project/deleteFiles';

// Tools
LabsURL['convertMZMLToISA'] 	= server + 'labs-project/convertMZMLToISA';
LabsURL['convertNMRMLToISA'] 	= server + 'labs-project/convertNMRMLToISA';
LabsURL['getJobLogs'] 			= server + 'labs-project/getJobLogs';


