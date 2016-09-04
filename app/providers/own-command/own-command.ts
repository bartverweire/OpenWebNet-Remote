import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var Socket;

/*
  Generated class for the OwnCommand provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OwnCommand {
  socket: any;

  constructor() {

  }

  send(command: string) {
    debugger;

    this.socket = new Socket();
    this.socket.onData = (data) => {
      console.log(this.arrayToString(data));
    }
    this.socket.onError = (error) => {
      console.log(error);
    }
    this.socket.onClose = (hasError) => {
      console.log("socket closed " + (hasError ? "with" : "without") + " error");
    }

    this.socket.open(
      "192.168.0.103",
      20000,
      () => {
        this.socketOpen();
      },
      (error) => {
        this.socketError(error);
      }
    )
  }

  socketOpen() {
    console.log("Socket open");

    let bytes = this.stringToArray("*1*1*31##");
    console.log(bytes);
    this.socket.write(bytes);
  }

  socketError(error: string) {
    console.log("Socket error : " + error);
  }

  arrayToString(data: Uint8Array) {
    var CHUNK_SZ = 0x8000;
    var c = [];
    for (var i=0; i < data.length; i+=CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, data.subarray(i, i+CHUNK_SZ)));
    }
    return c.join("");
  }

  stringToArray(dataString: string) {
    let data = new Uint8Array(dataString.length);
    for (var i = 0; i < data.length; i++) {
      data[i] = dataString.charCodeAt(i);
    }

    return data;
  }
}
