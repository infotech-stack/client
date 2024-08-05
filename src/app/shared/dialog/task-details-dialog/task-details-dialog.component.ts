import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-details-dialog',
  templateUrl: './task-details-dialog.component.html',
  styleUrl: './task-details-dialog.component.scss'
})
export class TaskDetailsDialogComponent implements OnInit{
//* --------------------------  Start  -----------------------------------*//

  //* -----------------------  Decorated Methods  --------------------------*//

  //* -----------------------  Variable Declaration  -----------------------*//

  //* ---------------------------  Constructor  ----------------------------*//
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private dialogRef:MatDialogRef<TaskDetailsDialogComponent>) {}
  //* -------------------------  Lifecycle Hooks  --------------------------*//
  ngOnInit(): void {
    
  }
  //* ----------------------------  APIs Methods  --------------------------*//

  //* --------------------------  Public methods  --------------------------*//
  onNoClick(){
    this.dialogRef.close();
  }
  //* ------------------------------ Helper Function -----------------------*//

  //! -------------------------------  End  --------------------------------!//
 

}
