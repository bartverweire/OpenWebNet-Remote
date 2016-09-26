import { Component, OnInit } from '@angular/core';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';

/*
  Generated class for the LightSelectionListItem component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'light-selection-list-item',
  templateUrl: 'build/components/light-selection-list-item/light-selection-list-item.html',
  inputs: ["group","component","selected"]
})
export class LightSelectionListItem {
  group: Group<OwnComponent>
  component: OwnComponent;
  selected: OwnComponent[];

  constructor() {
  }

  ngOnInit() {
    console.log("LightSelectionListItem initialized");
    console.log(this.selected);
  }

  toggleComponent(checkbox: any, selectedComponent: OwnComponent) {
    let index = this.selected
                  .map((component) => component.id)
                  .indexOf(selectedComponent.id);

    if (checkbox.checked) {
      if (index < 0) {
        this.selected.push(selectedComponent);
      }
    } else {
      if (index >= 0) {
        this.selected.splice(index, 1);
      }
    }

    console.log("Selection after toggle");
    console.log(this.selected.map((component) => component.name));
  }
}
