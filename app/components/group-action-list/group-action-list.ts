import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { OwnComponent, Light, Shutter, Group } from '../../models/model';
import { GroupActionListItem } from '../group-action-list-item/group-action-list-item';
import { GroupDetailPage } from '../../pages/group-detail/group-detail';

/*
  Generated class for the LightActionList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'group-action-list',
  templateUrl: 'build/components/group-action-list/group-action-list.html',
  inputs: ["groups"],
  directives: [GroupActionListItem]
})
export class GroupActionList implements OnInit {
  groups: Subject<Group<OwnComponent>[]>;
  status: number;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    console.log("Group action list constructor");
  }

  ngOnInit() {

  }

  add() {
    console.log("Group group add ");
  }

  createGroup() {
    console.log("Create new group of type ");
    this.navCtrl.push(GroupDetailPage, {
      'type': Light.ComponentType
    })
  }
}
