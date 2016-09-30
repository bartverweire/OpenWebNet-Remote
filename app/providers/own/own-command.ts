import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { OwnSocket } from './own-socket';
import { DataProvider } from '../data-provider/data-provider';

declare var Socket;

/*
  Generated class for the OwnCommand provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OwnCommand extends OwnSocket {

  constructor(protected dataProvider: DataProvider) {
    super(dataProvider);

    this.handshake = ["*99*0##"];

    // create an observable to synchronize responses and new commands
    Observable.zip(
      this.responseStream,
      this.commandStream,
      (response, command) => {
        console.log("OwnCommand: Zipped - response " + response + ", next command " + command);
        return command;
      }
    )
    .forEach((command) => {
      this.socket.write(this.stringToArray(command));
    });

    // subscribe to the response stream, and parse the response if it arrives
    this.responseSubscription = this.getResponseStream().subscribe((data) => {
      this.parseResponse(data);
    });

    console.log("OwnCommand: constructed");
  }

  send(command: string): void {
    console.log("OwnCommand: Send - command received ");

    // checking if socket is open or opening
    if (this.socket.state === Socket.State.CLOSED || this.socket.state === Socket.State.CLOSING) {
      console.log("OwnCommand: Socket closed - adding handshake commands");
      this.handshake.forEach((command) => {
        console.log("OwnCommand: ==> adding handshake command " + command + " to commandStream");
        this.commandStream.next(command);
      });

      this.socket.open(
        this.host,
        this.port,
        () => {
          console.log("OwnCommand: Socket open message received");
          this.responseStream.next("open");
        },
        (error) => {
          console.error("OwnCommand: Socket open error");
          this.responseStream.error("failed to open connection");
        }
      )
    }

    console.log("OwnCommand: Send - adding " + command + " to commandStream");
    this.commandStream.next(command);
  }
}
