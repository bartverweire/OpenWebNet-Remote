import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject, Subscription } from 'rxjs';
import { DataProvider } from '../data-provider/data-provider';
import { OwnComponent, OwnResponse } from '../../models/model';


declare var Socket;

@Injectable()
export class OwnSocket {
  protected socket: any;

  protected host: string;
  protected port: number;

  protected handshake: string[];
  protected commandStream: Subject<string>;
  protected responseStream: Subject<string>;
  protected responseSubscription: Subscription;

  constructor(protected dataProvider: DataProvider) {
    this.socket   = new Socket();

    this.commandStream  = new Subject<string>();
    this.responseStream = new Subject<string>();

    // associate responseStream with socket callback functions
    this.socket.onData = (data) => {
      let stringData = this.arrayToString(data);
      console.log("OwnSocket: Socket response; " + stringData);
      this.responseStream.next(stringData);
    }

    this.socket.onError = (error) => {
      console.log("OwnSocket: Socket error: " + error);
      //this.responseStream.error(error);
    }

    this.socket.onClose = (hasError) => {
      console.log("OwnSocket: Socket closed " + (hasError ? "with" : "without") + " error");
      this.onClose();
    }

    // create logging subscribers
    this.responseStream.subscribe((response) => {
      console.log("OwnSocket: ResponseStream - received response " + response);

      console.log("OwnSocket: Waiting for command");
    });
    this.commandStream.subscribe((command) => {
      console.log("OwnSocket: CommandStream - received command " + command);
    });
  }

  init(host: string, port: number) {
    if (this.host && this.port > 0) {
      console.error("OwnSocket: Socket already initialized");
    }

    this.host       = host;
    this.port       = port;
  }

  onClose() {

  }

  getResponseStream(): Observable<string> {
    console.log("OwnSocket: currently " + ((this.responseStream && this.responseStream.observers.length) || 0) + " subscribers to responseStream");
    return Observable.from(this.responseStream);
  }

  parseResponse(data) {
    console.log("OwnSocket: Discovery - parsing response " + data);
    data.split("##").forEach((resp) => {
      let ownResponse = OwnResponse.parseResponse(resp);
      if (!ownResponse) return;

      let component = this.dataProvider.getComponent(ownResponse.where);

      if (!component) {
        component = OwnComponent.create(ownResponse.who, ownResponse.where);
        this.dataProvider.saveComponent(component, null);
      }

      component.status = ownResponse.what;

      this.dataProvider.refresh();
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
