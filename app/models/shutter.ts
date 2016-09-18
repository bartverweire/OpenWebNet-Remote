import { OwnComponent } from './owncomponent';

export class Shutter extends OwnComponent {
  static ComponentType: number = 2;

  constructor(id: number, name: string) {
    super(id, name, Shutter.ComponentType);
  }

  getStatusCode(): string {
    return this.status > 1 ? "on" : "off";
  }
}
