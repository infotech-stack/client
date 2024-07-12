import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
  
    //* -----------------------  Variable Declaration  -----------------------*//
    communicationForm: FormGroup;
    users= [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' }
    ];
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(private fb: FormBuilder) {
      this.communicationForm = this.fb.group({
        recipients: [[], Validators.required], // Use an array if multiple recipients are allowed
        message: ['', Validators.required],
        attachment: ['']
      });
    }
    //* -------------------------  Lifecycle Hooks  --------------------------*//
   
  
    //* ----------------------------  APIs Methods  --------------------------*//
    sendMessage() {
      if (this.communicationForm.valid) {
        // Process form data (send message, handle attachments, etc.)
        console.log(this.communicationForm.value);
        this.communicationForm.reset();
      } else {
        this.communicationForm.markAllAsTouched();
      }
    }
    //* --------------------------  Public methods  --------------------------*//
    get formControls() { return this.communicationForm.controls; }
    //* ------------------------------ Helper Function -----------------------*//
  
    //! -------------------------------  End  --------------------------------!//
}
