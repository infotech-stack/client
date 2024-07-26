import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, interval, Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";
import { environment } from "../../../../environments/environment.development";
@Injectable({
    providedIn:'root'
})
export class SocketService{
 

//   constructor() {
//     this.socket = io('http://localhost:4000/'); 
//   }

//   sendMessage(message: any): void {
//     this.socket.emit('message', message);
//   }

//   onMessage(callback: (message: any) => void): void {
//     this.socket.on('message', callback);
//   }
private socket: Socket;
constructor(private http: HttpClient) {
    this.socket = io('http://localhost:4000'); // WebSocket connection
  }

  sendMessage(message: any): Observable<any> {
    this.socket.emit('message', message);
    return this.http.post(`${environment.postWebSocketMesage}`, message);
  }

  getMessages(sender_id: number, receiver_id: number): Observable<any> {
    return this.http.get(`${environment.getWebSocketMesage}?sender_id=${sender_id}&receiver_id=${receiver_id}`);
  }

  getMessagesObservable(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (message: any) => {
        observer.next(message);
      });

      // Handle disconnection
      return () => this.socket.disconnect();
    });
  }
  websocketUploadFile(formData:any){
    return this.http.post<any>(`${environment.websocketUploadFile}`,formData);
  }
  websocketDownloadFile(filename:any){
    console.log(filename,'sdfsdfsf');
    
    return this.http.get<any>(`${environment.websocketDownloadFile}?filename=${filename}`,{
      responseType: 'blob' as 'json',
      observe: 'response'
    });
  }
}