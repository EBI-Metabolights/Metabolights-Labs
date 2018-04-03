var environment = "dev";
var domain = "//localhost:8080/metabolights/";

if (environment == "prod"){
	domain = "//www.ebi.ac.uk/metabolights/";
}else if (environment == "dev"){
	domain = "//wwwdev.ebi.ac.uk/metabolights/";
}

export const LabsURL 			= {};

LabsURL['domain']				= domain

let webservice = domain + "webservice/"

// Application
LabsURL['authenticate'] 		= webservice + 'labs/authenticate';
LabsURL['studiesList'] 			= webservice + 'study/list';

// Workspace
LabsURL['initialise'] 			= webservice + 'labs-workspace/initialise';
LabsURL['createProject'] 		= webservice + 'labs-workspace/createProject';
LabsURL['deleteProject'] 		= webservice + 'labs-workspace/deleteProject';
LabsURL['settings'] 			= webservice + 'labs-workspace/settings';
LabsURL['download'] 			= webservice + 'labs-workspace/downloadFile';

// Project
LabsURL['projectContent'] 		= webservice + 'labs-project/content';
LabsURL['projectDetails'] 		= webservice + 'labs-project/details';
LabsURL['submitProject'] 		= webservice + 'labs-project/submitProject';
LabsURL['editProjectDetails'] 	= webservice + 'labs-project/editDetails';
LabsURL['delete'] 				= webservice + 'labs-project/deleteFiles';

// Tools
LabsURL['convertMZMLToISA'] 	= webservice + 'labs-project/convertMZMLToISA';
LabsURL['convertNMRMLToISA'] 	= webservice + 'labs-project/convertNMRMLToISA';
LabsURL['getJobLogs'] 			= webservice + 'labs-project/getJobLogs';
