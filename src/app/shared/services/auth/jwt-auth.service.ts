// import { HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { JwtHelperService } from '@auth0/angular-jwt';

// @Injectable({
//   providedIn: 'root',
// })
// export class JwtAuthService {
//   return!: string;

//   constructor(
//     private route: ActivatedRoute,
//     private jwtService: JwtHelperService
//   ) {
//     this.route.queryParams.subscribe(
//       (params) => (this.return = params['return'] || '/')
//     );
//   }

//   getJwtToken() {
//     let token: any = localStorage.getItem('access_token');
//     let HTTP_OPTIONS = {
//       headers: new HttpHeaders({
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: token,
//       }),
//     };
//     return HTTP_OPTIONS;
//   }

//   decodeJwtToken(jwt_token: string) {
//     return this.jwtService.decodeToken(jwt_token);
//   }

//   isLoggedIn(): Boolean {
//     return !!this.getJwtToken();
//   }
// }
