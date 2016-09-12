import {Component} from '@angular/core';
import {OwnCommand} from '../../providers/own-command/own-command-mock';
import {OwnMonitor} from '../../providers/own-monitor/own-monitor';
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
      .subscribe((response) => this.processResponse(response));
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
    //console.log("Hello Page Monitor " + JSON.stringify(response));
  }

  getCommands() {
    this.ownCommand.getCommands().forEach((command) => {
      console.log("GetCommand: " + command);
    })
  }
}
