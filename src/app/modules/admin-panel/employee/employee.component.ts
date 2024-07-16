import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';

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
  empId!:number;
  role:any;
  editBtnFlag:boolean=false;
  addBtnFlag:boolean=true;
  employeeId!:number;
  EmployeeAccess: string[] = ['Dashboard', 'Message', 'Employee', 'Task', 'Task Status', 'Pages', 'Search Employee', 'Task Reports','Employee Attendance'];
  
  EmployeeRole: string[] = ['Admin', 'Team Leader', 'Senior Developer', 'Junior Developer', 'Customer Support', 'Digital Marketing'];
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder,private _apiService:ApiService,private _dataSharing:DataSharingService) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileno: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
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
      confirmPassword: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }
 
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {

    this._dataSharing.getEmployeeDatils.subscribe({
      next: (data) => {
        this.empId=data.empId;
        this.role=data.employee_role;
        this.getEmployee();
      },
      error: (err) => {
        throw err;
      }
    })
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  insertEmployee(){
  let registerObj={
    employee_name:this.employeeForm.controls['name'].value,
    employee_designation:this.employeeForm.controls['designation'].value,
    employee_cabinno:this.employeeForm.controls['cabinno'].value,
    employee_dateofjoin:this.employeeForm.controls['dateofjoin'].value,
    employee_address:this.employeeForm.controls['address'].value,
    employee_contactno:this.employeeForm.controls['mobileno'].value,
    employee_password:this.employeeForm.controls['password'].value,
    employee_confirmpassword:this.employeeForm.controls['confirmPassword'].value,
    employee_role:this.employeeForm.controls['role'].value,
    employee_access:this.employeeForm.controls['access'].value,
    employee_email:this.employeeForm.controls['email'].value,
    employee_date_of_birth:this.employeeForm.controls['dateofbirth'].value,
    employee_religion:this.employeeForm.controls['religion'].value,
    employee_education:this.employeeForm.controls['education'].value,
    employee_experience:this.employeeForm.controls['experience'].value,

  }
    console.log(registerObj,'obj');
    
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
    console.log(this.empId,this.role);
    
 this._apiService.getEmployee(this.empId,this.role).subscribe({
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
      experience: item.employee_experience
    });
  
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
      employee_cabinno:this.employeeForm.controls['cabinno'].value,
      employee_dateofjoin:this.employeeForm.controls['dateofjoin'].value,
      employee_address:this.employeeForm.controls['address'].value,
      employee_contactno:this.employeeForm.controls['mobileno'].value,
      employee_password:this.employeeForm.controls['password'].value,
      employee_confirmpassword:this.employeeForm.controls['confirmPassword'].value,
      employee_role:this.employeeForm.controls['role'].value,
      employee_access:this.employeeForm.controls['access'].value,
      employee_email:this.employeeForm.controls['email'].value,
      employee_date_of_birth:this.employeeForm.controls['dateofbirth'].value,
      employee_religion:this.employeeForm.controls['religion'].value,
      employee_education:this.employeeForm.controls['education'].value,
      employee_experience:this.employeeForm.controls['experience'].value,
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
  checkPasswords(group: FormGroup) { 
    let pass = group.controls['password'].value;
    let confirmPass = group.controls['confirmPassword'].value;
    return pass === confirmPass ? null : { notSame: true };
  }
  //* ------------------------------ Helper Function -----------------------*//
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }
  //! -------------------------------  End  --------------------------------!//

}



