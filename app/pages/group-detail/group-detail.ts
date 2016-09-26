import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';
import { Subject, ReplaySubject } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { LightSelectionList } from '../../components/light-selection-list/light-selection-list';
import { ShutterSelectionList } from '../../components/shutter-selection-list/shutter-selection-list';


/*
  Generated class for the GroupPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/group-detail/group-detail.html',
  directives: [LightSelectionList, ShutterSelectionList]
})
export class GroupDetailPage {
  group: Group<OwnComponent>;
  groupForm: FormGroup;
  existing: boolean = true;

  name: string;
  type: number = 1;

  selected: OwnComponent[];
  components: Subject<OwnComponent[]>;

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
      this.name = "New Group";
      this.type = 1;
      this.group = new Group(this.type, this.name);
    } else {
      this.type = this.group.type;
      this.name = this.group.name;
    }

    this.groupForm = formBuilder.group({
      name:     [this.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      type:     [this.type]
    });
    this.groupForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.selected = [];
    this.components = new ReplaySubject<OwnComponent[]>(1);
    this.components.forEach((components) => {
      console.log("Group details - component array received");
      components.forEach((component) => {
        if (this.group.contains(component)) {
          this.selected.push(component);
        }
      })
    });
    this.getComponents();
  }

  changeType(type: string) {
    this.type = parseInt(type);
    if (!this.existing) {
      this.getComponents();
    }
  }

  getComponents() {
    let componentGroup: Subject<Group<OwnComponent>>;

    switch(this.type) {
      case 1 : componentGroup = <Subject<Group<OwnComponent>>><any> this.dataProvider.getLights(); break;;
      case 2 : componentGroup = <Subject<Group<OwnComponent>>><any> this.dataProvider.getShutters(); break;;
    }

    componentGroup.take(1).forEach((group) => {
      this.components.next(group.components);
    });
  }

  saveGroup() {
    let values = this.groupForm.value;
    console.log(this.groupForm.value);

    let group = this.dataProvider.getGroup(values.name) || new Group(values.type, "New Group");
    group.name = values.name;
    group.components = this.selected;

    this.dataProvider.saveGroup(group);
    this.navCtrl.pop();
  }

  cancel() {
    this.navCtrl.pop();
  }

  onValueChanged(data?: any) {
    if (!this.groupForm) {
      return;
    }

    const form = this.groupForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.controls[field];
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

}
