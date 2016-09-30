import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { DataProvider } from '../data-provider/data-provider';
import { OwnResponse } from '../../models/model';

declare var Socket;

@Injectable()
export class OwnSocket {
  protected socket: any;

  protected host: string;
  protected port: number;

  protected handshake: string[];
  protected commandStream: Subject<string>;
  protected responseStream: Subject<string>;

  constructor(protected dataProvider: DataProvider) {
    this.socket   = new Socket();

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
      //this.responseStream.error(error);
    }

    this.socket.onClose = (hasError) => {
      console.log("Socket closed " + (hasError ? "with" : "without") + " error");
      this.onClose();
    }

    // create logging subscribers
    this.responseStream.subscribe((response) => {
      console.log("ResponseStream - received response " + response);

      console.log("Waiting for command");
    });
    this.commandStream.subscribe((command) => {
      console.log("CommandStream - received command " + command);
    });
  }

  init(host: string, port: number) {
    if (this.host && this.port > 0) {
      console.error("Socket already initialized");
    }

    this.host       = host;
    this.port       = port;
  }

  onClose() {

  }

  listen(): Observable<string> {
    console.log("ResponseStream - " + this.responseStream.observers.length);
    return this.responseStream.map((resp: string): string => {
      return resp;
    });
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
