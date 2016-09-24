import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';
import { Subject, ReplaySubject } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';

/*
  Generated class for the GroupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/group-detail/group-detail.html'
})
export class GroupDetailPage {
  group: Group<OwnComponent>;
  groupForm: FormGroup;
  existing: boolean = true;

  name: string;
  type: number = 1;

  selected: OwnComponent[];
  candidates: Subject<OwnComponent[]>;

  formErrors = {
    name: ''
  }

  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 3 characters long.'
    }
  };

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private dataProvider: DataProvider,
              private formBuilder: FormBuilder) {
    this.group = navParams.get('group');
    if (!this.group) {
      this.existing = false;
      this.type = 1;
      this.group = new Group(this.type, this.name);
    } else {
      this.type = this.group.type;
      this.name = this.group.name;
    }

    this.candidates = new ReplaySubject<OwnComponent[]>(1);
    this.candidates.forEach((candidates) => {
      console.log("Group details - Candidate array received");
      candidates.forEach((candidate) => {
        this.selected.push(candidate);
      })
    });
    this.getCandidates();
  }

  setType(type: number) {
    if (!this.existing) {
      this.type = type;
      this.getCandidates();
    }
  }

  getCandidates() {
    let candidateGroup: Subject<Group<OwnComponent>>;

    switch(this.type) {
      case 1 : candidateGroup = <Subject<Group<OwnComponent>>><any> this.dataProvider.getLights(); break;;
      case 2 : candidateGroup = <Subject<Group<OwnComponent>>><any> this.dataProvider.getShutters(); break;;
    }

    candidateGroup.take(1).forEach((group) => {
      this.candidates.next(group.components);
    });
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
