import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OwnCommand } from '../../providers/own/own-command';
import { DataProvider } from '../../providers/data-provider/data-provider';
import { OwnComponent, Light, Shutter, Group, OwnResponse} from '../../models/model';
import { Observable, Subject, Subscription } from 'rxjs';

/*
  Generated class for the DiscoveryPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/discovery/discovery.html',
})
export class DiscoveryPage implements OnInit, OnDestroy {
  ids: Array<number>;

  lights: Observable<Group<Light>>;
  lightsSubscription: Subscription;

  shutters: Observable<Group<Shutter>>;
  shuttersSubscription: Subscription;

  lightIds: Array<number> = [];
  shutterIds: Array<number> = [];

  constructor(private navCtrl: NavController,
              private zone:NgZone,
              private ownCommand: OwnCommand,
              private dataProvider: DataProvider) {
    console.log("Discovery:  constructed");

    for (var i = 11; i < 65; i++) {
      this.lightIds.push(i);
    }

    for (var i = 71; i < 90; i++) {
      this.shutterIds.push(i);
    }
  }

  ngOnInit() {
    this.lights = this.dataProvider.getLights();
    this.lightsSubscription = this.lights.subscribe((group) => {
      console.log("Discovery: received updated lights group " + group.components.length);
      this.zone.run(() => {
        console.log('Discovery: refresh');
      });
    });

    this.shutters = this.dataProvider.getShutters();
    this.shuttersSubscription = this.shutters.subscribe((group) => {
      console.log("Discovery: received updated shutters group " + group.components.length);
      this.zone.run(() => {
        console.log('Discovery: refresh');
      });
    });
  }

  ngOnDestroy() {
    !this.lightsSubscription.isUnsubscribed && this.lightsSubscription.unsubscribe();
    !this.shuttersSubscription.isUnsubscribed && this.shuttersSubscription.unsubscribe();
  }

  discover() {
    console.log("Discovery: discovering lights");
    this.lightIds.forEach((value) => {
      let command = "*#1*" + (value) + "##";

      this.ownCommand.send(command);
    });
    console.log("Discovery: discovering shutters");
    this.shutterIds.forEach((value) => {
      let command = "*#2*" + (value) + "##";

      this.ownCommand.send(command);
    });
  }
}
