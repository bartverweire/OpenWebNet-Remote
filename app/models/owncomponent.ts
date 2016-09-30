import { Light, Shutter } from './model';

export abstract class OwnComponent {
  static objectIdGenerator: number = 0;

  public status: number;
  public objectId: number;

  constructor(public id: number, public name: string, public type: number) {
    this.objectId = OwnComponent.objectIdGenerator++;
    this.status = 0;
  }

  static create(type: number, id?: number): OwnComponent {
    switch (type) {
      case Light.ComponentType: return new Light(id || 0, "Light " + id || "", false);
      case Shutter.ComponentType: return new Shutter(id || 0, "Shutter " + id || "");
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
  abstract copy(component: OwnComponent): void;
  abstract getCommand(commandType: number): string;
}
