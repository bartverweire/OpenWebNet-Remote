import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { OwnComponent, Group, Light, Shutter } from '../../models/model';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { Subject, ReplaySubject } from 'rxjs';
import { CustomValidators } from '../../validators/custom-validators';
import { GroupSelectionList } from '../../components/group-selection-list/group-selection-list';
/*
  Generated class for the ComponentDetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/component-detail/component-detail.html',
  directives: [GroupSelectionList]
})
export class ComponentDetailPage implements OnInit {
  component: OwnComponent;
  componentForm: FormGroup;
  existing: boolean = true;

  id:       number = 0;
  name:     string = "New Component";
  type:     number = 1;
  dimmable: boolean = false;

  selected: Group<OwnComponent>[];
  groups: Subject<Group<OwnComponent>[]>;

  formErrors = {
    name: '',
    id: ''
  }

  validationMessages = {
    'name': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 3 characters long.'
    },
    'id': {
      'required': 'id is required.',
      'minlength': 'id must be between 1 and 99',
      'maxlength': 'id must be between 1 and 99'
    }
  };

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private dataProvider: DataProvider,
              private formBuilder: FormBuilder) {
    this.component = navParams.get('component');
    if (!this.component) {
      this.type = navParams.get('type');
      this.existing = false;
      this.component = OwnComponent.create(this.type);
    } else {
      this.existing = true;
      this.id = this.component.id;
      this.name = this.component.name;
      this.type = this.component.type;
      this.dimmable = this.component.type === 1 ? (<Light>this.component).dimmable : false;
    }

    this.componentForm = formBuilder.group({
      id:       [this.id, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(2)])],
      name:     [this.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      type:     [this.type],
      dimmable: [this.dimmable]
    });
    this.componentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.selected = [];
    this.groups = new ReplaySubject<Group<OwnComponent>[]>();
    this.groups.forEach((groups) => {
      console.log("Component details - received new group array");
      groups.forEach((group) => {
        if (group.contains(this.component)) {
          this.selected.push(group);
        }
      })
    })
    this.getGroups();
  }

  ngOnInit() {}

  setType(type: number) {
    if (!this.existing) {
      let newComponent = OwnComponent.create(type);
      newComponent.name = this.component.name;
      this.component = newComponent;

      this.getGroups();
    }
  }

  getGroups() {
    this.dataProvider.getGroups(this.component.type).forEach((groups) => {
      this.groups.next(groups);
    });
  }

  /*
  selectGroup(group: Group<OwnComponent>) {
    console.log("Selected group " + JSON.stringify(group));
  }
  */
  saveComponent() {
    let values = this.componentForm.value;
    console.log(this.componentForm.value);

    let component = this.dataProvider.getComponent(values.id) || OwnComponent.create(values.type);
    component.name = values.name;
    component.id = values.id;
    if (values.type === Light.ComponentType) {
      (<Light>component).dimmable = values.dimmable;
    }

    this.dataProvider.saveComponent(component, this.selected);
    this.navCtrl.pop();
  }

  onValueChanged(data?: any) {
    if (!this.componentForm) {
      return;
    }

    const form = this.componentForm;
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
