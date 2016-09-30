import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { OwnComponent, Light, Shutter, Group } from '../../models/model';

/*
  Generated class for the DataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataProvider {

  private storage:                Storage;
  private lights:                 Group<Light>;
  private shutters:               Group<Shutter>;
  private allComponents:          Map<number,OwnComponent>;
  private allGroups:              Map<string, Group<OwnComponent>>;
  private groups:                 Group<OwnComponent>[];

  private lightsStream:           Subject<Group<Light>>;
  private shuttersStream:         Subject<Group<Shutter>>;
  private groupsStream:           Subject<Group<OwnComponent>[]>;
  private groupStream:            Subject<Group<OwnComponent>>;
  private currentComponentStream: Subject<OwnComponent>;

  constructor(private http: Http) {
    this.storage = new Storage(SqlStorage, {name: 'myhome'});

    this.allComponents  = new Map<number,OwnComponent>();
    this.allGroups      = new Map<string, Group<OwnComponent>>();
    this.groups         = [];
    this.lights         = new Group<Light>(Light.ComponentType, "Lights");
    this.shutters       = new Group<Shutter>(Shutter.ComponentType, "Shutters");

    this.lightsStream   = new ReplaySubject<Group<Light>>(1);
    this.shuttersStream = new ReplaySubject<Group<Shutter>>(1);
    this.groupsStream   = new ReplaySubject<Group<OwnComponent>[]>(1);
    this.groupStream    = new ReplaySubject<Group<OwnComponent>>(1);

    this.lightsStream.subscribe(
      (data) => {
        console.log("New lightsStream event");
        console.log(data);
      },
      (error) => {
        console.error("Lightsstream error");
      },
      () => {
        console.log("Lightsstream completed");
      }
    )
    this.loadData();
  }

  getComponent(id: number): OwnComponent {
    return this.allComponents.get(id);
  }

  getLights(): Subject<Group<Light>> {
    console.log("LightsStream subscribers " + this.lightsStream.observers.length);
    return this.lightsStream;
  }

  getShutters(): Subject<Group<Shutter>> {
    console.log("ShuttersStream subscribers " + this.lightsStream.observers.length);
    return this.shuttersStream;
  }

  getGroups(type?: number, includeDefaultGroups? : boolean): Subject<Group<OwnComponent>[]> {
    return <Subject<Group<OwnComponent>[]>> this.groupsStream
            .map((groups) => {
              if (!type) {
                return groups
                  .filter((group) => {
                    return includeDefaultGroups || !group.defaultGroup;
                  })
                  .sort((a,b) => {
                    if (a.type != b.type) {
                      return a.type - b.type;
                    }

                    if (a.name == b.name) {
                      return 0;
                    }

                    return a.name < b.name ? -1 : 1;
                  });
              }

              return groups
                      .filter((group) => {
                        return group.type === type;
                      })
            });
  }

  getGroup(name: string): Group<OwnComponent> {
    return this.allGroups.get(name);
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
        this.groups = zipped.groups;
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

  saveComponent(component: OwnComponent, groups: Group<OwnComponent>[]) {
    this.allComponents.set(component.id, component);
    switch (component.type) {
      case Light.ComponentType : this.lights.add(<Light>component); break;;
      case Shutter.ComponentType : this.shutters.add(<Shutter>component); break;;
    }

    if (groups) {
      this.allGroups.forEach((currGroup, index) => {
        let isParent = false;
        groups.forEach((group) => {
          if (group.name === currGroup.name) {
            isParent = true;
          }
        })

        if (isParent) {
          currGroup.add(component);
        } else {
          currGroup.remove(component);
        };
      });
    }

    this.lightsStream.next(this.lights);
    this.shuttersStream.next(this.shutters);
    this.groupsStream.next(this.groups);
  }

  saveGroup(group: Group<OwnComponent>) {
    let index = this.groups.map((group) => group.name).indexOf(group.name);
    if (index < 0) {
      this.groups.push(group);
      this.allGroups.set(group.name, group);
    }

    this.lightsStream.next(this.lights);
    this.shuttersStream.next(this.shutters);
    this.groupsStream.next(this.groups);
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
            type: 1,
            defaultGroup: true
          },
          {
            name: "Shutters",
            type: 2,
            defaultGroup: true
          },
          {
            name: "Bureau",
            type: 1,
            defaultGroup: false
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
        case 1 : group = new Group<Light>(groupJson.type, groupJson.name, groupJson.defaultGroup); break;;
        case 2 : group = new Group<Shutter>(groupJson.type, groupJson.name, groupJson.defaultGroup); break;;
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
