import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../validator/confirm-password.validator';
import { ApiService } from '../../../shared/services/api/api.service';
import * as CryptoJS from 'crypto-js';
import { SnackBarService } from '../../../shared/services/snackbar/snackbar.service';
@Component({
  selector: 'app-pages',
  templateUrl: './admin-panel-settings.component.html',
  styleUrl: './admin-panel-settings.component.scss'
})
export class AdminPanelSettingsComponent implements OnInit{
//* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//

  registerForm: FormGroup;
  empId!: number;
  roles: any;
  is_loading:boolean=false;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder,private _apiService:ApiService,private _snakbar:SnackBarService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: passwordMatchValidator('password', 'confirmPassword') 
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
      this.empId=decryptedEmployee.empId;
      this.roles=decryptedEmployee.employee_role;
  }

  //* ----------------------------  APIs Methods  --------------------------*//

  onSubmit() {
    if (this.registerForm.valid) {
    let resetPasswordObj={
      employee_name:this.registerForm.controls['username'].value,
      employee_password:this.registerForm.controls['password'].value,
      employee_confirmpassword:this.registerForm.controls['confirmPassword'].value,
    }
      this.is_loading=true;
      this._apiService.resetPassword(this.empId,resetPasswordObj).subscribe({
        next: (res) => {
          this._snakbar.success('Password Changed successfully');
    
          this.is_loading=false;
          this.registerForm.reset();
        },
        error:(err)=>{
          this._snakbar.error('Something Went Wrong');
          this.is_loading=false;
          this.registerForm.reset();
          throw err;
        }
      });
    }
  }
  //* --------------------------  Public methods  --------------------------*//
  
  //* ------------------------------ Helper Function -----------------------*//
get formControls(){
  return this.registerForm.controls;
}
decryptData = (encryptedData: any) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
  //! -------------------------------  End  --------------------------------!//


 

}
