import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import * as CryptoJS from 'crypto-js';
import { passwordMatchValidator } from '../../../validator/confirm-password.validator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '../../../shared/services/snackbar/snackbar.service';
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  employeeForm: FormGroup;
  employeeList: any;
  dummyUsers = [
    {
      name: 'John Doe',
      designation: 'Software Engineer',
      cabinNo: 'A-123',
      dateOfJoining: '2023-01-15',
      address: '123 Main St, Cityville, Country',
      contactNo: '+1 234-567-8901',
      password: 'password123',
      confirmPassword: 'password123'
    },
    {
      name: 'Jane Smith',
      designation: 'Product Manager',
      cabinNo: 'B-456',
      dateOfJoining: '2022-11-20',
      address: '456 Elm St, Townsville, Country',
      contactNo: '+1 345-678-9012',
      password: 'securepass',
      confirmPassword: 'securepass'
    },
    {
      name: 'Michael Johnson',
      designation: 'UI/UX Designer',
      cabinNo: 'C-789',
      dateOfJoining: '2023-03-05',
      address: '789 Oak St, Villageton, Country',
      contactNo: '+1 456-789-0123',
      password: 'designer123',
      confirmPassword: 'designer123'
    },
    {
      name: 'Emily Brown',
      designation: 'Marketing Specialist',
      cabinNo: 'D-101',
      dateOfJoining: '2022-09-10',
      address: '101 Pine St, Hamletville, Country',
      contactNo: '+1 567-890-1234',
      password: 'marketing456',
      confirmPassword: 'marketing456'
    },
    {
      name: 'David Wilson',
      designation: 'Backend Developer',
      cabinNo: 'E-202',
      dateOfJoining: '2023-02-18',
      address: '202 Maple St, Foresttown, Country',
      contactNo: '+1 678-901-2345',
      password: 'backend789',
      confirmPassword: 'backend789'
    }
  ];
  empId!: number;
  role: any;
  editBtnFlag: boolean = false;
  addBtnFlag: boolean = true;
  employeeId!: number;
  totalPages: number = 1;
  currentPage = 1;
  pageSize: any = 5;
  sortField = 'employee_name';
  sortOrder = 'ASC';
  search = '';
  alertSuccess: boolean = false;
  alertError: boolean = false;
  alertMessage: string = '';
  employeeAccess: any;
  employeeRole: any;
  is_loading: boolean = false;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder, private _apiService: ApiService, public _dialog: MatDialog, private _snakbar: SnackBarService) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobileno: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'), Validators.maxLength(10)]],
      dateofbirth: ['', Validators.required],
      dateofjoin: ['', Validators.required],
      religion: ['', Validators.required],
      education: ['', Validators.required],
      address: ['', Validators.required],
      designation: ['', Validators.required],
      cabinno: ['', Validators.required],
      role: ['', Validators.required],
      access: ['', Validators.required],
      experience: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      gender: ['', [Validators.required]]
    }, {
      validators: passwordMatchValidator('password', 'confirmPassword')
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
    this.empId = decryptedEmployee.empId;
    this.role = decryptedEmployee.employee_role;
    this.getEmployee();
    this.getEmployeeRole();
    this.getEmployeeAccess();
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  insertEmployee() {
    let registerObj = {
      employee_name: this.employeeForm.controls['name'].value,
      employee_designation: this.employeeForm.controls['designation'].value,
      employee_cabinno: this.employeeForm.controls['cabinno'].value,
      employee_dateofjoin: this.employeeForm.controls['dateofjoin'].value,
      employee_address: this.employeeForm.controls['address'].value,
      employee_contactno: this.employeeForm.controls['mobileno'].value,
      employee_password: this.employeeForm.controls['password'].value,
      employee_confirmpassword: this.employeeForm.controls['confirmPassword'].value,
      employee_email: this.employeeForm.controls['email'].value,
      employee_date_of_birth: this.employeeForm.controls['dateofbirth'].value,
      employee_religion: this.employeeForm.controls['religion'].value,
      employee_education: this.employeeForm.controls['education'].value,
      employee_experience: this.employeeForm.controls['experience'].value,
      employee_role: this.employeeForm.controls['role'].value,
      employee_access: this.employeeForm.controls['access'].value,
      employee_gender: this.employeeForm.controls['gender'].value

    }
    this.is_loading = true;
    this._apiService.insertEmployee(registerObj).subscribe({
      next: (res) => {
        this.is_loading = false;
     
        this.getEmployee();
        this.employeeForm.reset();
      },
      error: (err) => {
        this.is_loading = false;
        throw err;
      }
    })


  }
  getEmployee() {
    const limit = this.pageSize === 'all' ? -1 : Number(this.pageSize);
    this.is_loading = true;
    this._apiService.getEmployee(this.empId, this.role, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
     
        this._snakbar.success('Data Fetch successfully');
        this.is_loading = false;
        this.employeeList = res.data;
        this.employeeForm.reset();
        this.totalPages = limit === -1 ? 1 : Math.ceil(res.total / Number(this.pageSize));
        this.editBtnFlag = false;
        this.addBtnFlag = true;
      },
      error: (err) => {
        this._snakbar.error('Something Went Wrong');
        this.is_loading = false;
        throw err;
      }
    })
  }
  editUser(item: any) {
    this.employeeId = item.empId;
    const dateOfJoin = new Date(item.employee_dateofjoin).toISOString().split('T')[0];
    const dateofBirth = new Date(item.employee_dateofjoin).toISOString().split('T')[0];
    this.employeeForm.patchValue({
      name: item.employee_name,
      designation: item.employee_designation,
      cabinno: item.employee_cabinno,
      dateofjoin: dateOfJoin,
      address: item.employee_address,
      mobileno: item.employee_contactno,
      password: item.employee_password,
      confirmPassword: item.employee_confirmpassword,
      role: item.employee_role,
      access: item.employee_access,
      email: item.employee_email,
      dateofbirth: dateofBirth,
      religion: item.employee_religion,
      education: item.employee_education,
      experience: item.employee_experience,
      gender: item.employee_gender
    });
    this.editBtnFlag = true;
    this.addBtnFlag = false;
  
  }

  deleteUser(item: any) {
    this.is_loading = true;
    this._apiService.removeEmployee(item.empId).subscribe({
      next: (res) => {
        this.getEmployee();
        this.is_loading = false;
      },
      error: (err) => {
        this.is_loading = false;
        throw err;
      }
    })
  }
  updateEmployee() {
    let editedObj = {
      employee_name: this.employeeForm.controls['name'].value,
      employee_designation: this.employeeForm.controls['designation'].value,
      employee_cabinno: this.employeeForm.controls['cabinno'].value,
      employee_dateofjoin: this.employeeForm.controls['dateofjoin'].value,
      employee_address: this.employeeForm.controls['address'].value,
      employee_contactno: this.employeeForm.controls['mobileno'].value,
      employee_password: this.employeeForm.controls['password'].value,
      employee_confirmpassword: this.employeeForm.controls['confirmPassword'].value,
      employee_email: this.employeeForm.controls['email'].value,
      employee_date_of_birth: this.employeeForm.controls['dateofbirth'].value,
      employee_religion: this.employeeForm.controls['religion'].value,
      employee_education: this.employeeForm.controls['education'].value,
      employee_experience: this.employeeForm.controls['experience'].value,
      employee_role: this.employeeForm.controls['role'].value,
      employee_access: this.employeeForm.controls['access'].value,
      employee_gender: this.employeeForm.controls['gender'].value
    }


    if (this.employeeForm.valid) {

      this.is_loading = true;
      this._apiService.updateEmployee(this.employeeId, editedObj).subscribe({
        next: (res) => {
       
          this.is_loading = false;
          this.getEmployee();
        },
        error: (err) => {
          this.is_loading = false;
          throw err;
        }
      });
    }
  }
  getEmployeeRole() {
    this._apiService.getEmployeeRole().subscribe({
      next: (res) => {
        this.employeeRole = res.data;
      },
      error: (err) => {
        throw err;
      }
    });
  }
  getEmployeeAccess() {
    this._apiService.getEmployeeAccess().subscribe({
      next: (res) => {
        this.employeeAccess = res.data;
      },
      error: (err) => {
        throw err;
      }
    });
  }
  //* --------------------------  Public methods  --------------------------*//
  get formControls() {
    return this.employeeForm.controls;
  }
  checkPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }
  //* ------------------------------ Helper Function -----------------------*//
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
  onSort(field: string) {
    this.sortField = field;
    this.sortOrder = this.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    this.getEmployee();
  }
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.getEmployee();
  }
  onPageSizeChange(event: Event) {
    const selectedSize = (event.target as HTMLSelectElement).value;
    this.pageSize = selectedSize === 'all' ? 'all' : parseInt(selectedSize, 10);
    this.currentPage = 1;
    this.getEmployee();
  }
  onSearchChange(newSearch: any) {
    const element = (newSearch.target as HTMLSelectElement).value;
    this.search = element;
    this.currentPage = 1; // Reset to the first page
    this.getEmployee();
  }
  onSearch(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.getEmployee();
  }
  openDialog(item: any) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { employee_name: item.employee_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser(item);

      }
    });
  }
  //! -------------------------------  End  --------------------------------!//

}



