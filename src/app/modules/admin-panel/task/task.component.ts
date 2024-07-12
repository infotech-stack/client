import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
  
    //* -----------------------  Variable Declaration  -----------------------*//
    taskForm: FormGroup;
  employees = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Michael Johnson' },
    { id: 4, name: 'Emily Brown' },
    { id: 5, name: 'David Wilson' }
  ];
  filesToUpload: File[] = [];
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(private fb: FormBuilder,private _apiService:ApiService) {
      this.taskForm = this.fb.group({
        projectName: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        projectStatus: ['', Validators.required],
        taskName: ['', Validators.required],
        fileAttachment: [null, Validators.required],
        deadline: ['', Validators.required],
        assignTo: ['', Validators.required],
      });
    }
    //* -------------------------  Lifecycle Hooks  --------------------------*//
   
  
    //* ----------------------------  APIs Methods  --------------------------*//
    onFileChange(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        for (let i = 0; i < input.files.length; i++) {
          this.filesToUpload.push(input.files[i]);
        }
        this.taskForm.patchValue({
          fileAttachments: this.filesToUpload
        });
      }
    }
    taskAssign(): void {
      if (this.taskForm.valid) {
        const formData = new FormData();
        formData.append('projectName', this.taskForm.get('projectName')?.value);
        formData.append('startDate', this.taskForm.get('startDate')?.value);
        formData.append('endDate', this.taskForm.get('endDate')?.value);
        formData.append('projectStatus', this.taskForm.get('projectStatus')?.value);
        formData.append('taskName', this.taskForm.get('taskName')?.value);
        formData.append('deadline', this.taskForm.get('deadline')?.value);
        formData.append('assignTo', this.taskForm.get('assignTo')?.value);
        console.log(formData);
        
        // Append multiple files
        for (let file of this.filesToUpload) {
          formData.append('fileAttachments', file, file.name);
        }
  
        this._apiService.assignTask(formData).subscribe(response => {
          console.log('Task assigned successfully', response);
        }, error => {
          console.error('Error assigning task', error);
        });
      }
    }
    //* --------------------------  Public methods  --------------------------*//
    get formControls() { return this.taskForm.controls; }
    //* ------------------------------ Helper Function -----------------------*//
  
    //! -------------------------------  End  --------------------------------!//
}
