import {Component} from '@angular/core';
import {OwnCommand} from '../../providers/own/own-command';
import {OwnMonitor} from '../../providers/own/own-monitor';
import {Observable} from 'rxjs';
import {Subject} from 'rxjs';

@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  providers: [OwnCommand,OwnMonitor]
})
export class HelloIonicPage {
  componentId: number = 32;
  onoff: boolean = false;

  constructor(private ownCommand: OwnCommand, private ownMonitor: OwnMonitor) {
    this.ownCommand.init("192.168.0.103",20000)
      .subscribe(
        (response) => console.log("*** Hello Page " + JSON.stringify(response)),
        (error) => console.error("*** Hello Page " + JSON.stringify(error)),
        () => console.info("*** Hello Page - completed" )
      );
    //this.ownMonitor.init("192.168.0.103",20000);
  }

  status(component, type) {
      this.ownCommand
        .send("*#" + type + (component ? "*" + component : "") + "##");
  }

  send(component, status) {
    this.ownCommand
      .send("*1*" + (status ? 1 : 0) + "*" + component + "##");
  }

  processResponse(response: string) {
    console.log("Hello Page Monitor " + JSON.stringify(response));
  }

  select() {

  }
}
