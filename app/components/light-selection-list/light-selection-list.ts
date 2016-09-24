import { Component } from '@angular/core';

/*
  Generated class for the LightSelectionList component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'light-selection-list',
  templateUrl: 'build/components/light-selection-list/light-selection-list.html'
})
export class LightSelectionList {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }
}
