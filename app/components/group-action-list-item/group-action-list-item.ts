import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { OwnComponent, Light, Shutter, Group } from '../../models/model';
import { GroupDetailPage } from '../../pages/group-detail/group-detail';

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
export class GroupActionListItem {
  group: Group<OwnComponent>;
  // only for light groups
  toggleStatus: boolean = false;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    console.log("Group action list item constructor");
  }

  select() {
    console.log("Selected Group " + JSON.stringify(this.group));
    this.navCtrl.push(GroupDetailPage, {
      'group': this.group
    })
  }

  action(commandType?: number) {
    if (!commandType) {
      commandType = this.toggleStatus ? 1 : 0 ;
    }
    console.log("Group action " + this.group.getCommand(commandType));
  }
}
