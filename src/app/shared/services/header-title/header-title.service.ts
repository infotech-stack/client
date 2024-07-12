import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderTitleService {
  public title = new BehaviorSubject('WOW Assessment');
  
  constructor() {}
  
  setTitle(title: string) {    
    this.title.next(title);
  }

 
}
