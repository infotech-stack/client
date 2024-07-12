import { Component, OnInit } from '@angular/core';

interface Task {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

@Component({
  selector: 'app-task-status',
  templateUrl: './task-status.component.html',
  styleUrl: './task-status.component.scss'
})
export class TaskStatusComponent implements OnInit {
 
  //* --------------------------  Start  -----------------------------------*//
  
    //* -----------------------  Decorated Methods  --------------------------*//
    tasks: Task[] = [
      { id: 1, name: 'Task 1', startDate: new Date('2023-07-01'), endDate: new Date('2023-07-10'), status: 'done' },
      { id: 2, name: 'Task 2', startDate: new Date('2023-07-05'), endDate: new Date('2023-07-15'), status: 'on progress' },
      { id: 3, name: 'Task 3', startDate: new Date('2023-07-07'), endDate: new Date('2023-07-20'), status: 'not started' }
    ];
    //* -----------------------  Variable Declaration  -----------------------*//
    //* ---------------------------  Constructor  ----------------------------*//
    constructor() {}
    //* -------------------------  Lifecycle Hooks  --------------------------*//
    ngOnInit(): void {

    }
    //* ----------------------------  APIs Methods  --------------------------*//
    getStatusText(status: string): string {
      switch (status) {
        case 'done':
          return 'Done';
        case 'on progress':
          return 'On Progress';
        case 'not started':
          return 'Not Started';
        default:
          return 'Unknown';
      }
    }
    editTask(task: Task): void {
      console.log('Edit task', task);
    }
    deleteTask(taskId: number): void {
      this.tasks = this.tasks.filter(task => task.id !== taskId);
      console.log('Delete task', taskId);
    }
    //* --------------------------  Public methods  --------------------------*//
    
    //* ------------------------------ Helper Function -----------------------*//
  
    //! -------------------------------  End  --------------------------------!//
}
