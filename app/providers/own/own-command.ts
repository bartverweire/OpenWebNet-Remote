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
  private handshake: string[] = ["*99*0##"];

  private commandStream: Subject<string>;
  private responseStream: Subject<string>;

  constructor() {
    this.socket = new Socket();

    this.commandStream  = new Subject<string>();
    this.responseStream = new Subject<string>();

    // associate responseStream with socket callback functions
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

    // create logging subscribers
    this.responseStream.subscribe((response) => {
      console.log("ResponseStream - received response " + response);

      console.log("Waiting for command");
    });
    this.commandStream.subscribe((command) => {
      console.log("CommandStream - received command " + command);
    });

    // create an observable to synchronize responses and new commands
    Observable.zip(
      this.responseStream,
      this.commandStream,
      (response, command) => {
        console.log("Zipped - response " + response + ", next command " + command);
        return command;
      }
    )
    .forEach((command) => {
      this.socket.write(this.stringToArray(command));
    });

    console.log("Observables created");
  }

  init(host: string, port: number) {
    if (this.host && this.port > 0) {
      console.error("Socket already initialized");
    }

    this.host       = host;
    this.port       = port;

    return this.responseStream;
  }

  send(command: string): void {
    console.log("Send - command received ");

    // checking if socket is open or opening
    if (this.socket.state === Socket.State.CLOSED || this.socket.state === Socket.State.CLOSING) {
      console.log("Socket closed - adding handshake commands");
      this.handshake.forEach((command) => {
        console.log("==> adding handshake command " + command + " to commandStream");
        this.commandStream.next(command);
      });

      this.socket.open(
        this.host,
        this.port,
        () => {
          console.log("Socket open message received");
          this.responseStream.next("open");
        },
        (error) => {
          console.error("Socket open error");
          this.responseStream.error("failed to open connection");
        }
      )
    }

    console.log("Send - adding " + command + " to commandStream");
    this.commandStream.next(command);
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
