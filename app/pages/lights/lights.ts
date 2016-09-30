import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observable, Subscription } from 'rxjs';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { OwnComponent, Light, Group } from '../../models/model';
import { ComponentDetailPage } from '../component-detail/component-detail';
import { LightActionList } from '../../components/light-action-list/light-action-list';
import { OwnMonitor } from '../../providers/own/own-monitor';

/*
  Generated class for the LightsPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/lights/lights.html',
  directives: [LightActionList]
})
export class LightsPage implements OnInit, OnDestroy {
  lights: Observable<Group<Light>>;
  lightsSubscription: Subscription;

  monitoring: boolean;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private dataProvider: DataProvider,
              private ownMonitor: OwnMonitor ) {
    this.lights = this.dataProvider.getLights();
    this.lightsSubscription = this.lights.subscribe(
      (data) => {
        console.log("LightsPage : lightsStream event received");
        console.log(data);
      },
      (error) => {
        console.error("LightsPage : lightsStream error received");
        console.error(error);
      },
      () => {
        console.log("LightsPage : lightsStream completed");
      }
    );

    this.monitoring = ownMonitor.monitoring;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.lightsSubscription && !this.lightsSubscription.isUnsubscribed && this.lightsSubscription.unsubscribe();
  }

  toggleMonitor() {
    if (this.monitoring) {
      this.ownMonitor.start();
    } else {
      this.ownMonitor.stop();
    }
  }
}
