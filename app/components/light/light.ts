import { Component } from '@angular/core';

/*
  Generated class for the Light component.

  See https://angular.io/docs/ts/latest/api/core/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'light',
  templateUrl: 'build/components/light/light.html'
})
export class Light {

  text: string;

  constructor() {
    this.text = 'Hello World';
  }
}
