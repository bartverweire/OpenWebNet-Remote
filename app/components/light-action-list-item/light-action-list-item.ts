import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Light } from '../../models/model';
import { ComponentDetailPage } from '../../pages/component-detail/component-detail';
import { OwnCommand } from '../../providers/own/own-command';

/*
  Generated class for the LightActionListItem component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'light-action-list-item',
  templateUrl: 'build/components/light-action-list-item/light-action-list-item.html',
  inputs: ["light"]
})
export class LightActionListItem {
  light: Light;

  constructor(private navCtrl: NavController, private navParams: NavParams, private ownCommand: OwnCommand) {
    console.log("Light action list item constructor");
  }

  select() {
    console.log("Selected light " + JSON.stringify(this.light));
    this.navCtrl.push(ComponentDetailPage, {
      'component': this.light
    })
  }

  action() {
    let command = this.light.getCommand(this.light.status ? 1 : 0);
    console.log("Light action " + command);
    this.ownCommand.send(command);
  }
}
