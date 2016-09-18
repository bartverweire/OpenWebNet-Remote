import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { OwnComponent, Light, Shutter, Group, Model } from '../../models/model';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataProvider {

  private storage:        Storage;
  private groups:         Group<OwnComponent>[];
  private lights:         Group<Light>;
  private shutters:       Group<Shutter>;
  private allComponents:  Map<number,OwnComponent>;
  private allGroups:      Map<string, Group<OwnComponent>>;

  private lightsStream:   Subject<Group<Light>>;
  private shuttersStream: Subject<Group<Shutter>>;
  private groupsStream:    Subject<Group<OwnComponent>[]>;
  private groupStream:    Subject<Group<OwnComponent>>;

  constructor(private http: Http) {
    this.storage = new Storage(SqlStorage, {name: 'myhome'});

    this.allComponents  = new Map<number,OwnComponent>();
    this.allGroups      = new Map<string, Group<OwnComponent>>();
    this.lights         = new Group<Light>(Light.ComponentType, "Lights");
    this.shutters       = new Group<Shutter>(Shutter.ComponentType, "Shutters");
    this.groups         = [];

    this.lightsStream   = new Subject<Group<Light>>();
    this.shuttersStream = new Subject<Group<Shutter>>();
    this.groupsStream   = new Subject<Group<OwnComponent>[]>();
    this.groupStream    = new Subject<Group<OwnComponent>>();

    this.loadData();
  }

  getLights(): Subject<Group<Light>> {
    return this.lightsStream;
  }

  getShutters(): Subject<Group<Shutter>> {
    return this.shuttersStream;
  }

  getGroups(type?: number): Subject<Group<OwnComponent>[]> {
    return <Subject<Group<OwnComponent>[]>> this.groupsStream
            .map((groups) => {
              if (!type) {
                return groups;
              }

              return groups
                      .filter((group) => {
                        return group.type === type;
                      })
            });
  }

  getGroup(name: string): Subject<Group<OwnComponent>> {
    this.groupsStream.forEach((groups) => {
      groups.forEach((group) => {
        if (group.name === name) {
          this.groupStream.next(group);
        }
      });
    });

    return this.groupStream;
  }

  loadData() {
    Observable.zip(
      this.loadLights(),
      this.loadShutters(),
      this.loadGroups(),
      this.loadGroupMembers(),
      (lights, shutters, groups, memberMap) => {
        return {
          lights: lights,
          shutters: shutters,
          groups: groups,
          memberMap: memberMap
        }
      })
      .take(1)
      .forEach((zipped) => {
        // add components to the global map
        zipped.lights.forEach((light) => {
          this.allComponents.set(light.id, light);
        });
        zipped.shutters.forEach((shutter) => {
          this.allComponents.set(shutter.id, shutter);
        });
        // add groups to the global group map
        zipped.groups.forEach((group) => {
          this.allGroups.set(group.name, group);
        });

        zipped.memberMap.forEach((value, index) => {
          let group = this.allGroups.get(index);
          value.forEach((id) => {
            group.add(this.allComponents.get(id));
          });
        });

        this.lights.set(zipped.lights);
        this.shutters.set(zipped.shutters);

        this.lightsStream.next(this.lights);
        this.shuttersStream.next(this.shutters);
        this.groupsStream.next(zipped.groups);
      });
  }


  loadLights() {
    return Observable.fromPromise(this.storage.get('lights'))
    .map((data) => {
      if (!data) {
        data = [
          {
            id: 11,
            name: 'Trap Wand'
          },
          {
            id: 31,
            name: 'Bureau Centraal'
          },
          {
            id: 32,
            name: 'Bureau Kast'
          }
        ]
      }

      return this.parseLights(data);
    });
  }

  loadShutters() {
    return Observable.fromPromise(this.storage.get('shutters'))
    .map((data) => {
      if (!data) {
        data = [
          {
            id: 81,
            name: 'Bureau Voor'
          },
          {
            id: 82,
            name: 'Bureau Zij'
          }
        ]
      }

      return this.parseShutters(data);
    });
  }

  loadGroups() {
    return Observable.fromPromise(this.storage.get('groups'))
    .map((data) => {
      if (!data) {
        data = [
          {
            name: "Lights",
            type: 1
          },
          {
            name: "Shutters",
            type: 2
          },
          {
            name: "Bureau",
            type: 1
          }
        ]
      }

      return this.parseGroups(data);
    });
  }

  loadGroupMembers() {
    return Observable.fromPromise(this.storage.get('group_members'))
    .map((data) => {
      if (!data) {
        data = [
          {
            name: "Lights",
            members: [11, 31, 32]
          },
          {
            name: "Shutters",
            members: [81, 82]
          },
          {
            name: "Bureau",
            members: [31, 32]
          }
        ]
      }

      return this.parseMembers(data);
    });
  }

  parseLights(lightsJson: any): Light[] {
    let lights: Light[] = [];
    lightsJson.forEach((lightJson) => {
      let light: Light = new Light(lightJson.id, lightJson.name, lightJson.dimmable);
      // add the light to the global components map
      lights.push(light);
    });

    return lights;
  }

  parseShutters(shuttersJson: any): Shutter[] {
    let shutters: Shutter[] = [];
    shuttersJson.forEach((shutterJson) => {
      let shutter: Shutter = new Shutter(shutterJson.id, shutterJson.name);
      shutters.push(shutter);
    });

    return shutters;
  }

  parseGroups(groupsJson: any): Group<OwnComponent>[] {
    let groups: Group<OwnComponent>[] = [];
    groupsJson.forEach((groupJson) => {
      let group: Group<OwnComponent>;
      switch (groupJson.type) {
        case 1 : group = new Group<Light>(groupJson.type, groupJson.name); break;;
        case 2 : group = new Group<Shutter>(groupJson.type, groupJson.name); break;;
      }

      groups.push(group);
    });

    return groups;
  }

  parseMembers(data: any): Map<string, Array<number>> {
    let memberMap = new Map<string, Array<number>>();

    data.forEach((memberInfo) => {
      memberMap.set(memberInfo.name, memberInfo.members);
    });

    return memberMap;
  }
}
