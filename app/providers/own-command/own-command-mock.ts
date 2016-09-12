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

  constructor() {}

  init(host: string, port: number): Observable<string> {
    // create a new socket
    console.log("Creating socket");

    this.host       = host;
    this.port       = port;
    this.state      = "closed";

    console.log("Socket created");

    this.responseStream = new Subject<string>();
    Observable.interval(30000)
    .subscribe(() => {
      this.state = "closed";
    });
    console.log("Observables created");

    return this.responseStream;
  }

  send(command: string): Observable<any> {
    let commandStream = this.buildCommandStream(command)
                          .map((command) => {
                            console.log("Writing command " + command.commandString + "(" + command.type + ")");
                            this.write(command.commandString);

                            return command;
                          })
                          .delay(200);

    return this.open()
      .concatMap(() => {
        console.log("Socket opened, continuing with commands");
        this.state = "open";

        // start with command stream, but don't send yet
        return  commandStream
                  .concatMap((command) => {
                    return this.responseStream.startWith("open")
                      .map((response) => {
                        return {
                          type: command.type,
                          commandString: command.commandString,
                          response: response
                        }
                      })
                  })
                  .filter((responseObj: any) => {
                    return true;//responseObj.type !== "handshake";
                  });
      });
  }

  write(commandString: string) {
    Observable.interval(1000)
      .map(() => {
        this.responseStream.next("Response for " + commandString);

        return "Command written";
      })
      .take(1)
      .forEach((message) => console.log(message));

  }

  buildCommandStream(command: string): Observable<any>{
    let commandObservable = Observable.from([{
      type: "command",
      commandString: command
    }]);

    if (this.state === "closed") {
      return Observable.from(this.handshake)
        .map((handshake: string) => ({
          type: "handshake",
          commandString: handshake
        }))
        .concat(commandObservable);
    } else {
      return commandObservable;
    }
  }

  open(): Observable<any> {
    return Observable.create((observer) => {
      observer.next("open");
    })
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
