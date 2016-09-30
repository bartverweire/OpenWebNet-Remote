import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable, Subject, Subscription } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { OwnMonitor } from '../../providers/own/own-monitor';
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
export class MainPage implements OnInit, OnDestroy {
  lights: Observable<Group<Light>>;
  lightsSubscription: Subscription;
  shutters: Observable<Group<Shutter>>;
  shuttersSubscription: Subscription;
  groups: Observable<Group<OwnComponent>[]>;
  groupsSubscription: Subscription;

  monitoring: boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private dataProvider: DataProvider,
              private ownMonitor: OwnMonitor ) {

    console.log("Home: LIGHTSSTREAM SUBSCRIPTION ");
    this.lights = this.dataProvider.getLights();
    this.lightsSubscription = this.lights.subscribe(
      (data) => {
        console.log("Home : lightsStream event received");
        console.log(data);
      },
      (error) => {
        console.error("Home : lightsStream error received");
        console.error(error);
      },
      () => {
        console.log("Home : lightsStream completed");
      }
    );

    this.shutters = <Subject<Group<Shutter>>><any> this.dataProvider.getShutters();
    this.shuttersSubscription = this.shutters.subscribe((data) => {
      console.log("Home: Received shutters");
      console.log(data);
    });

    this.groups = this.dataProvider.getGroups(null, false);
    this.groupsSubscription = this.groups.subscribe((groups) => {
      console.log("Home: Received groups");
      console.log(groups);
    });

    this.monitoring = ownMonitor.monitoring;

    console.log("Home: constructed");
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.lightsSubscription && !this.lightsSubscription.isUnsubscribed && this.lightsSubscription.unsubscribe();
    this.shuttersSubscription && !this.shuttersSubscription.isUnsubscribed && this.shuttersSubscription.unsubscribe();
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
