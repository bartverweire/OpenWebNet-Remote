import {Component} from '@angular/core';
import {OwnCommand} from '../../providers/own-command/own-command'
import {Observable} from 'rxjs/Observable';

@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  providers: [OwnCommand]
})
export class HelloIonicPage {
  componentId: number = 31;

  constructor(private ownCommand: OwnCommand) {

  }

  send() {
    this.ownCommand.init("192.168.0.103",20000).subscribe((data) => {
      this.processFeedback(data);
    });

    this.ownCommand.send("*1*1*" + this.componentId + "##");
  }

  processFeedback(data: string) {
    console.log("Hello Page " + data);
  }
}
