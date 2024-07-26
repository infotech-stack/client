import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  template: `
    <div class="dropdown-menu show" style="position: absolute; left: {{x}}px; top: {{y}}px;" (mouseleave)="closeMenu()">
      <a class="dropdown-item"  (click)="onEdit()">Edit</a>
      <a class="dropdown-item"  (click)="onDelete()">Delete</a>
      <a class="dropdown-item"  (click)="onDownload()">Download</a>
      <a class="dropdown-item"  (click)="onCopy()">Copy</a>
      <a class="dropdown-item"  (click)="onForward()">Forward</a>
      <a class="dropdown-item"  (click)="onPin()">Pin</a>
    </div>
  `,
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent implements OnInit{
  ngOnInit(): void {
   
  }
  x = 0;
  y = 0;
  message: any;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() download = new EventEmitter<void>();
  @Output() copy = new EventEmitter<void>();
  @Output() forward = new EventEmitter<void>();
  @Output() pin = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  open(event: MouseEvent, message: any) {
    event.preventDefault();
    this.x = event.clientX;
    this.y = event.clientY;
    this.message = message;
  }

  onEdit() {
    this.edit.emit(this.message);
    this.closeMenu();
  }

  onDelete() {
    this.delete.emit(this.message);
    this.closeMenu();
  }

  onDownload() {
    this.download.emit(this.message);
    this.closeMenu();
  }

  onCopy() {
    this.copy.emit(this.message);
    this.closeMenu();
  }

  onForward() {
    this.forward.emit(this.message);
    this.closeMenu();
  }

  onPin() {
    this.pin.emit(this.message);
    this.closeMenu();
  }

  closeMenu() {
    this.close.emit();
  }
}
  // getSocketMessage(){
  //   this._apiService.getSocketMessage().subscribe({
  //     next: (res) => {
  //       this.socketMessage.push(res);
  //     },
  //     error: (err) => {
  //       throw err;
  //     }
  //   })
  // }
  // sendSocketMessage(){
    
  //  const { message}=this.chatForm.controls['chat'].value;
  //   this._apiService.sendSocketMessage(message);
  //   this.chatForm.reset();
  // }
    // this.socket.on('message', (res: any) => {
      //   this.messagelist.push(res);
      //   this.cdr.detectChanges();
      // });
  
      // this.socket.on('typing', (data: any) => {
      //   if (data.isTyping) {
      //     // console.log('User is typing...');
      //    if (data.isTyping) {
      //     this.typingUser='User is typing';
      //    }else{
      //     this.typingUser='';
      //    }
      //   }
      // });
       
      // this.typing();
          // onFileChange(event: Event) {
    //   const fileInput = event.target as HTMLInputElement;
    //   if (fileInput.files && fileInput.files.length > 0) {
    //     this.communicationForm.get('files')?.setValue(fileInput.files);
    //   }
    // }
    // sendMessage() {
    //   if (this.communicationForm.invalid) {
    //     return;
    //   }
  
    //   const formData = new FormData();
    //   formData.append('files', this.communicationForm.get('files')?.value);
  
    //   this._apiService.uploadFile(formData).subscribe(
    //     (response: { filename: any; map: (arg0: (file: any) => any) => any[]; }) => {
    //       if (response && response.filename) {
    //         this.uploadedFileName = response.filename;
    //         console.log(this.uploadedFileName);
            
    //       } else if (response && Array.isArray(response)) {
    //         this.uploadedFileName = response.map(file => file.filename).join(', ');
    //         console.log(this.uploadedFileName);
            
    //       }
    //     },
    //     (error) => {
    //     }
    //   );
    // }
    // join(){
    //   let obj={
    //     name:this.nameForm.controls['name'].value
    //   }
    
    //   this.joinFlag=true;
    //   this.socket.emit('join',obj,()=>{
      
    //     this.nameForm.reset();
    //     this.getMessage();
    //   })
    // }
    // typing(){
    //   this.socket.emit('typing',{isTyping:true});
    //   setTimeout(()=>{
    //     this.socket.emit('typing',{isTyping:false});
    //   },2000)
    // }
     // sendMessage(){
  //   let obj={
  //     text:this.messageForm1.controls['text'].value
  //   }
  //   console.log(obj);
    
  //   this.socket.emit('createMessage',obj,(res:any)=>{
  //     console.log('response');
      
  //     this.messagelist.push(res);
  //     this.getMessage();
  //       this.messageForm1.reset();
  //   });
  // }
    // this.communicationForm = this.fb.group({
    //   recipients: [[], Validators.required], 
    //   message: ['', Validators.required],
    //   files: ['']
    // });
    // this.socket = io('http://localhost:4000');
    // this._socketService.onMessage((message)=>{
    //   console.log(message);

    // })
    // this._socketService.sendMessage({text:'welcome to message component'})
       // const limit = this.pageSize === 'all' ? -1 : Number(this.pageSize);
    // this._apiService.getEmployee(this.empId,this.roles,this.currentPage, this.pageSize).subscribe({
    //   next: (res) => {
    //     this.employees = res.data;
    //     this.totalPages = limit === -1 ? 1 : Math.ceil(res.totalItems / Number(this.pageSize));
    //   },
    //   error: (err) => {
    //     throw err;
    //   }
    // })