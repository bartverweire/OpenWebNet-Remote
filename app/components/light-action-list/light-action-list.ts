import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { Light, Group } from '../../models/model';
import { LightActionListItem } from '../light-action-list-item/light-action-list-item';
import { ComponentDetailPage } from '../../pages/component-detail/component-detail';

/*
  Generated class for the LightActionList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'light-action-list',
  templateUrl: 'build/components/light-action-list/light-action-list.html',
  inputs: ["lights"],
  directives: [LightActionListItem]
})
export class LightActionList implements OnInit {
  lights: Subject<Group<Light>>;
  status: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    console.log("Light action list constructor");
  }

  ngOnInit() {
    this.lights.forEach((group) => {
      this.status = group.components.every((light): boolean => {
        return light.status === 1;
      })
    })
  }

  add() {
    console.log("Light group add ");
  }

  action(): any {
    console.log("Light group action " + this.status);
    let command = this.lights.take(1)
      .reduce((acc: string, group: Group<Light>): string => {
        return acc + group.getCommand(this.status ? 1 : 0);
      }, "")
      .forEach((command) => {
        console.log(command);
      });


  }

  createLight() {
    console.log("Create new component of type Light ");
    this.navCtrl.push(ComponentDetailPage, {
      'type': Light.ComponentType
    })
  }
}
