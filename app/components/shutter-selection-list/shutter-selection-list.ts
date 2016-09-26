import { Component, OnInit } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';
import { ShutterSelectionListItem } from '../shutter-selection-list-item/shutter-selection-list-item';

/*
  Generated class for the ShutterSelectionList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'shutter-selection-list',
  templateUrl: 'build/components/shutter-selection-list/shutter-selection-list.html',
  directives: [ShutterSelectionListItem],
  inputs: ["group","components","selected"]
})
export class ShutterSelectionList implements OnInit {
  group: Group<OwnComponent>
  components: Subject<OwnComponent[]>;
  selected: OwnComponent[];

  constructor() {
  }

  ngOnInit() {
    console.log("ShutterSelectionList initialized");
    console.log(this.selected);
  }
}
