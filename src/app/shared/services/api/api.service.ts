import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
// import { Socket } from 'ngx-socket-io';
// import { io, Socket } from 'socket.io-client';

// import { JwtAuthService } from './jwtauthservice.service';
// import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  customer_id: any;
  country_no: any;
    // private socket!:Socket

  private httpClient: HttpClient;
  empId!:number;
  constructor(
    private http: HttpClient,
    private handler: HttpBackend,
    // private socket:Socket
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
  getAllEmployee(){
    return this.http.get<any>(`${environment.getAllEmployee}`);
  }
  getEmployee(empId:number,roles:string[],currentPage:number, pageSize:number) {
    return this.http.post<any>(`${environment.getEmployee}?empId=${empId}&current_page=${currentPage}&page_size=${pageSize}`,{roles});
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
  getEmployeeRole(){
    return this.http.get<any>(`${environment.getEmployeeRole}`);
  }
  getEmployeeAccess(){
    return this.http.get<any>(`${environment.getEmployeeAccess}`);
  }
  //EMPLOYTEE ATTENDANCE
  getEmployeeAttendance() {
    return this.http.get<any>(`${environment.getEmployeeAttendance}`);



  }
  //TASK ASSSIGN
  // assignTask(formData:FormData){
  // return  this.http.post<any>(`${environment.assignTask}`,formData);
  // }
  getTaskByRole(empId:number,roles: string[],currentPage:number, pageSize:number){
    return this.http.post<any>(`${environment.gettaskByRole}?empId=${empId}&current_page=${currentPage}&page_size=${pageSize}`,{roles})
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
  //EMPLOYEE SEARCH
  searchEmployeeById(empId:number){
    return this.http.get<any>(`${environment.employeeSearchById}?empId=${empId}`);
  }
  //TASK REPORTS
  taskReports(empId:number,taskId:number,status:any){
    console.log(status);
    return this.http.put(`${environment.taskReports}?empId=${empId}&task_id=${taskId}`,status);
  }
  //MESSAGE
  getFile(fileName: string): Observable<any> {
    console.log(fileName,'filname');
    
    return this.http.get(`http://localhost:3000/api/employee-register/getFile?file=${fileName}`, { responseType: 'blob', observe: 'response' });
  }
  uploadFile(formData: FormData){
   return this.http.post<any>(`${environment.uploadFile}`,formData);
  }
  sendMessage(employeeId: number, message: string, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('employeeId', employeeId.toString());
    formData.append('message', message);
    files.forEach(file => {
      formData.append('files', file);
    });

    return this.http.post<any>(`${environment.uploadFile}`, formData);
  }
  postMessage(messageDetails:any){
    return this.http.post<any>(`${environment.postMessage}`,messageDetails);
  }
  getMessage(empId:number): Observable<any>{
    this.empId=empId;
   return this.http.get<any>(`${environment.getMessage}?empId=${empId}`)
  }

  //WEBSOCKET 
  // sendSocketMessage(message:any){
  //   this.socket.emit('sendMessage',message)
  // }
  // getSocketMessage():Observable<any>{
  //   return this.socket.fromEvent<any>('newMessage')
  // }
}
