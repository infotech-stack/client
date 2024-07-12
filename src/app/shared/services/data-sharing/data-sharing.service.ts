import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  constructor() {}

  private Audit_trail = new BehaviorSubject<string | any>(undefined);
  audit_trail_data = this.Audit_trail.asObservable();

  updateAuditTrailData(data: string) {
    this.Audit_trail.next(data);
  }

  private Assigned_category = new BehaviorSubject<any>(undefined);
  assigned_category_data = this.Assigned_category.asObservable();

  updateAssignedCategoryData(data: any) {
    this.Assigned_category.next(data);
  }
  private showTop = new BehaviorSubject<any>(false);
  showTop_data = this.showTop.asObservable();

  update_showTop_data(data: any) {
    this.showTop.next(data);
  }

  private layout = new BehaviorSubject<any>(false);
  layout_data = this.layout.asObservable();

  secondary(data: any) {
    this.layout.next(data);
  }
  private vieworhide = new BehaviorSubject<any>(true);
  vieworhide_data = this.vieworhide.asObservable();

  updatevieworhide(data: any) {
    this.vieworhide.next(data);
  }
  private selected_student = new BehaviorSubject<any>(undefined);
  selected_student_data = this.selected_student.asObservable();

  update_selected_student(data: any) {
    this.selected_student.next(data);
  }

  private academic_year = new BehaviorSubject<any>(undefined);
  academic_year_data = this.academic_year.asObservable();

  update_academic_year(data: any) {
    this.academic_year.next(data);
  }

  private student_image = new BehaviorSubject<any>(undefined);
  student_image_data = this.student_image.asObservable();

  update_student_image(data: any) {
    this.student_image.next(data);
  }
  private customer_and_studentLogo = new BehaviorSubject<any>(undefined);
  customer_and_student_logo_info = this.customer_and_studentLogo.asObservable();

  update_customer_and_student_logo(data: any) {
    this.customer_and_studentLogo.next(data);
  }
  private employee = new BehaviorSubject<any>(undefined);
  getEmployeeDatils = this.employee.asObservable();

  sendEmployeeDetails(data: any) {
    this.employee.next(data);
  }
}
