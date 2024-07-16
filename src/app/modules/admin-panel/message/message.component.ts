import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../shared/services/api/api.service';
import { response } from 'express';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
 
  //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
  
    //* -----------------------  Variable Declaration  -----------------------*//
    communicationForm: FormGroup;
    users= [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' }
    ];
    imageUrl!: string;
    //* ---------------------------  Constructor  ----------------------------*//
    constructor(private fb: FormBuilder ,private _apiService:ApiService) {
      this.communicationForm = this.fb.group({
        recipients: [[], Validators.required], // Use an array if multiple recipients are allowed
        message: ['', Validators.required],
        attachment: ['']
      });
    }
    //* -------------------------  Lifecycle Hooks  --------------------------*//
    ngOnInit(): void {
      this.getFile();
    }
  
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
    getFile(){
      const fileName='';
      this._apiService.getFile(fileName).subscribe( (response: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imageUrl = reader.result as string;
        };
        reader.readAsDataURL(response);
      },
      error => {
        console.error('Error loading image:', error);
        // Handle error, e.g., show an error message
      }
    );
    }
    //* --------------------------  Public methods  --------------------------*//
    get formControls() { return this.communicationForm.controls; }
    //* ------------------------------ Helper Function -----------------------*//
  
    //! -------------------------------  End  --------------------------------!//
}
