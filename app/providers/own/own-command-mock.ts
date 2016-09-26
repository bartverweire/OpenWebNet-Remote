import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { OwnSocket } from './own-socket-mock';


/*
  Generated class for the OwnCommand provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OwnCommand extends OwnSocket {

  constructor() {
    super();

    this.handshake = ["*99*0##"];
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
  }

  send(command: string): void {
    console.log("Command received ");

    if (this.state === "closed") {
      console.log("Connection closed - adding handshake commands");
      this.handshake.forEach((command) => {
        console.log("Open observable - adding handshake command " + command + " to commandStream");
        this.commandStream.next(command);
      });

      this.state = "open";
      this.responseStream.next("Response to open");
    }

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
}
