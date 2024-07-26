import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
//* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  loginForm: FormGroup;
  invalidFlag:boolean=false;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private formBuilder: FormBuilder,private _router:Router ,private _apiService:ApiService,private _dataSharing:DataSharingService) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit() {
   
  }
  //* ----------------------------  APIs Methods  --------------------------*//
 
  onSubmit() {
    let loginObj = {
      employee_name: this.loginForm.controls['username'].value,
      employee_password: this.loginForm.controls['password'].value
    };
    console.log(loginObj);
  
    this._apiService.loginmethod(loginObj.employee_name, loginObj.employee_password).subscribe({
      next: (res) => {
        console.log(res);
        if (res?.data && Object.keys(res?.data).length > 0) {
          const encryptedEmployee = this.encryptData(res?.data);
          
          sessionStorage.setItem('encryptedEmployee', encryptedEmployee);
          // this._dataSharing.sendEmployeeDetails(res?.data);
          this._router.navigate(['/dashboard']);
        } else {
          this.invalidFlag = true;
        }
      },
      error: () => {
        this.invalidFlag = true;
      }
    });
  }
  //* --------------------------  Public methods  --------------------------*//
  encryptData = (data: any) => {
    console.log(data,'login');
    
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret_key').toString();
    return encrypted;
};
  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
 
 
 
 
  
}
