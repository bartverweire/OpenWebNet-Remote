import {Component} from '@angular/core';
import {OwnCommand} from '../../providers/own-command/own-command'

@Component({
  templateUrl: 'build/pages/hello-ionic/hello-ionic.html',
  providers: [OwnCommand]
})
export class HelloIonicPage {
  componentId: number = 31;

  constructor(private ownCommand: OwnCommand) {

  }

  send() {
    this.ownCommand.send("*1*1*" + this.componentId + "##");
  }
}
