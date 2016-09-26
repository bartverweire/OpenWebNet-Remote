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
export class ownMonitor extends OwnSocket {

  constructor() {
    super();

    this.handshake = ["*99*1##"];

    // create a close message every 30 seconds
    Observable.interval(5000)
    .subscribe(() => {
      console.log("interval");
    });
    console.log("Observables created");
  }

  start() {
    console.log("Send - command received ");

    // checking if socket is open or opening
    if (this.state === "closed") {
      console.log("Socket closed - adding handshake commands");
      this.handshake.forEach((command) => {
        console.log("==> adding handshake command " + command + " to commandStream");
        this.commandStream.next(command);
      });

      this.state = "open";
    }
  }
}
