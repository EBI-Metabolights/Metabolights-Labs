import { Component, Input, Inject } from '@angular/core';
import { Directory } from '../project/directory';
import { ProjectComponent } from '../project/project.component';


@Component ({
  selector: 'tree-view',
  styleUrls: ['./project.component.css'],
  template: `
  <span *ngIf="directory.level > 0">
    <input [checked]="isDirectorySelected(directory)" (change)="updateSelectedDirectoryFilesList($event, directory)" type="checkbox">&nbsp;
    <img src="assets/img/folder.png" height="16" class="logo">
  </span>
  <a class="pointer" (click)="toogleDirectory($event)" *ngIf="directory.level > 0">
    {{ directory.title }}
  </a>
  <ul [ngClass]="{'hide' :  directory.level > 0, 'npl' :  directory.level == 0}">
    <li *ngFor="let subDirectory of directory.directories">
      <tree-view [directory]="subDirectory"></tree-view>
    </li>
    <li *ngFor="let file of directory.files; let i = index;">
      <a><input [checked]="parent.selectedFiles.indexOf(file) > -1" (change)="updateSelectedFilesList($event, file.index - 1 , file)" type="checkbox">
          <span *ngIf="isISAFile(file); else elseBlock">
            <img src="assets/img/isa.png" height="16" class="logo"/>
          </span>
          <ng-template #elseBlock>
            <img src="assets/img/file.png" height="16" class="logo"/>
          </ng-template>
          &nbsp;{{ file.title.split("/").slice(-1)[0] }}</a>
    </li>
  </ul>
  `
})
export class TreeView {
  @Input() directory: Directory;

  constructor(@Inject(ProjectComponent) private parent: ProjectComponent){
  }

  isDirectorySelected(directory){
    let allSelected = true;
    if(directory.files.length == 0){
      if (directory.directories.length > 0){
        directory.directories.forEach(subDirectory => {
          allSelected = this.isDirectorySelected(subDirectory);
        })
      }
      else if(this.parent.selectedDirectories.indexOf(directory) == -1){
        allSelected = false;
      }
    }else{
      directory.files.forEach(file => {
         if (this.parent.selectedFiles.indexOf(file) == -1){
           allSelected = false;
         }
      });
    }
    return allSelected;
  }

  toogleDirectory(event){
    event.target.nextElementSibling.classList.toggle("hide");
  }

  isISAFile(file){
    if(file.title.indexOf("s_") == 1){
      return true;
    }else if(file.title.indexOf("i_") == 1){
      return true;
    }else if(file.title.indexOf("a_") == 1){
      return true;
    }
    return false;
  }

  updateSelectedDirectoryFilesList(e, directory){
    if(e.target.checked){
       this.parent.selectedDirectories.push(directory);
       this.addFilesRecursively(directory);
    }else{
      let selectedDirectoryIndex = -1;
      let index = 0
      this.parent.selectedDirectories.forEach(pdirectory=>{
        if(pdirectory.title === directory.title){
          selectedDirectoryIndex = index;
        }
        index = index + 1;
      })

      if(selectedDirectoryIndex > -1){
        this.parent.selectedDirectories.splice(selectedDirectoryIndex, 1);
      }

      this.removeFilesRecursively(directory);
    }
  }

  updateSelectedFilesList(e, index, filename){
    if(e.target.checked){
      this.parent.selectedFiles[index] = filename;
    }else{
      this.parent.selectedFiles[index] = null;
    }
  }

  addFilesRecursively(directory){
    if(directory.directories.length > 0){
      directory.directories.forEach(directory => {
        this.addFilesRecursively(directory);
        this.parent.selectedDirectories.push(directory)
      })
    }
    directory.files.forEach(file => {
     this.parent.selectedFiles[file.index - 1] = file;
    });
    
  }

  removeFilesRecursively(directory){
    if(directory.directories.length > 0){
      directory.directories.forEach(directory => {
        this.removeFilesRecursively(directory);
      })
    }
    let selectedDirectoryIndex = -1;
    let index = 0
    this.parent.selectedDirectories.forEach(pdirectory=>{
      if(pdirectory.title === directory.title){
        selectedDirectoryIndex = index;
      }
      index = index + 1;
    })
    if(selectedDirectoryIndex > -1){
      this.parent.selectedDirectories.splice(selectedDirectoryIndex, 1);
    }
    directory.files.forEach(file => {
     this.parent.selectedFiles[file.index - 1] = null;
    });
  }
}