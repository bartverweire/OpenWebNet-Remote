import { Component, OnInit } from '@angular/core';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';

/*
  Generated class for the GroupSelectionListItem component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'group-selection-list-item',
  templateUrl: 'build/components/group-selection-list-item/group-selection-list-item.html',
  inputs: ["group","component","selected"]
})
export class GroupSelectionListItem implements OnInit {
  group: Group<OwnComponent>
  component: OwnComponent;
  selected: Group<OwnComponent>[];

  constructor() {
  }

  ngOnInit() {
    console.log("GroupSelectionListItem initialized");
    console.log(this.selected);
  }

  toggleGroup(checkbox: any, selectedGroup: Group<OwnComponent>) {
    let index = this.selected
                  .map((group) => group.name)
                  .indexOf(selectedGroup.name);
    if (checkbox.checked) {
      if (index < 0) {
        this.selected.push(selectedGroup);
      }
      // otherwise
    } else {
      if (index >= 0) {
        this.selected.splice(index,1);
      }
    }

    console.log("Selection after toggle ");
    console.log(this.selected.map((group) => group.name));
  }

}
