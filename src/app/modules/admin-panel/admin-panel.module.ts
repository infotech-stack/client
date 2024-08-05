import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPanelRoutingModule } from './admin-panel-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { NgIf,NgFor } from '@angular/common';
import { DashboardSubComponent } from './dashboard-sub/dashboard-sub.component';
import { TaskComponent } from './task/task.component';
import { TaskStatusComponent } from './task-status/task-status.component';
import { AdminPanelSettingsComponent } from './admin-panel/admin-panel-settings.component';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { TaskReportsComponent } from './task-reports/task-reports.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeAttendenceComponent } from './employee-attendence/employee-attendence.component';
import { MessageComponent } from './message/message.component';
import { HttpClientModule } from '@angular/common/http';
import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { LoadingSpinnerComponent } from '../../shared/services/loading-spinner/loadspinner.component';
import { ConfirmDialogComponent } from '../../shared/dialog/confirm-dialog/confirm-dialog.component';
import { TaskDetailsDialogComponent } from '../../shared/dialog/task-details-dialog/task-details-dialog.component';
@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    DashboardSubComponent,
    TaskComponent,
    TaskStatusComponent,
    AdminPanelSettingsComponent,
    SearchEmployeeComponent,
    TaskReportsComponent,
    EmployeeComponent,
    EmployeeAttendenceComponent,
    MessageComponent,
    ContextMenuComponent,
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    TaskDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AdminPanelRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    PickerModule,
    NgIf,
    NgFor,
  ]
})
export class AdminPanelModule { }
