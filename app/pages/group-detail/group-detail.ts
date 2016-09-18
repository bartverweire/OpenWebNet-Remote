import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';
import { Subject } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';

/*
  Generated class for the GroupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/group-detail/group-detail.html',
  providers: [DataProvider]
})
export class GroupDetailPage {
  group: Group<OwnComponent>;
  name: string;
  type: number = 1;
  existing: boolean = true;
  candidates: Subject<OwnComponent[]>;

  constructor(private navCtrl: NavController, private navParams: NavParams, private dataProvider: DataProvider) {
    this.group = navParams.get('group');
    if (!this.group) {
      this.existing = false;
      this.group = new Group(this.type, this.name);
    } else {
      this.type = this.group.type;
    }

    this.candidates = this.getCandidates();
    this.candidates.subscribe((data) => {
      console.log("Candidates received");
      console.log(data);
    });
  }

  setType(type: number) {
    if (!this.existing) {
      this.type = type;
      this.candidates = this.getCandidates();
    }
  }

  getCandidates(): Subject<OwnComponent[]> {
    let candidateGroup: Subject<Group<OwnComponent>>;

    switch(this.type) {
      case 1 : candidateGroup = <Subject<Group<OwnComponent>>><any> this.dataProvider.getLights(); break;;
      case 2 : candidateGroup = <Subject<Group<OwnComponent>>><any> this.dataProvider.getShutters(); break;;
    }

    return <Subject<OwnComponent[]>><any> candidateGroup
            .map((group) => {
              if (group) {
                return group.components;
              }

              return [];
            })
            .take(1);
  }

  toggleComponent(checkbox: any, component: OwnComponent) {
    if (checkbox.checked) {
      this.group.add(component);
    } else {
      this.group.remove(component);
    }
  }

  showComponent(component) {
    console.log("showing " + JSON.stringify(component));
  }

}
