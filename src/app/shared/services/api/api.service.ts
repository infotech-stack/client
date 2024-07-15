import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

// import { JwtAuthService } from './jwtauthservice.service';
// import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  customer_id: any;
  country_no: any;

  private httpClient: HttpClient;

  constructor(
    private http: HttpClient,
    private handler: HttpBackend,
    // private _jwtAuthService: JwtAuthService
  ) {
    this.httpClient = new HttpClient(handler);
  }

  //LOGIN & LOGOUT
  loginmethod(username: string, password: string) {
    return this.http.get<any>(`${environment.login}?employee_name=${username}&employee_password=${password}`);
  }
  logoutMethod(empId: number) {
    return this.http.put<any>(`${environment.logout}?empId=${empId}`, '');
  }
  //EMPLOYEE
  getEmployee() {
    return this.http.get<any>(`${environment.getEmployee}`);
  }
  insertEmployee(registerDetails: any): Observable<any> {
    console.log(registerDetails, 'ser');

    return this.http.post<any>(`${environment.insertEmployee}`, registerDetails);
  }
  updateEmployee(empId: number, employeeDetails: any): Observable<any> {
    return this.http.put<any>(`${environment.updateEmployee}?empId=${empId}`, employeeDetails);
  }
  removeEmployee(empId: number): Observable<any> {
    return this.http.delete<any>(`${environment.removeEmployee}?empId=${empId}`);
  }
  //EMPLOYTEE ATTENDANCE
  getEmployeeAttendance() {
    return this.http.get<any>(`${environment.getEmployeeAttendance}`);



  }
  //TASK ASSSIGN
  // assignTask(formData:FormData){
  // return  this.http.post<any>(`${environment.assignTask}`,formData);
  // }
  getTaskByRole(empId:number,roles: string[]){
    return this.http.post<any>(`${environment.gettaskByRole}?empId=${empId}`,{roles})
  }
  taskAssignToEmployee(employeeData: any) {
    return this.http.post<any>(`${environment.assignTask}`, employeeData);
  }
  updatetask(task_id:number,empId:number,taskDetails:any){
    return this.http.put<any>(`${environment.updatetask}?task_id=${task_id}&empId=${empId}`,taskDetails);

  }
  deleteTask(task_id:number,empId:number){
    return this.http.put<any>(`${environment.deleteTask}?task_id=${task_id}&empId=${empId}`,'');
  }
}
