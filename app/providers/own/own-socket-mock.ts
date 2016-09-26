import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

@Injectable()
export class OwnSocket {
  protected socket: any;

  protected host: string;
  protected port: number;
  protected state: string;

  protected handshake: string[];
  protected commandStream: Subject<string>;
  protected responseStream: Subject<string>;

  constructor() {

    this.commandStream  = new Subject<string>();
    this.responseStream = new Subject<string>();

    // create logging subscribers
    this.responseStream.subscribe((response) => {
      console.log("ResponseStream - received response " + response);

      console.log("Waiting for command");
    });
    this.commandStream.subscribe((command) => {
      console.log("CommandStream - received command " + command);
    });
  }

  init(host: string, port: number): Observable<string> {
    // create a new socket
    console.log("Creating socket");

    this.host       = host;
    this.port       = port;
    this.state      = "closed";

    console.log("Socket created");

    return this.responseStream;
  }
}
