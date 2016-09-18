import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { OwnComponent, Light, Shutter, Group } from '../../models/model';
import { GroupDetailPage } from '../group-detail/group-detail';
import { ComponentDetailPage } from '../component-detail/component-detail';

/*
  Generated class for the MainPagePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/main/main.html',
  providers: [DataProvider]
})
export class MainPage {
  lights: Subject<Group<Light>>;
  shutters: Subject<Group<Shutter>>;
  groups: Subject<Group<OwnComponent>[]>;

  constructor(private navCtrl: NavController, private navParams: NavParams, private dataProvider: DataProvider) {
    this.lights = <Subject<Group<Light>>><any> this.dataProvider.getLights();
    this.lights.subscribe((data) => {
      console.log("Received Lights");
      console.log(data);
    });

    this.shutters = <Subject<Group<Shutter>>><any> this.dataProvider.getShutters();
    this.shutters.subscribe((data) => {
      console.log("Received shutters");
      console.log(data);
    });

    this.groups = this.dataProvider.getGroups();
    this.groups.subscribe((groups) => {
      console.log("Received groups");
      console.log(groups);
    })
  }

  selectGroup(group: Group<OwnComponent>) {
    this.navCtrl.push(GroupDetailPage, {
      'group': group
    })
  }

  selectComponent(component: OwnComponent) {
    console.log("Selected component " + JSON.stringify(component));
    this.navCtrl.push(ComponentDetailPage, {
      'component': component
    })
  }

}
