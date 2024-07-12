import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardSubComponent } from './dashboard-sub/dashboard-sub.component';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { EmployeeComponent } from './employee/employee.component';
import { TaskComponent } from './task/task.component';
import { TaskStatusComponent } from './task-status/task-status.component';
import { PagesComponent } from './pages/pages.component';
import { TaskReportsComponent } from './task-reports/task-reports.component';
import { EmployeeAttendenceComponent } from './employee-attendence/employee-attendence.component';
import { MessageComponent } from './message/message.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {path:'login',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent,children:[
    {path:'',redirectTo:'dashboard-sub',pathMatch:'full'},
    {path:'dashboard-sub',component:DashboardSubComponent},
    {path:'attendance',component:EmployeeAttendenceComponent},
    {path:'search-employee',component:SearchEmployeeComponent},
    {path:'employee',component:EmployeeComponent},
    {path:'task',component:TaskComponent},
    {path:'task-status',component:TaskStatusComponent},
    {path:'pages',component:PagesComponent},
    {path:'task-report',component:TaskReportsComponent},
    {path:'message',component:MessageComponent},
    
  ]}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
