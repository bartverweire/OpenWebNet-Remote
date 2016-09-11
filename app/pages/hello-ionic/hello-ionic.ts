import {Component} from '@angular/core';
import {OwnCommand} from '../../providers/own-command/own-command';
import {OwnMonitor} from '../../providers/own-monitor/own-monitor';
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  providers: [OwnCommand,OwnMonitor]
})
export class HelloIonicPage {
  componentId: number = 32;
  onoff: boolean = false;

  constructor(private ownCommand: OwnCommand, private ownMonitor: OwnMonitor) {
    this.ownCommand.init("192.168.0.103",20000);
    this.ownMonitor.init("192.168.0.103",20000);
  }

  status(component, type) {
      this.ownCommand
        .send("*#" + type + (component ? "*" + component : "") + "##")
        .subscribe((data) => {
          console.log("Hello Page Status" + JSON.stringify(data));
        });
  }

  send(component, status) {
    this.ownCommand
      .send("*1*" + (status ? 1 : 0) + "*" + component + "##")
      .subscribe((data) => {
        console.log("Hello Page Command" + JSON.stringify(data));
      });
  }

  monitor() {
    this.ownMonitor
      .listen()
      .subscribe((data) => {
        console.log("Hello Page Monitor " + JSON.stringify(data));
      })
  }
}
