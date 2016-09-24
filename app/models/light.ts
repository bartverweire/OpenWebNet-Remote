import { OwnComponent } from './owncomponent';

export class Light extends OwnComponent {
  static ComponentType: number = 1;

  dimmable: boolean;

  constructor(id: number, name: string, dimmable: boolean) {
    super(id, name, Light.ComponentType);

    this.dimmable = dimmable;
  }

  getStatusCode(): string {
    return this.status > 1 ? "on" : "off";
  }

  copy(component: OwnComponent) {
    this.id = component.id;
    this.name = component.name;
    this.dimmable = (<Light>component).dimmable;
  }

  on(): string {
    return this.getCommand(1);
  }

  off(): string {
    return this.getCommand(0);
  }

  getCommand(commandType: number): string {
    return "*1*" + (commandType) + "*" + this.id + "##";
  }
}
