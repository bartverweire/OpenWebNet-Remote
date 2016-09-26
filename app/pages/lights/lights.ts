import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { OwnComponent, Light, Group } from '../../models/model';
import { ComponentDetailPage } from '../component-detail/component-detail';
import { LightActionList } from '../../components/light-action-list/light-action-list';

/*
  Generated class for the LightsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/lights/lights.html',
  directives: [LightActionList]
})
export class LightsPage {
  lights: Subject<Group<Light>>;

  constructor(private navCtrl: NavController, private navParams: NavParams, private dataProvider: DataProvider) {
    this.lights = <Subject<Group<Light>>><any> this.dataProvider.getLights();
    this.lights.subscribe(
      (data) => {
        console.log("LightsPage : lightsStream event received");
        console.log(data);
      },
      (error) => {
        console.error("LightsPage : lightsStream error received");
        console.error(error);
      },
      () => {
        console.log("LightsPage : lightsStream completed");
      }
    );
  }
  /*
  selectComponent(component: OwnComponent) {
    console.log("Selected component " + JSON.stringify(component));
    this.navCtrl.push(ComponentDetailPage, {
      'component': component
    })
  }

  createComponent(type: number) {
    console.log("Create new component of type " + type);
    this.navCtrl.push(ComponentDetailPage, {
      'type': type
    })
  }
  */
}
