import { OwnComponent } from './owncomponent';

export class Group<T extends OwnComponent> {
  type: number;
  name: string;
  defaultGroup: boolean;
  components: T[];

  constructor(type: number, name: string, defaultGroup?: boolean) {
    this.name = name;
    this.type = type;
    this.defaultGroup = defaultGroup;
    this.components = [];
  }

  getType<T extends OwnComponent>(t: {new(): T;  prototype: {type: T}}): T {
    return t.prototype.type;
  }

  add(component: T) {
    var index = this.components.map(x => x.id).indexOf(component.id, 0);

    if (index < 0) {
      this.components.push(component);
    }
  }

  remove(component: T) {
    var index = this.components.map(x => x.id).indexOf(component.id, 0);
    if (index >= 0) {
      this.components.splice(index, 1);
    }
  }

  set(components: T[]) {
    this.components = components;
  }

  getStatus(): any {
    if (this.type === 1) {
      return this.components.every((light): boolean => {
        return light.status === 1;
      });
    }

    if (this.type === 2) {
      return this.components
        .map((shutter) => {
          return shutter.status;
        })
        .reduce((prev, status): number => {
          // return stopped status if not all are equal
          return status === prev ? prev : 0;
        }, null);
    }

  }

  setStatus(status: number) {
    this.components.forEach((component) => component.setStatus(status));
  }

  size(): number {
    return this.components.length;
  }

  contains(otherComponent: T): boolean {
    let found: boolean = false;
    this.components.forEach((component) => {
      if (component.id === otherComponent.id) found = true;
    });

    return found;
  }

  getCommand(commandType: number): string {
    let command = "";
    return this.components
      .map((component): string => {
        return "" + component.id
      })
      .reduce((current: string, id: string): string => {
        return current + "*" + this.type + "*" + (commandType) + "*" + id + "##";
      }, "");
  }

  isDefault(): boolean {
    return this.defaultGroup;
  }
}

export class GroupMap {
  name: string;
  group: Group<OwnComponent>;
}
