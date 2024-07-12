import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CanActivateService {
  getToken:any;
  decodedToken:any;
  constructor() { }

  configureView(){
    this.getToken = sessionStorage.getItem('access_token');
    const tokenPayload = this.getToken.split('.')[1];
    this.decodedToken = JSON.parse(atob(tokenPayload));
    let user_category_type = this.decodedToken.user?.user_category_type;
    let user_category_type_array: any[] = user_category_type.split(',');
    user_category_type = user_category_type_array.find((element) => {
    return element == 4 || element == 0
    });
    const val = user_category_type;
     if (val == 4 || val == 0) {
      
     return true;
    } else {
      // 
      return false;
    }
  }
}
