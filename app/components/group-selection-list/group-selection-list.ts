import { Component, OnInit } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';
import { GroupSelectionListItem } from '../group-selection-list-item/group-selection-list-item';

/*
  Generated class for the GroupSelectionList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'group-selection-list',
  templateUrl: 'build/components/group-selection-list/group-selection-list.html',
  directives: [GroupSelectionListItem],
  inputs: ["groups","component","selected"]
})
export class GroupSelectionList implements OnInit {
  groups: Subject<Group<OwnComponent>[]>;
  selected: Group<OwnComponent>[];
  component: OwnComponent;

  constructor() {
  }

  ngOnInit() {
    console.log("GroupSelectionList initialized");
    console.log(this.selected);
  }
}
