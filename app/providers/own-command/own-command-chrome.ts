import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var chrome;

/*
  Generated class for the OwnCommand provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OwnCommand {
  socketId: number;
  respCount: number;
  command: string;
  commandBytes: Uint8Array;
  buffer: ArrayBuffer;

  constructor() {

  }

  send(command: string) {
    debugger;

    this.command = command;
    this.buffer = new ArrayBuffer(command.length);
    this.commandBytes = new Uint8Array(this.buffer);
    for (var i=0; i < command.length; i++) {
      this.commandBytes[i] = command.charCodeAt(i);
    }

    chrome.sockets.tcp.create({}, function(createInfo) {
      console.log(JSON.stringify(createInfo));
      //this.socketCreated();
    });
  }

  socketCreated() {
    chrome.sockets.tcp.connect(this.socketId, "192.168.0.11", 80, (res) => {
      this.socketConnected(res);
    })
  }

  socketConnected(result) {
    chrome.sockets.tcp.send(this.socketId, this.buffer, (sendInfo) => {
      this.dataSent(sendInfo);
    })
  }

  dataSent(sendInfo) {
    console.log(JSON.stringify(sendInfo));
  }
}
