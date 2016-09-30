import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { OwnSocket } from './own-socket';
import { DataProvider } from '../data-provider/data-provider';

declare var Socket;

/*
  Generated class for the OwnMonitor provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OwnMonitor extends OwnSocket {
  monitoring: boolean = false;

  constructor(protected dataProvider: DataProvider) {
    super(dataProvider);

    this.handshake = ["*99*1##"];
  }

  start() {
    this.monitoring = true;

    console.log("OwnMonitor: Send - command received ");

    // checking if socket is open or opening
    if (this.socket.state === Socket.State.CLOSED || this.socket.state === Socket.State.CLOSING) {

      this.socket.open(
        this.host,
        this.port,
        () => {
          console.log("OwnMonitor: open message received");

          this.handshake.forEach((command) => {
            console.log("OwnMonitor: ==> adding handshake command " + command + " to commandStream");
            this.socket.write(this.stringToArray(command));
          });
        },
        (error) => {
          console.error("OwnMonitor: open error");
          this.responseStream.error("failed to open connection");
        }
      )
    }

    console.log("OwnMonitor: start listening to response stream ");

    this.responseSubscription = this.getResponseStream().subscribe((data) => {
      this.parseResponse(data);
    });
  }

  stop() {
    this.responseSubscription && !this.responseSubscription.isUnsubscribed && this.responseSubscription.unsubscribe();

    this.monitoring = false;
  }

  onClose() {
    if (this.monitoring) {
      this.start();
    }
  }
}
