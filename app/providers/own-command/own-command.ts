import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

declare var Socket;

/*
  Generated class for the OwnCommand provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OwnCommand {
  private socket: any;
  private host: string;
  private port: number;
  private dataObservable: Subject<string>;

  constructor() {}

  init(host: string, port): Subject<string> {
    this.host = host;
    this.port = port;

    this.dataObservable = Subject.create();

    return this.dataObservable;
  }

  open(): Observable<string> {
    let statusObservable = Observable.create((observer) => {
      if (this.socket == null) {
        this.createSocket();
      }

      if (this.socket.state == Socket.State.CLOSED) {
        this.socket.open(
          this.host,
          this.port,
          () => {
            observer.next("open");
          },
          (error) => {
            observer.error("failed to open connection");
          }
        )
      } else {
        observer.next("open");
      }
    })

    return statusObservable;
  }

  createSocket() {
    this.socket = new Socket();
    this.socket.onData = (data) => {
      let stringData = this.arrayToString(data);
      console.log(stringData);
      this.dataObservable.next(stringData);
    }
    this.socket.onError = (error) => {
      console.log(error);
      this.dataObservable.error(error);
    }
    this.socket.onClose = (hasError) => {
      console.log("socket closed " + (hasError ? "with" : "without") + " error");
    }
  }

  send(command: string) {
    this.open().subscribe({
      next: (status) => {
        let bytes = this.stringToArray(command);
        this.socket.write(bytes);
      }
    })
  }
/*
  send(command: string) {
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
*/
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
