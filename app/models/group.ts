import { OwnComponent } from './owncomponent';

export class Group<T extends OwnComponent> {
  type: number;
  name: string;
  components: T[];

  constructor(type: number, name: string) {
    this.name = name;
    this.type = type;
    this.components = [];

  }

  getType<T extends OwnComponent>(t: {new(): T;  prototype: {type: T}}): T {
    return t.prototype.type;
  }

  add(component: T) {
    this.components.push(component);
  }

  remove(component: T) {
    var index = this.components.map(x => x.id).indexOf(component.id, 0);
    this.components.splice(index, 0);
  }

  set(components: T[]) {
    this.components = components;
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
}

export class GroupMap {
  name: string;
  group: Group<OwnComponent>;
}
