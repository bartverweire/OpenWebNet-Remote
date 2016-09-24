import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Shutter } from '../../models/model';
import { ComponentDetailPage } from '../../pages/component-detail/component-detail';
/*
  Generated class for the ShutterActionListItem component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'shutter-action-list-item',
  templateUrl: 'build/components/shutter-action-list-item/shutter-action-list-item.html',
  inputs: ["shutter"]
})
export class ShutterActionListItem {
  shutter: Shutter;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    console.log("Shutter action list item constructor");
  }

  select() {
    console.log("Selected shutter " + JSON.stringify(this.shutter));
    this.navCtrl.push(ComponentDetailPage, {
      'component': this.shutter
    })
  }

  action(commandType: number) {
    console.log("Shutter action " + this.shutter.getCommand(commandType));
  }
}
