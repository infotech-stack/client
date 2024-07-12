// import { Injectable } from '@angular/core';
// import * as CryptoJS from 'crypto-js';
// import { DateTime } from 'luxon';
// import { JwtAuthService } from '../api/jwtauthservice.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class HashDataService {
//   constructor(private _jwtAuthService: JwtAuthService) {}
//   secretKey = 'U2FsdGVkX19xlmOVibIG/7Z0iODXm6xymVH2wTSqI7s=';

//   async onEncrypt(cloud_file_id_with_extension: string): Promise<String> {
//     try {
//       let customer_id = this._jwtAuthService.decodeJwtToken().user.customer_id;
//       let country_code =
//         this._jwtAuthService.decodeJwtToken().user.country_code;

//       const payload: string = `${country_code},${customer_id},${cloud_file_id_with_extension}`;

//       let encodedString = CryptoJS.enc.Base64.stringify(
//         CryptoJS.enc.Utf8.parse(JSON.stringify(payload))
//       );

//       return encodedString;
//     } catch (error) {
//       throw error;
//     }
//   }

//   async onDecrypt(hash: string) {
//     try {
//       let decodedString = CryptoJS.enc.Base64.parse(hash).toString(
//         CryptoJS.enc.Utf8
//       );
//       return decodedString;
//     } catch (error) {
//       throw error;
//     }
//   }

//   getDateTime(timeZoneIanaString: string) {
//     return DateTime.local({
//       zone: timeZoneIanaString,
//     }).toFormat('yyyy-MM-dd TT');
//   }
// }
