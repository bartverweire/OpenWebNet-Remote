import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

declare var Socket;

/*
  Generated class for the OwnMonitor provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OwnMonitor {
  private socket: any;

  private host: string;
  private port: number;
  private handshake: string[] = ["*99*1##"];

  private responseStream: Subject<string>;

  constructor() {}

  init(host: string, port: number) {
    if (this.socket) {
      console.error("Socket already initialized");
      return;
    }

    // create a new socket
    console.log("Creating socket");

    this.socket   = new Socket();
    this.host       = host;
    this.port       = port;

    console.log("Socket created");


    this.responseStream = new Subject<string>();

    this.socket.onData = (data) => {
      let stringData = this.arrayToString(data);
      console.log("Socket response; " + stringData);
      this.responseStream.next(stringData);
    }

    this.socket.onError = (error) => {
      console.log("Socket error: " + error);
      this.responseStream.error(error);
    }

    this.socket.onClose = (hasError) => {
      console.log("Socket closed " + (hasError ? "with" : "without") + " error");
    }


    console.log("Observables created");
  }

  listen(): Observable<any> {
    let commandStream = this.buildCommandStream()
                          .map((command) => {
                            console.log("Writing command " + command.commandString + "(" + command.type + ")");
                            this.socket.write(this.stringToArray(command.commandString));

                            return command;
                          })
                          .delay(200);

    let openStream = this.open()
      .concatMap(() => {
        console.log("Socket opened, continuing with commands");
        // start with command stream, but don't send yet
        return  commandStream
                  .concatMap((command) => {
                    return this.responseStream.startWith("open")
                      .map((response) => {
                        return {
                          type: command.type,
                          commandString: command.commandString,
                          response: response
                        }
                      })
                  })
                  .filter((responseObj: any) => {
                    return true;//responseObj.type !== "handshake";
                  });
      })
      .subscribe((response) => {
        console.log("Monitor initialized");
        openStream.unsubscribe();
      });

      return this.responseStream;
  }

  buildCommandStream(): Observable<any>{
    return Observable.from(this.handshake)
        .map((handshake: string) => ({
          type: "handshake",
          commandString: handshake
        }));
  }

  open(): Observable<any> {
    return Observable.create((observer) => {
      if (this.socket.state === Socket.State.OPENED || this.socket.state === Socket.State.OPENING) {
        console.log("Socket already open");
        observer.next("open");
        return;
      }

      if (this.socket.state === Socket.State.CLOSED || this.socket.state === Socket.State.CLOSING) {
        console.log("Socket closed. Now opening");
        this.socket.open(
          this.host,
          this.port,
          () => {
            console.log("Socket open message received");
            observer.next("open");
          },
          (error) => {
            console.error("Socket open error");
            observer.error("failed to open connection");
          }
        )
      } else {
        observer.next("open");
      }
    })
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
