import { OwnComponent } from './owncomponent';

export class Shutter extends OwnComponent {
  static ComponentType: number = 2;

  constructor(id: number, name: string) {
    super(id, name, Shutter.ComponentType);
  }

  getStatusCode(): string {
    return this.status > 1 ? "on" : "off";
  }

  copy(component: OwnComponent) {
    this.id = component.id;
    this.name = component.name;
  }

  up(): string {
    return this.getCommand(1);
  }

  down(): string {
    return this.getCommand(2);
  }

  stop(): string {
    return this.getCommand(0);
  }

  getCommand(commandType: number): string {
    return "*2*" + (commandType) + "*" + this.id + "##";
  }
}
