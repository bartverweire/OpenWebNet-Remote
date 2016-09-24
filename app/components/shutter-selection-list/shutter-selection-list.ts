import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { Shutter, Group } from '../../models/model';
import { ShutterActionListItem } from '../shutter-action-list-item/shutter-action-list-item';
import { ComponentDetailPage } from '../../pages/component-detail/component-detail';

/*
  Generated class for the ShutterSelectionList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'shutter-selection-list',
  templateUrl: 'build/components/shutter-selection-list/shutter-selection-list.html',
  inputs: ["shutters"],
  directives: [ShutterActionListItem]
})
export class ShutterSelectionList {
  shutters: Subject<Group<Shutter>>;
  status: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    console.log("Shutter action list constructor");
  }

  ngOnInit() {
    this.shutters.forEach((group) => {
      this.status = group.components.every((shutter): boolean => {
        return shutter.status === 1;
      })
    })
  }

  add() {
    console.log("Shutter group add ");
  }

  action(): any {
    console.log("Shutter group action " + this.status);
    let command = this.shutters.take(1)
      .reduce((acc: string, group: Group<Shutter>): string => {
        return acc + group.getCommand(this.status ? 1 : 0);
      }, "")
      .forEach((command) => {
        console.log(command);
      });


  }

  createShutter() {
    console.log("Create new component of type Shutter ");
    this.navCtrl.push(ComponentDetailPage, {
      'type': Shutter.ComponentType
    })
  }
}
