import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Shutter, Group } from '../../models/model';
import { ComponentDetailPage } from '../../pages/component-detail/component-detail';
import { OwnCommand } from '../../providers/own/own-command';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { Observable, Subscription } from 'rxjs';

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
export class ShutterActionListItem implements OnInit, OnDestroy {
  shutter: Shutter;

  shutters: Observable<Group<Shutter>>;
  shuttersSubscription: Subscription;


  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private zone: NgZone,
              private ownCommand: OwnCommand,
              private dataProvider: DataProvider) {
    console.log("Shutter action list item constructor");
  }

  ngOnInit() {
    this.shutters = this.dataProvider.getShutters();
    this.shuttersSubscription = this.shutters.subscribe((group) => {
      console.log("ShutterActionListItem: received updated shutters group " + group.components.length);
      this.zone.run(() => {
        console.log('ShutterActionListItem: refresh');
      });
    });
  }

  ngOnDestroy() {
    !this.shuttersSubscription.isUnsubscribed && this.shuttersSubscription.unsubscribe();
  }

  select() {
    console.log("Selected shutter " + JSON.stringify(this.shutter));
    this.navCtrl.push(ComponentDetailPage, {
      'component': this.shutter
    })
  }

  action(status: number) {
    this.shutter.status = status;

    console.log("ShutterActionList: action " + this.shutter.status);

    let command = this.shutter.getCommand(this.shutter.status);
    console.log("Shutter action " + command);
    this.ownCommand.send(command);
    this.dataProvider.refresh();
  }
}
