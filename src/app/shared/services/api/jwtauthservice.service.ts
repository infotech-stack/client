// /*
// https://docs.nestjs.com/providers#services
// */

// export class JwtAuthServiceService {}
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
//     let HTTP_OPTIONS = {
//       headers: new HttpHeaders({
//         Authorization: ('Bearer ' +
//           sessionStorage.getItem('access_token')) as any,
//       }),
//     };

//     return HTTP_OPTIONS;
//   }
//   getToken() {
//     let token: any = sessionStorage.getItem('access_token');

//     return token;
//   }

//   decodeJwtToken() {
//     return this.jwtService.decodeToken(this.getToken());
//   }
//   isLoggedIn(): Boolean {
//     return !!this.getJwtToken();
//   }
// }
