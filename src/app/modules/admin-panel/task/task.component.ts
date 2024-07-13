import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit{
  //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
  
    //* -----------------------  Variable Declaration  -----------------------*//
    taskForm: FormGroup;
  // employees = [
  //   { id: 1, name: 'John Doe' },
  //   { id: 2, name: 'Jane Smith' },
  //   { id: 3, name: 'Michael Johnson' },
  //   { id: 4, name: 'Emily Brown' },
  //   { id: 5, name: 'David Wilson' }
  // ];
  employees:any;
  filesToUpload: File[] = [];
  selectedEmployeeIds: number[] = [];
  empId!:number;
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(private fb: FormBuilder,private _apiService:ApiService) {
      this.taskForm = this.fb.group({
        projectName: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        projectStatus: ['', Validators.required],
        assignTo: ['', Validators.required],
      });
    }
 
    //* -------------------------  Lifecycle Hooks  --------------------------*//  
    ngOnInit(): void {
     this.getEmoployee();
    }
    //* ----------------------------  APIs Methods  --------------------------*//
    // onFileChange(event: Event): void {
    //   const input = event.target as HTMLInputElement;
    //   if (input.files) {
    //     for (let i = 0; i < input.files.length; i++) {
    //       this.filesToUpload.push(input.files[i]);
    //     }
    //     this.taskForm.patchValue({
    //       fileAttachments: this.filesToUpload
    //     });
    //   }
    // }
    getEmoployee(){
      this._apiService.getEmployee().subscribe({

        
        next:(res)=>{
          this.employees=res.data;
          console.log(this.employees);
          
        },
        error:(err)=>{
          throw err;
        }
      })
    }
      // if (this.taskForm.valid) {
      //   const formData = new FormData();
      //   formData.append('projectName', this.taskForm.get('projectName')?.value);
      //   formData.append('startDate', this.taskForm.get('startDate')?.value);
      //   formData.append('endDate', this.taskForm.get('endDate')?.value);
      //   formData.append('projectStatus', this.taskForm.get('projectStatus')?.value);
      //   formData.append('taskName', this.taskForm.get('taskName')?.value);
      //   formData.append('assignTo', this.taskForm.get('assignTo')?.value);
      //   console.log(formData);
        
      //   // Append multiple files
      //   for (let file of this.filesToUpload) {
      //     formData.append('fileAttachments', file, file.name);
      //   }
  
      //   this._apiService.assignTask(formData).subscribe(response => {
      //     console.log('Task assigned successfully', response);
      //   }, error => {
      //     console.error('Error assigning task', error);
      //   });
      // }
      getEmployeeId(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        const selectedValue = selectElement.value;
        if (selectedValue === '0') {
          this.selectedEmployeeIds = this.employees.map((emp: { empId: any; }) => emp.empId);
        } else {
          this.selectedEmployeeIds = [parseInt(selectedValue, 10)];
        }
        this.taskForm.patchValue({ assignTo: this.selectedEmployeeIds });
      }
    
      taskAssign(): void {
        if (this.taskForm.valid) {
          const formData = {
            project_name: this.taskForm.controls['projectName'].value,
            start_date: this.taskForm.controls['startDate'].value,
            end_date: this.taskForm.controls['endDate'].value,
            project_status: this.taskForm.controls['projectStatus'].value,
            assignTo: this.selectedEmployeeIds
          };
    
          console.log(formData);
    
          this._apiService.taskAssignToEmployee(formData).subscribe({
            next: (res) => {
              console.log(res);
            },
            error: (err) => {
              console.error(err);
            }
          });
        } else {
          console.error('Form is invalid');
        }
      }
    //* --------------------------  Public methods  --------------------------*//
    get formControls() { return this.taskForm.controls; }
    
  
    //* ------------------------------ Helper Function -----------------------*//
  
    //! -------------------------------  End  --------------------------------!//
}
