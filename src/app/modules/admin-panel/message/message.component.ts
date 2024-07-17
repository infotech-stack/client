import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { response } from 'express';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import { Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit{
 
  //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
  
    //* -----------------------  Variable Declaration  -----------------------*//
    // communicationForm: FormGroup;
    messageForm: FormGroup;
    closeFlage:boolean=true;
    selectedFiles!: File[];
    uploadedFileName: string | null = null;
    empId!:number;
    downloadFlag:boolean=false;
    messageList:any;
    roles:any;
    employees:any;
    users= [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' }
    ];
    imageUrl!: string;
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(private fb: FormBuilder ,private _apiService:ApiService,private _dataSharing:DataSharingService,private cdr: ChangeDetectorRef) {
      // this.communicationForm = this.fb.group({
      //   recipients: [[], Validators.required], 
      //   message: ['', Validators.required],
      //   files: ['']
      // });
      this.messageForm = this.fb.group({
        employeeId: ['', Validators.required],
        message: ['', Validators.required],
        files: [[]]
      });
    }
 
    //* -------------------------  Lifecycle Hooks  --------------------------*//
    ngOnInit(): void {
      // this._dataSharing.getEmployeeDatils.subscribe({
      //   next: (res) => {
      //     this.empId = res.empId;
      //     this.roles=res.employee_role;
      //     this.getEmployee();
      //     this.getMessage();
      //   },
      //   error: (err) => {
      //     throw err;
      //   }
      // });
      const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
      const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
        this.empId=decryptedEmployee.empId;
        this.roles=decryptedEmployee.employee_role;
        this.getEmployee();
            this.getMessage();
    }
  
    //* ----------------------------  APIs Methods  --------------------------*//
    getEmployee(){
      this._apiService.getEmployee(this.empId,this.roles).subscribe({
        next: (res) => {
          this.employees = res.data;
        },
        error: (err) => {
          throw err;
        }
      })
    }
    // onFileChange(event: Event) {
    //   const fileInput = event.target as HTMLInputElement;
    //   if (fileInput.files && fileInput.files.length > 0) {
    //     this.communicationForm.get('files')?.setValue(fileInput.files);
    //   }
    // }
    // sendMessage() {
    //   if (this.communicationForm.invalid) {
    //     return;
    //   }
  
    //   const formData = new FormData();
    //   formData.append('files', this.communicationForm.get('files')?.value);
  
    //   this._apiService.uploadFile(formData).subscribe(
    //     (response: { filename: any; map: (arg0: (file: any) => any) => any[]; }) => {
    //       if (response && response.filename) {
    //         this.uploadedFileName = response.filename;
    //         console.log(this.uploadedFileName);
            
    //       } else if (response && Array.isArray(response)) {
    //         this.uploadedFileName = response.map(file => file.filename).join(', ');
    //         console.log(this.uploadedFileName);
            
    //       }
    //     },
    //     (error) => {
    //     }
    //   );
    // }
    getFile(){
      const fileName='';
      this._apiService.getFile(fileName).subscribe( (response: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(response);
      },
      error => {
        console.error('Error loading image:', error);
        // Handle error, e.g., show an error message
      }
    );
    }
    downloadPDF(fileName: any) {
      // this._apiService.getFile(fileName).subscribe(
      //   (response: Blob) => {
      //     const url = window.URL.createObjectURL(response);
      //     const a = document.createElement('a');
      //     a.href = url;
      //     a.download = fileName;
      //     document.body.appendChild(a);
      //     a.click();
      //     document.body.removeChild(a);
      //     window.URL.revokeObjectURL(url);
      //   },
      //   error => {
      //     console.error('Error downloading file:', error);
      //   }
      // );
      fileName.forEach((file:string)=>{
          this.downloadFile(file);
      });
    }
    onSelectFiles(event: any) {
      if (event.target.files) {
        this.selectedFiles = Array.from(event.target.files);
        this.messageForm.patchValue({ files: this.selectedFiles });
      }
    }
    onSubmit() {
      if (this.messageForm.valid) {
        const { employeeId, message, files } = this.messageForm.value;
        this._apiService.sendMessage(employeeId, message, files).subscribe(
          response => {
            console.log('Message sent successfully', response);
            const messageObj={
              message_description:this.messageForm.controls['message'].value,
              filename:response.data,
              empId:this.messageForm.controls['employeeId'].value,
              send_by:this.empId
            }
            // this.downloadFile(fileName);
            this.postMessage(messageObj);
            // if (response.data && Array.isArray(response.data)) {
            //   response.data.forEach((fileName: string) => {
            //     console.log(fileName, 'name');
            //     const messageObj={
            //       message_description:this.messageForm.controls['message'].value,
            //       filename:response.data,
            //       empId:this.messageForm.controls['employeeId'].value,
            //       send_by:this.empId
            //     }
            //     // this.downloadFile(fileName);
            //     this.postMessage(messageObj);

            //   });
            // }
          },
          error => {
            console.error('Error sending message', error);
          }
        );
      }
    }
    postMessage(messageObj:any){
      this._apiService.postMessage(messageObj).subscribe({
        next: (res) => {
          console.log(res);
          
        },
        error: (err) => {
          throw err;
        }
      })
    }
    downloadFile(fileName: string) {
      this._apiService.getFile(fileName).subscribe(response => {
        const contentDisposition = response.headers.get('Content-Disposition');
        const blob = new Blob([response.body], { type: response.body.type });

        const a = document.createElement('a');
        a.style.display = 'none';
        document.body.appendChild(a);

        const objectUrl = window.URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = this.getFileNameFromContentDisposition(contentDisposition) || fileName;
        a.click();

        window.URL.revokeObjectURL(objectUrl);
      }, error => {
        console.error('Error downloading file', error);
      });
    }
    private getFileNameFromContentDisposition(contentDisposition: string | null): string | null {
      if (!contentDisposition) return null;
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
      return fileNameMatch ? fileNameMatch[1] : null;
    }
    getMessage(){
      this._apiService.getMessage(this.empId).subscribe({
        next: (res) => {
          console.log(res);
          this.messageList=res.data;
          this.closeFlage=true;
        },
        error: (err) => {
          throw err;
        }
      })
    }
    //* --------------------------  Public methods  --------------------------*//
    get formControls() { return this.messageForm.controls; }
    closeAlert() {
     this.closeFlage=false;
    }
    //* ------------------------------ Helper Function -----------------------*//
    decryptData = (encryptedData: any) => {
      const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
  };
    //! -------------------------------  End  --------------------------------!//
}
