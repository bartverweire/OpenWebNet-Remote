import { Component } from '@angular/core';

/*
  Generated class for the LightSelectionListItem component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'light-selection-list-item',
  templateUrl: 'build/components/light-selection-list-item/light-selection-list-item.html'
})
export class LightSelectionListItem {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }
}
