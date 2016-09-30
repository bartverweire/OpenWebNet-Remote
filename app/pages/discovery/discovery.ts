import { Component, OnInit, OnDestroy } from '@angular/core';
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
  ids: Array<number> = [10,11,12,13,14,15,16,17,18,19,20];
  lights: Subject<Group<Light>>;
  lightsSubscription: Subscription;
  shutters: Subject<Group<Shutter>>;
  shuttersSubscription: Subscription;
  responseStream: Observable<string>;
  responseSubscription: Subscription;


  constructor(private navCtrl: NavController,
              private ownCommand: OwnCommand,
              private dataProvider: DataProvider) {
    console.log("Discovery - constructed");
  }

  ngOnInit() {
    this.lights = this.dataProvider.getLights();
    this.lightsSubscription = this.lights.subscribe((group) => {
      console.log("Discovery - received updated lights group " + group.components.length);
    })
    this.shutters = this.dataProvider.getShutters();
    this.shuttersSubscription = this.shutters.subscribe((group) => {
      console.log("Discovery - received updated shutters group " + group.components.length);
    })

    this.responseStream = this.ownCommand.listen();
    this.responseSubscription = this.responseStream
          .subscribe((data) => {
            this.parseResponse(data);
          });
  }

  ngOnDestroy() {
    !this.responseSubscription.isUnsubscribed && this.responseSubscription.unsubscribe();
    !this.lightsSubscription.isUnsubscribed && this.lightsSubscription.unsubscribe();
    !this.shuttersSubscription.isUnsubscribed && this.shuttersSubscription.unsubscribe();
  }



  discover() {
    this.ids.forEach((id) => {
      let command = "*#1*" + id + "##";

      this.ownCommand.send(command);
      //this.parseResponse("*1*1*" + id);
    });
  }

  parseResponse(data) {
    console.log("Discovery - parsing response " + data);
    data.split("##").forEach((resp) => {
      let ownResponse = OwnResponse.parseResponse(resp);
      if (!ownResponse) return;

      let component = this.dataProvider.getComponent(ownResponse.where);

      if (!component) {
        component = OwnComponent.create(ownResponse.who, ownResponse.where);
        this.dataProvider.saveComponent(component, null);
      }

      component.status = ownResponse.what;
    });

  }
}
