import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';


/*
  Generated class for the OwnCommand provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OwnCommand {
  private host: string;
  private port: number;
  private state: string;
  private handshake: string[] = ["*99*0##"];

  private responseStream: Subject<string>;
  private commandStream: Subject<string>;

  constructor() {

  }

  init(host: string, port: number): Observable<string> {
    // create a new socket
    console.log("Creating socket");

    this.host       = host;
    this.port       = port;
    this.state      = "closed";

    console.log("Socket created");

    this.commandStream  = new Subject<string>();
    this.responseStream = new Subject<string>();

    this.responseStream.subscribe((response) => {
      console.log("ResponseStream - received response " + response);

      console.log("Waiting for command");
    });
    this.commandStream.subscribe((command) => {
      console.log("CommandStream - received command " + command);
    });

    Observable.zip(
      this.responseStream,
      this.commandStream,
      (response, command) => {
        console.log("Zipped - response " + response + ", next command " + command);
        return command;
      }
    )
    .forEach((command) => {
      this.write(command);
    });

    // create a close message every 30 seconds
    Observable.interval(30000)
    .subscribe(() => {
      if (this.state === "open") {
        this.state = "closed";
        this.responseStream.next("close");
      }
    });
    console.log("Observables created");

    return this.responseStream;
  }

  send(command: string): void {
    console.log("Command received ");
    this.open();

    console.log("Send method - adding " + command + " to commandStream");

    this.commandStream.next(command);
  }

  write(commandString: string) {
    console.log("Write method - writing " + commandString);

    Observable.interval(1000)
      .map(() => {
        let message = "Response for " + commandString
        console.log("Write method - adding a fake response to the queue: " + message);
        this.responseStream.next(message);

        return "Command written";
      })
      .take(1)
      .forEach((message) => console.log("Write method - message (" + message + ") consumed"));
  }

  getCommands() {
    return this.commandStream;
  }

  open(): void {
    console.log("Open method");

    if (this.state === "closed") {
      console.log("Connection closed - adding handshake commands");
      this.handshake.forEach((command) => {
        console.log("Open observable - adding handshake command " + command + " to commandStream");
        this.commandStream.next(command);
      });
    }

    //this.state = "open";
    this.responseStream.next("Response to open");
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
