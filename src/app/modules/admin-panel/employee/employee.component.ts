import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent implements OnInit{


  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//
  employeeForm: FormGroup;
  employeeList:any;
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
  editBtnFlag:boolean=false;
  addBtnFlag:boolean=true;
  employeeId!:number;
  EmployeeAccess: string[] = ['Dashboard', 'Message', 'Employee', 'Task', 'Task Status', 'Pages', 'Search Employee', 'Task Reports','Employee Attendance'];
  
  EmployeeRole: string[] = ['Admin', 'Team Leader', 'Senior Developer', 'Junior Developer', 'Customer Support', 'Digital Marketing'];
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder,private _apiService:ApiService) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      cabinNo: ['', Validators.required],
      dateOfJoining: ['', Validators.required],
      address: ['', Validators.required],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      role: [[], Validators.required],
      access: [[], Validators.required]
    }, { validator: this.passwordMatchValidator });
  }
 
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    this.getEmployee();
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  insertEmployee(){
  let registerObj={
    employee_name:this.employeeForm.controls['name'].value,
    employee_designation:this.employeeForm.controls['designation'].value,
    employee_cabinno:this.employeeForm.controls['cabinNo'].value,
    employee_dateofjoin:this.employeeForm.controls['dateOfJoining'].value,
    employee_address:this.employeeForm.controls['address'].value,
    employee_contactno:this.employeeForm.controls['contactNo'].value,
    employee_password:this.employeeForm.controls['password'].value,
    employee_confirmpassword:this.employeeForm.controls['confirmPassword'].value,
    employee_role:this.employeeForm.controls['role'].value,
    employee_access:this.employeeForm.controls['access'].value,
  }
    
    this._apiService.insertEmployee(registerObj).subscribe({
      next:(res)=>{
        console.log(res);
        this.employeeForm.reset();
      },
      error:(err)=>{
          throw err;
      }
    })
  }

  getEmployee(){
 this._apiService.getEmployee().subscribe({
  next:(res)=>{
    console.log(res);
    
    this.employeeList=res.data;
   this.employeeForm.reset();
   this.editBtnFlag=false;
   this.addBtnFlag=true;
  },
  error:(err)=>{
      throw err;
  }
 })
  }
  editUser(item: any) {
    this.employeeId=item.empId;
    const formattedDate = new Date(item.employee_dateofjoin).toISOString().split('T')[0]; 
    console.log(formattedDate);
    
    this.employeeForm.controls['name'].patchValue(item.employee_name);
    this.employeeForm.controls['designation'].patchValue(item.employee_designation);
    this.employeeForm.controls['cabinNo'].patchValue(item.employee_cabinno);
    this.employeeForm.controls['dateOfJoining'].patchValue(formattedDate);
    this.employeeForm.controls['address'].patchValue(item.employee_address);
    this.employeeForm.controls['contactNo'].patchValue(item.employee_contactno);
    this.employeeForm.controls['password'].patchValue(item.employee_password);
    this.employeeForm.controls['confirmPassword'].patchValue(item.employee_confirmpassword);
    this.employeeForm.controls['role'].patchValue(item.employee_role);
    this.employeeForm.controls['access'].patchValue(item.employee_access);
    this.editBtnFlag=true;
    this.addBtnFlag=false;

  console.log(this.employeeForm);
  
  }
  deleteUser(item: any) {
    this._apiService.removeEmployee(item.empId).subscribe({
      next:(res)=>{
       this.getEmployee();
      },
      error:(err)=>{
          throw err;
      }
    })
  }
  updateEmployee(){
    let editedObj={
      employee_name:this.employeeForm.controls['name'].value,
      employee_designation:this.employeeForm.controls['designation'].value,
      employee_cabinno:this.employeeForm.controls['cabinNo'].value,
      employee_dateofjoin:this.employeeForm.controls['dateOfJoining'].value,
      employee_address:this.employeeForm.controls['address'].value,
      employee_contactno:this.employeeForm.controls['contactNo'].value,
      employee_password:this.employeeForm.controls['password'].value,
      employee_confirmpassword:this.employeeForm.controls['confirmPassword'].value,
      employee_role:this.employeeForm.controls['role'].value,
      employee_access:this.employeeForm.controls['access'].value,
    }
    this._apiService.updateEmployee(this.employeeId,editedObj).subscribe({
      next:(res)=>{
        console.log(res);
        this.getEmployee();
      },
      error:(err)=>{
          throw err;
      }
    })
  }
  //* --------------------------  Public methods  --------------------------*//
  get formControls() { return this.employeeForm.controls; }
  //* ------------------------------ Helper Function -----------------------*//
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }
  //! -------------------------------  End  --------------------------------!//

}



