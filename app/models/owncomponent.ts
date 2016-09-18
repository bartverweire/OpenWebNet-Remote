import { Light, Shutter } from './models';

export abstract class OwnComponent {
  public status: number;


  constructor(public id: number, public name: string, public type: number) {

  }

  static create(type: number) {
    switch (type) {
      case Light.ComponentType: return new Light(0, "New Light", false);
      case Shutter.ComponentType: return new Shutter(0, "New Shutter");
    }

    return null;
  }

  getStatus(): number {
    return this.status;
  }

  setStatus(status: number): void {
    this.status = status;
  }

  abstract getStatusCode(): string;

}
