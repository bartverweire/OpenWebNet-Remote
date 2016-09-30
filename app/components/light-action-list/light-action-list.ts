import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { Light, Group } from '../../models/model';
import { LightActionListItem } from '../light-action-list-item/light-action-list-item';
import { ComponentDetailPage } from '../../pages/component-detail/component-detail';
import { OwnCommand } from '../../providers/own/own-command';
import { DataProvider } from '../../providers/data-provider/data-provider';

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
export class LightActionList implements OnInit, OnDestroy {
  lights: Observable<Group<Light>>;
  lightsSubscription: Subscription;

  status: boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private ownCommand: OwnCommand,
              private dataProvider: DataProvider) {
    console.log("LightActionList: constructed");
  }

  ngOnInit() {
    console.log("LightActionList: subscribing to calculate status");
    this.lightsSubscription = this.lights.subscribe((group) => {
      this.status = group.components.every((light): boolean => {
        return light.status === 1;
      })
    })
  }

  ngOnDestroy() {
    this.lightsSubscription && !this.lightsSubscription.isUnsubscribed && this.lightsSubscription.unsubscribe();
  }

  action(): any {
    console.log("LightActionList: action " + this.status);

    this.lights.take(1)
      .forEach((group) => {
        let command: string = group.getCommand(this.status ? 1 : 0);
        group.components.forEach((component) => {
          component.status = this.status ? 1 : 0;
        })

        console.log(command);
        this.ownCommand.send(command);
        this.dataProvider.refresh();
      });
  }

  createLight() {
    console.log("LightActionList: Create new component of type Light ");
    this.navCtrl.push(ComponentDetailPage, {
      'type': Light.ComponentType
    })
  }
}
