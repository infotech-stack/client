import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ApiService } from '../../../shared/services/api/api.service';
import * as CryptoJS from 'crypto-js';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('sidenav') sidenav!: MatSidenav;
  menuButtonFlag = false;
  //* -----------------------  Variable Declaration  -----------------------*//
  list = [
    {
      label: 'Dashboard',
      link: 'dashboard-sub',
      value: 0,
      icon: 'dashboard',
      subItems: [
        { label: 'Submenu Item 1', link: 'submenu-item-1' },
        { label: 'Submenu Item 2', link: 'submenu-item-2' }
      ]
    },
    {
      label: 'Message',
      link: 'message',
      value: 1,
      icon: 'message',
      subItems: [
        { label: 'Submenu Item 3', link: 'submenu-item-3' },
        { label: 'Submenu Item 4', link: 'submenu-item-4' }
      ]
    },
    {
      label: 'Employee',
      link: 'employee',
      value: 1,
      icon: 'person',
      subItems: [
        { label: 'Submenu Item 5', link: 'submenu-item-5' },
        { label: 'Submenu Item 6', link: 'submenu-item-6' }
      ]
    },
    {
      label: 'Task',
      link: 'task',
      value: 1,
      icon: 'assignment',
      subItems: [
        { label: 'Submenu Item 7', link: 'submenu-item-7' },
        { label: 'Submenu Item 8', link: 'submenu-item-8' }
      ]
    },
    {
      label: 'Task Status',
      link: 'task-status',
      value: 1,
      icon: 'playlist_add_check',
      subItems: [
        { label: 'Submenu Item 9', link: 'submenu-item-9' },
        { label: 'Submenu Item 10', link: 'submenu-item-10' }
      ]
    },

    {
      label: 'Search Employee',
      link: 'search-employee',
      value: 1,
      icon: 'search',
      subItems: [
        { label: 'Submenu Item 13', link: 'submenu-item-13' },
        { label: 'Submenu Item 14', link: 'submenu-item-14' }
      ]
    },
    {
      label: 'Task Reports',
      link: 'task-report',
      value: 1,
      icon: 'assignment_turned_in',
      subItems: [
        { label: 'Submenu Item 15', link: 'submenu-item-15' },
        { label: 'Submenu Item 16', link: 'submenu-item-16' }
      ]
    },
    {
      label: 'Employee Attendance',
      link: 'attendance',
      value: 1,
      icon: 'event_available',
      subItems: [
        { label: 'Submenu Item 15', link: 'submenu-item-15' },
        { label: 'Submenu Item 16', link: 'submenu-item-16' }
      ]
    },
    {
      label: 'Admin Panel Settings',
      link: 'settings',
      value: 1,
      icon: 'settings',
      subItems: [
        { label: 'Submenu Item 11', link: 'submenu-item-11' },
        { label: 'Submenu Item 12', link: 'submenu-item-12' }
      ]
    },
  ];
  readonly VAPID_PUBLIC_KEY = 'BGwdw00ND8PykBD4bvVa5GeNtC3UfHQ9aDINzR92-hRd6XT3xhyvejA6B4K1zma9txXF_HeAuZBepWAfEBpoghI';
  isSidebarOpen = false;
  mobileQuery: MediaQueryList;
  filterAccess: any;
  username!: string;
  userRole: string = '';
  employeeId!: number;
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(media: MediaMatcher, private _cdRef: ChangeDetectorRef, private swPush: SwPush, private http: HttpClient, private _apiService: ApiService,private _router:Router) {
    this.mobileQuery = media.matchMedia('(max-width: 800px)');
    this._mobileQueryListener = () => _cdRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }
  subscribeToNotifications() {
    this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    })
      .then(subscription => {

        this.http.post('http://localhost:4000/notifications/subscribe', subscription).subscribe(
          response => {
    
            this.sendNotification();
          },
          error => {
            console.error('Error subscribing:', error);
          }
        );
      })
      .catch(err => {
        console.error('Could not subscribe to notifications', err);
      });
  }
  sendNotification() {
    this.http.get('http://localhost:4000/notifications/send').subscribe(
      response => {
   
      },
      error => {
        console.error('Error sending notification:', error);
      }
    );
  }

  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');

    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
 
    this.username = decryptedEmployee?.employee_name;
    this.employeeId = decryptedEmployee?.empId;
    this.userRole = decryptedEmployee?.employee_role?.join(', ');
    this.filterAccess = this.list.filter(item => decryptedEmployee?.employee_access.includes(item.label));
    if (!decryptedEmployee?.employee_role.includes('Admin')) {
      this.filterAccess.push(this.list.find(item => item.label === 'Task Reports'));
    }
 
  }

  ngOnDestroy(): void {
    this._apiService.logoutMethod(this.employeeId).subscribe({
      next: (res) => {
       

      },
      error: (err) => {
        throw err;
      }
    })
  }
  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  sideOnclickClose() {
    if (this.sidenav.mode == 'side') {
      this.sidenav.open();

    } else {
      this.sidenav.close();

    }
  }
  _mobileQueryListener: (() => void);
  toggleSidenav() {
    this.sidenav.toggle();
  }
  //* ------------------------------ Helper Function -----------------------*//
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
logout(){
  sessionStorage.clear();
  this._router.navigate(['/login']);
}

  //! -------------------------------  End  --------------------------------!//
}
