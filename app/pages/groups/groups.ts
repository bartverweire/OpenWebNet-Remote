import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { OwnComponent, Group } from '../../models/model';
import { ComponentDetailPage } from '../component-detail/component-detail';
import { GroupActionList } from '../../components/group-action-list/group-action-list';
import { OwnMonitor } from '../../providers/own/own-monitor';

/*
  Generated class for the GroupsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/groups/groups.html',
  directives: [GroupActionList]
})
export class GroupsPage implements OnInit, OnDestroy {
  groups: Observable<Group<OwnComponent>[]>;
  groupsSubscription: Subscription;

  monitoring: boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private dataProvider: DataProvider,
              private ownMonitor: OwnMonitor ) {
    this.groups = this.dataProvider.getGroups();
    this.groupsSubscription = this.groups.subscribe(
      (data) => {
        console.log("GroupsPage : groupsStream event received");
        console.log(data);
      },
      (error) => {
        console.error("GroupsPage : groupsStream error received");
        console.error(error);
      },
      () => {
        console.log("GroupsPage : groupsStream completed");
      }
    );

    this.monitoring = ownMonitor.monitoring;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.groupsSubscription && !this.groupsSubscription.isUnsubscribed && this.groupsSubscription.unsubscribe();
  }

  toggleMonitor() {
    if (this.monitoring) {
      this.ownMonitor.start();
    } else {
      this.ownMonitor.stop();
    }
  }
}
