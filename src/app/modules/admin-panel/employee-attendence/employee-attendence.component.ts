import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import * as CryptoJS from 'crypto-js';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
// import * as html2pdf from "html2pdf.js";
@Component({
  selector: 'app-employee-attendence',
  templateUrl: './employee-attendence.component.html',
  styleUrl: './employee-attendence.component.scss'
})
export class EmployeeAttendenceComponent implements OnInit {
  //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
    employeeForm: FormGroup;
    filteredEmployees = [
      {
        name: 'John Doe',
        designation: 'Software Engineer',
        cabinNo: 'A101',
        loginDateTime: '2024-07-10 08:30',
        logoutDateTime: '2024-07-10 17:30',
        contactNo: '123-456-7890',
        address: '123 Main St, City, Country'
      },
      {
        name: 'Jane Smith',
        designation: 'Project Manager',
        cabinNo: 'B202',
        loginDateTime: '2024-07-10 09:00',
        logoutDateTime: '2024-07-10 18:00',
        contactNo: '987-654-3210',
        address: '456 Elm St, City, Country'
      },
      {
        name: 'Alice Johnson',
        designation: 'QA Engineer',
        cabinNo: 'C303',
        loginDateTime: '2024-07-10 08:45',
        logoutDateTime: '2024-07-10 17:45',
        contactNo: '456-789-0123',
        address: '789 Pine St, City, Country'
      }
    ];
    employeeAttendance:any;
    // filteredEmployees:any;
    filteredAttendance: any[] = [];
    @ViewChild('content', { static: false }) content!: ElementRef;
  filteredEmpId: any;
    //* -----------------------  Variable Declaration  -----------------------*//
  
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(private fb: FormBuilder,private _apiService:ApiService) { 
   
      this.filteredEmployees = this.filteredEmployees;
      this.employeeForm = this.fb.group({
        name: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      });
   
    }
    //* -------------------------  Lifecycle Hooks  --------------------------*//
   
    ngOnInit() {
     this.getEmployeeAttendance();
    }
    //* ----------------------------  APIs Methods  --------------------------*//
    getEmployeeAttendance(){
      this._apiService.getEmployeeAttendance().subscribe({
        next: (res) => {
          console.log(res);
          this.employeeAttendance = res.data;
          this.filteredAttendance = [...this.employeeAttendance]
        },
        error: (err) => {
          throw err;
        }
      })
    }
    //* --------------------------  Public methods  --------------------------*//
    get formControls() { return this.employeeForm.controls; }
    applyFilters() {
      // const startDate = this.employeeForm?.get('startDate').value;
      // const endDate = this.employeeForm?.get('endDate').value;
  
      // this.filteredEmployees = this.employees.filter(emp => {
      //   let joinDate = new Date(emp.dateOfJoining);
      //   let start = startDate ? new Date(startDate) : null;
      //   let end = endDate ? new Date(endDate) : null;
  
      //   if (start && end) {
      //     return joinDate >= start && joinDate <= end;
      //   } else if (start) {
      //     return joinDate >= start;
      //   } else if (end) {
      //     return joinDate <= end;
      //   }
      //   return true;
      // });
    }
    //* ------------------------------ Helper Function -----------------------*//
    onSubmit() {
      if (this.employeeForm.valid) {
        const filterCriteria = this.employeeForm.value;

        this.filterEmpIdByName();
        this.filterAttendance(filterCriteria);
      }
    }
   
  filterAttendance(filterCriteria: any) {
    this.filteredAttendance = this.employeeAttendance.filter((employee: { employee_name: string; login_date_time: string; logout_date_time: string; }) => {
      const isNameMatch = !filterCriteria.name || employee.employee_name.toLowerCase().includes(filterCriteria.name.toLowerCase());
      const isStartDateMatch = !filterCriteria.startDate || this.isDateMatch(employee.login_date_time, filterCriteria.startDate);
      const isEndDateMatch = !filterCriteria.endDate || this.isDateMatch(employee.logout_date_time, filterCriteria.endDate);

      return isNameMatch && isStartDateMatch && isEndDateMatch;
    });
  }
 filterEmpIdByName() {
    const name = this.employeeForm.controls['name'].value;
    name.trim().toLowerCase();
    const employee = this.employeeAttendance.find((emp: { employee_name: string; }) => emp.employee_name.toLowerCase() === name);
    if (employee) {
      this.filteredEmpId = employee.empId;
      console.log(this.filteredEmpId,'id');
      
    } else {
      this.filteredEmpId = undefined;
    }
  }
  private isDateMatch(dateTimeString: string, dateFilter: string): boolean {
    if (!dateTimeString) {
      return false;
    }
    const dateTime = new Date(dateTimeString);
    const filterDate = new Date(dateFilter);

    // Compare only dates (ignore time)
    return dateTime.getFullYear() === filterDate.getFullYear() &&
           dateTime.getMonth() === filterDate.getMonth() &&
           dateTime.getDate() === filterDate.getDate();
  }
  private getDocumentDefinition(tableData: any[]): any {
    return {
      content: [
        { text: 'Table Record View', style: 'header' },
        {
          table: {
            headers: ['Name', 'Designation', 'Cabin No', 'Login Date', 'Logout Date'],
            body: this.getTableBody(tableData)
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 10]
        }
      },

   
    };
  }

  private getTableBody(data: any[]) {
    return data.map(item => [
      item.employee_name,
      item.employee_designation,
      item.cabinNo,
      item.login_date_time,
      item.logout_date_time || 'N/A'
    ]);
  }
  viewPDF() {
    window.print();
  }

  generatePDF() {
    const documentDefinition:any = this.getDocumentDefinition(this.filteredAttendance);
    pdfMake.createPdf(documentDefinition).open(); 
  }

  downloadPDF() {
    const documentDefinition:any = this.getDocumentDefinition(this.filteredAttendance);
    pdfMake.createPdf(documentDefinition).download('Employee_Attendance_Report.pdf');
  }

  // exportToPDF(): void {
  //   const opt = {
  //     margin: 1,
  //     filename: 'certificate.pdf',
  //     image: { type: 'jpeg', quality: 0.2 },
  //     html2canvas: { scale: 2, useCORS: true },
  //     jsPDF: { unit: 'cm', format: 'a4', orientation: 'p' },
  //   };

  //   const elementToExport = this.content.nativeElement;
  //   const images = Array.from(elementToExport.querySelectorAll('img'));

  //   const imagePromises = images.map((image: any) => {
  //     return new Promise<void>((resolve) => {
  //       if (image.complete) {
  //         resolve();
  //       } else {
  //         image.onload = resolve;
  //       }
  //     });
  //   });

  //   Promise.all(imagePromises).then(() => {
  //     this.generatePDF1(opt, elementToExport);
  //   });
  // }

  // generatePDF1(opt: any, elementToExport: HTMLElement): void {
  //   html2pdf().set(opt).from(elementToExport).save();
  // }
  public convertToPDF(): void {
    const data: HTMLElement | null = document.getElementById('content');
    if (!data) {
      console.error('Element not found!');
      return;
    }
  
    const margin = 10; // Margin in mm
  
    html2canvas(data).then(canvas => {
      const imgWidth = 208 - 2 * margin; // A4 width in mm minus margins
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;
  
      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      const position = margin; // Start position for y-coordinate with margin
  
      pdf.addImage(contentDataURL, 'PNG', margin, position, imgWidth, imgHeight);
      pdf.save('new-file.pdf'); // Generated PDF
    });
  }
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};
    //! -------------------------------  End  --------------------------------!//
}
