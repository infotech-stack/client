import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { DataSharingService } from '../../../shared/services/data-sharing/data-sharing.service';
import { Observable, Subscription } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { io, Socket } from 'socket.io-client'
import { SocketService } from '../../../shared/services/api/socket.service';
import { formatDistanceToNow } from 'date-fns';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {

  //* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//
  @ViewChild('chatWindow') private chatWindow!: ElementRef;
  @ViewChild('latestMessage') private latestMessage!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;
  //* -----------------------  Variable Declaration  -----------------------*//
  sidebarVisible = true;
  newMessage$!: Observable<any>
  socketMessage: any[] = [];
  messageForm: FormGroup;
  chatForm: FormGroup;
  closeFlage: boolean = true;
  selectedFiles!: File[];
  uploadedFileName: string | null = null;
  empId!: number;
  downloadFlag: boolean = false;
  messageList: any;
  roles: any;
  employees: any;
  users = [
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    { id: 3, name: 'User 3' }
  ];
  messages: Array<{
fileUrl: any; sender_id: number, receiver_id: number, message: string, timestamp: Date 
}> = [];
  newMessage: string = '';
  currentUser = this.empId;
  selectedContact!: number;
  imageUrl!: string;
  totalPages: number = 1;
  currentPage = 1;
  pageSize: any = 5;
  sortField = 'employee_name';
  sortOrder = 'ASC';
  search = '';
  typingUser: string = ''
  messagelist: any[] = [];
  messageForm1: FormGroup;
  nameForm: FormGroup;
  selectedMessage: any = null;
  joinFlag: boolean = false;
  messageSubscription!: Subscription;
  public textArea: string = "";
  public isEmojiPickerVisible: boolean | undefined;
  public addEmoji(event: { emoji: { native: any; }; }) {
    this.newMessage += event.emoji.native;
  }
  selectedFile: File | null = null;
  fileType: string = '';
  //* ---------------------------  Constructor  ----------------------------*//
  constructor(private fb: FormBuilder, private _apiService: ApiService, private _dataSharing: DataSharingService, private cdr: ChangeDetectorRef, private _socketService: SocketService) {
  
    this.messageForm = this.fb.group({
      employeeId: ['', Validators.required],
      message: ['', Validators.required],
      files: [[]]
    });
    this.chatForm = this.fb.group({
      chat: ['', Validators.required]
    })
    this.messageForm1 = this.fb.group({
      text: ['', Validators.required]
    });
    this.nameForm = this.fb.group({
      name: ['', Validators.required]
    });
  }
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {


    const encryptedEmployeeFromStorage = sessionStorage.getItem('encryptedEmployee');
    const decryptedEmployee = this.decryptData(encryptedEmployeeFromStorage);
    this.empId = decryptedEmployee.empId;
    this.roles = decryptedEmployee.employee_role;


    this.getEmployee();

    this.messageSubscription = this._socketService.getMessagesObservable().subscribe((message: any) => {
      if (
        (message.sender_id === this.empId && message.receiver_id === this.selectedContact) ||
        (message.sender_id === this.selectedContact && message.receiver_id === this.empId)
      ) {

        this.messages.push(message);
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }
  ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
  //* ----------------------------  APIs Methods  --------------------------*//
  getEmployee() {
 
    const limit = this.pageSize === 'all' ? -1 : Number(this.pageSize);
    this._apiService.getAllEmployee().subscribe({
      next: (res) => {
        this.employees = res.data;
        this.totalPages = limit === -1 ? 1 : Math.ceil(res.totalItems / Number(this.pageSize));
      },
      error: (err) => {
        throw err;
      }
    })
  }
  getFile() {
    const fileName = '';
    this._apiService.getFile(fileName).subscribe((response: Blob) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(response);
    },
      error => {
        console.error('Error loading image:', error);

      }
    );
  }
  downloadPDF(fileName: any) {
    // this._apiService.getFile(fileName).subscribe(
    //   (response: Blob) => {
    //     const url = window.URL.createObjectURL(response);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = fileName;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //   },
    //   error => {
    //     console.error('Error downloading file:', error);
    //   }
    // );
    fileName.forEach((file: string) => {
      this.downloadFile(file);
    });
  }
  onSelectFiles(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
      this.messageForm.patchValue({ files: this.selectedFiles });
    }
  }
  onSubmit() {
    if (this.messageForm.valid) {
      const { employeeId, message, files } = this.messageForm.value;
      this._apiService.sendMessage(employeeId, message, files).subscribe(
        response => {
          console.log('Message sent successfully', response);
          const messageObj = {
            message_description: this.messageForm.controls['message'].value,
            filename: response.data,
            empId: this.messageForm.controls['employeeId'].value,
            send_by: this.empId
          }
          // this.downloadFile(fileName);
          this.postMessage(messageObj);
          // if (response.data && Array.isArray(response.data)) {
          //   response.data.forEach((fileName: string) => {
          //     console.log(fileName, 'name');
          //     const messageObj={
          //       message_description:this.messageForm.controls['message'].value,
          //       filename:response.data,
          //       empId:this.messageForm.controls['employeeId'].value,
          //       send_by:this.empId
          //     }
          //     // this.downloadFile(fileName);
          //     this.postMessage(messageObj);

          //   });
          // }
        },
        error => {
          console.error('Error sending message', error);
        }
      );
    }
  }
  postMessage(messageObj: any) {
    this._apiService.postMessage(messageObj).subscribe({
      next: (res) => {
        console.log(res);
        this.getMessage();
      },
      error: (err) => {
        throw err;
      }
    })
  }
  downloadFile(fileName: string) {
    this._socketService.websocketDownloadFile(fileName).subscribe(response => {
      const contentDisposition = response.headers.get('Content-Disposition');
      const blob = new Blob([response.body], { type: response.body.type });
  
      const objectUrl = window.URL.createObjectURL(blob);
      const fileLink: any = {
        sender_id: this.empId,
        receiver_id: this.selectedContact,
        message: `File: ${this.getFileNameFromContentDisposition(contentDisposition) || fileName}`,
        fileUrl: objectUrl,
        fileName: this.getFileNameFromContentDisposition(contentDisposition) || fileName,
        timestamp: new Date()
      };
  
      this.addFileLinkToMessages(fileLink);
  
      // Optional: Download the file immediately
      // const a = document.createElement('a');
      // a.style.display = 'none';
      // document.body.appendChild(a);
      // a.href = objectUrl;
      // a.download = fileLink.fileName;
      // a.click();
      // window.URL.revokeObjectURL(objectUrl);
    }, error => {
      console.error('Error downloading file', error);
    });
  }
  
  private getFileNameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;
    const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
    return fileNameMatch ? fileNameMatch[1] : null;
  }
  
  private addFileLinkToMessages(fileLink: any) {
    this.messages.push(fileLink);
    this._socketService.sendMessage(fileLink).subscribe(response => {
      console.log('File link sent to opponent', response);
    });
  }

  //* --------------------------  Public methods  --------------------------*//
  get formControls() { return this.messageForm.controls; }
  closeAlert() {
    this.closeFlage = false;
  }
  //* ------------------------------ Helper Function -----------------------*//
  decryptData = (encryptedData: any) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'secret_key');
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };

  getMessage() {
    // this.socket.emit('findAllMessages',{},(res:any)=>{
    //   console.log(res)
    //   this.messagelist=res;
    //   this.cdr.detectChanges();
    // })
  }
  selectContact(contact: any) {
    this.selectedContact = contact.empId;
    this.messages = [];
    console.log(this.empId, this.selectedContact);

    this._socketService.getMessages(this.empId, this.selectedContact).subscribe((response: any) => {
      if (response.statusCode === 200) {
        this.messages = response.data;
        this.scrollToBottom();
      }
    });
  }
  sendMessage() {
    if (this.newMessage.trim() || this.selectedFiles.length > 0) {
      if (this.selectedFiles.length > 0) {
        // If files are selected, handle file upload
        this.uploadFiles().then(fileNames => {
          const message = {
            sender_id: this.empId,
            receiver_id: this.selectedContact,
            // message:'.',
            filename: fileNames,
            timestamp: new Date().toISOString()
          };
          this._socketService.sendMessage(message).subscribe((response: any) => {
            if (response.statusCode === 201) {
              console.log(response.data.message, 'response');
              this.isEmojiPickerVisible = false;
              this.selectedFiles = []; 
              this.scrollToBottom();
             response.data.filename.forEach((item: any)=>{
             this.downloadFile(item);
            // console.log(item);
            
             })
            }
          });
        }).catch(error => {
          console.error('Error uploading files:', error);
        });
      } else if (this.newMessage.trim() && this.selectedContact) {
        // If no files are selected, send text message
        const message = {
          sender_id: this.empId,
          receiver_id: this.selectedContact,
          message: this.newMessage,
          timestamp: new Date().toISOString()
        };
        this._socketService.sendMessage(message).subscribe((response: any) => {
          if (response.statusCode === 201) {
            console.log(response.data.message, 'response');
            this.isEmojiPickerVisible = false;
            this.newMessage = ''; 
            this.scrollToBottom();
          }
        });
      }
    }
  }
  uploadFiles() {
    return new Promise((resolve, reject) => {
      if (this.selectedFiles.length > 0) {
        const formData = new FormData();
        this.selectedFiles.forEach(file => {
          formData.append('files', file);
        });
        formData.append('senderId', String(this.empId));
        formData.append('receiverId',String(this.selectedContact));

        this._socketService.websocketUploadFile(formData).subscribe(
          response => resolve(response.data),
          error => reject(error)
        );
      } else {
        reject('No files selected');
      }
    });
  }
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  formatTimestamp(timestamp: Date): string {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }
  scrollToBottom(): void {
    try {
    
        this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
      
    } catch (err) {
      console.error('Scroll to bottom failed:', err);
    }
  }
  selectFileType(type: string) {
    switch (type) {
      case 'image':
        this.fileType = 'image/*';
        break;
      case 'video':
        this.fileType = 'video/*';
        break;
      case 'audio':
        this.fileType = 'audio/*';
        break;
      case 'document':
        this.fileType = '.pdf, .doc, .docx, .xls, .xlsx'; 
        break;
      case 'contact':
        
        this.fileType = ''; 
        break;
      default:
        this.fileType = '';
        break;
    }
    this.fileInput.nativeElement.click(); 
  }
  //! -------------------------------  End  --------------------------------!//
}
