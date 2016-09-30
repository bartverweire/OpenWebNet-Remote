import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Light, Group } from '../../models/model';
import { ComponentDetailPage } from '../../pages/component-detail/component-detail';
import { OwnCommand } from '../../providers/own/own-command';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { Observable, Subscription } from 'rxjs';
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
export class LightActionListItem implements OnInit, OnDestroy {
  light: Light;

  lights: Observable<Group<Light>>;
  lightsSubscription: Subscription;

  status: boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private zone: NgZone,
              private ownCommand: OwnCommand,
              private dataProvider: DataProvider ) {
    console.log("LightActionListItem: constructed");
  }

  ngOnInit() {
    this.status = this.light.status === 1;

    this.lights = this.dataProvider.getLights();
    this.lightsSubscription = this.lights.subscribe((group) => {
      console.log("LightActionListItem: received updated lights group " + group.components.length);
      this.zone.run(() => {
        this.status = this.light.status === 1;
        console.log('LightActionListItem: refresh');
      });
    });
  }

  ngOnDestroy() {
    !this.lightsSubscription.isUnsubscribed && this.lightsSubscription.unsubscribe();
  }

  select() {
    console.log("Selected light " + JSON.stringify(this.light));
    this.navCtrl.push(ComponentDetailPage, {
      'component': this.light
    })
  }

  action() {
    console.log("LightActionList: action " + this.status);
    this.light.status = this.status ? 1 : 0;

    let command = this.light.getCommand(this.light.status);
    console.log("Light action " + command);
    this.ownCommand.send(command);
    this.dataProvider.refresh();
  }
}
