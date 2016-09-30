import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { Shutter, Group } from '../../models/model';
import { ShutterActionListItem } from '../shutter-action-list-item/shutter-action-list-item';
import { ComponentDetailPage } from '../../pages/component-detail/component-detail';
import { OwnCommand } from '../../providers/own/own-command';
import { DataProvider } from '../../providers/data-provider/data-provider';

/*
  Generated class for the ShutterSelectionList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'shutter-action-list',
  templateUrl: 'build/components/shutter-action-list/shutter-action-list.html',
  inputs: ["shutters"],
  directives: [ShutterActionListItem]
})
export class ShutterActionList {
  shutters: Observable<Group<Shutter>>;
  shuttersSubscription: Subscription;
  status: number;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private ownCommand: OwnCommand,
              private dataProvider: DataProvider) {
    console.log("ShutterActionList: constructed");
  }

  ngOnInit() {
    console.log("LightActionList: subscribing to calculate status");
    this.shuttersSubscription = this.shutters.subscribe((group) => {
      this.status = group.components
        .map((shutter) => {
          return shutter.status;
        })
        .reduce((prev, status): number => {
          // return stopped status if not all are equal
          return status === prev ? prev : 0;
        }, null);
    })
  }

  ngOnDestroy() {
    this.shuttersSubscription && !this.shuttersSubscription.isUnsubscribed && this.shuttersSubscription.unsubscribe();
  }

  action(status: number): any {
    this.status = status;

    console.log("ShutterActionList: action " + this.status);

    this.shutters.take(1)
      .forEach((group) => {
        let command: string = group.getCommand(this.status);
        group.components.forEach((component) => {
          component.status = this.status;
        })

        console.log(command);
        this.ownCommand.send(command);
        this.dataProvider.refresh();
      });
  }

  createShutter() {
    console.log("ShutterActionList: Create new component of type Shutter ");
    this.navCtrl.push(ComponentDetailPage, {
      'type': Shutter.ComponentType
    })
  }
}
