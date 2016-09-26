import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { OwnComponent, Shutter, Group } from '../../models/model';
import { ComponentDetailPage } from '../component-detail/component-detail';
import { ShutterActionList } from '../../components/shutter-action-list/shutter-action-list';

/*
  Generated class for the ShuttersPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/shutters/shutters.html',
  directives: [ShutterActionList]
})
export class ShuttersPage {
  shutters: Subject<Group<Shutter>>;

  constructor(private navCtrl: NavController, private navParams: NavParams, private dataProvider: DataProvider) {
    this.shutters = <Subject<Group<Shutter>>><any> this.dataProvider.getShutters();
    this.shutters.subscribe(
      (data) => {
        console.log("ShuttersPage : shuttersStream event received");
        console.log(data);
      },
      (error) => {
        console.error("ShuttersPage : shuttersStream error received");
        console.error(error);
      },
      () => {
        console.log("ShuttersPage : shuttersStream completed");
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
