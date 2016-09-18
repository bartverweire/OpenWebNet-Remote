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
}
