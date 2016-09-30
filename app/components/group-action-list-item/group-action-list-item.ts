import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { OwnComponent, Light, Shutter, Group } from '../../models/model';
import { GroupDetailPage } from '../../pages/group-detail/group-detail';
import { OwnCommand } from '../../providers/own/own-command';
import { DataProvider } from '../../providers/data-provider/data-provider';

/*
  Generated class for the GroupActionListItem component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'group-action-list-item',
  templateUrl: 'build/components/group-action-list-item/group-action-list-item.html',
  inputs: ["group"]
})
export class GroupActionListItem implements OnInit, OnDestroy {
  group: Group<OwnComponent>;

  groups: Observable<Group<OwnComponent>[]>;
  groupsSubscription: Subscription;

  // only for light groups
  status: any;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private zone: NgZone,
              private ownCommand: OwnCommand,
              private dataProvider: DataProvider ) {
    console.log("GroupActionListItem: constructed");
  }

  ngOnInit() {
    this.status = this.group.getStatus();

    this.groups = this.dataProvider.getGroups();
    this.groupsSubscription = this.groups.subscribe((groups: Group<OwnComponent>[]) => {
      console.log("GroupActionListItem: received updated groups " + groups.length);
      this.zone.run(() => {
        this.status = this.group.getStatus();
        console.log('GroupActionListItem: refresh');
      });
    });
  }

  ngOnDestroy() {
    !this.groupsSubscription.isUnsubscribed && this.groupsSubscription.unsubscribe();
  }

  select() {
    console.log("Selected Group " + JSON.stringify(this.group));
    this.navCtrl.push(GroupDetailPage, {
      'group': this.group
    })
  }

  action(status: number) {
    if (!status) {
      status = this.status ? 1 : 0 ;
    }

    this.group.components.forEach((component) => {
      component.status = status;
    });

    let command: string = this.group.getCommand(status);
    console.log(command);
    this.ownCommand.send(command);
    this.dataProvider.refresh();

    console.log("GroupActionListItem: action " + this.group.getCommand(status));
  }
}
