import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { Subject } from 'rxjs';

/*
  Generated class for the ComponentDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/component-detail/component-detail.html',
  providers: [DataProvider]
})
export class ComponentDetailPage {
  component: OwnComponent;
  existing: boolean = true;
  groups: Subject<Group<OwnComponent>[]>;

  constructor(private navCtrl: NavController, private navParams: NavParams, private dataProvider: DataProvider) {
    this.component = navParams.get('component');
    if (!this.component) {
      this.existing = false;
      this.component = OwnComponent.create(Light.ComponentType);
    } else {
      this.existing = true;
    }

    this.groups = this.getGroups();
  }

  setType(type: number) {
    if (!this.existing) {
      let newComponent = OwnComponent.create(type);
      newComponent.name = this.component.name;
      this.component = newComponent;

      this.groups = this.getGroups();
    }
  }

  getGroups(): Subject<Group<OwnComponent>[]> {
    return this.dataProvider.getGroups(this.component.type);
  }


  selectGroup(group: Group<OwnComponent>) {
    console.log("Selected group " + JSON.stringify(group));
  }
}
