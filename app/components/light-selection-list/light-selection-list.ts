import { Component, OnInit } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';
import { LightSelectionListItem } from '../light-selection-list-item/light-selection-list-item';

/*
  Generated class for the LightSelectionList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'light-selection-list',
  templateUrl: 'build/components/light-selection-list/light-selection-list.html',
  directives: [LightSelectionListItem],
  inputs: ["group","components","selected"]
})
export class LightSelectionList implements OnInit {
  group: Group<OwnComponent>
  components: Subject<OwnComponent[]>;
  selected: OwnComponent[];

  constructor() {
  }

  ngOnInit() {
    console.log("LightSelectionList initialized");
    console.log(this.selected);
  }
}
