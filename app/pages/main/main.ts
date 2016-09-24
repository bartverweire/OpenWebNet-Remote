import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { OwnComponent, Light, Shutter, Group } from '../../models/model';
import { GroupDetailPage } from '../group-detail/group-detail';
import { ComponentDetailPage } from '../component-detail/component-detail';
import { LightActionList } from '../../components/light-action-list/light-action-list';
import { ShutterActionList } from '../../components/shutter-action-list/shutter-action-list';
import { GroupActionList } from '../../components/group-action-list/group-action-list';

/*
  Generated class for the MainPagePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/main/main.html',
  directives: [LightActionList, ShutterActionList, GroupActionList]
})
export class MainPage {
  lights: Subject<Group<Light>>;
  shutters: Subject<Group<Shutter>>;
  groups: Subject<Group<OwnComponent>[]>;

  constructor(private navCtrl: NavController, private navParams: NavParams, private dataProvider: DataProvider) {
    this.lights = <Subject<Group<Light>>><any> this.dataProvider.getLights();
    this.lights.subscribe(
      (data) => {
        console.log("Main : lighsStream event received");
        console.log(data);
      },
      (error) => {
        console.error("Main : lighsStream error received");
        console.error(error);
      },
      () => {
        console.log("Main : lighsStream completed");
      }
    );

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

  createGroup() {
    this.navCtrl.push(GroupDetailPage);
  }

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

}
