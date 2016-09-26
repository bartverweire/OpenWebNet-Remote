import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';

declare var Socket;

@Injectable()
export class OwnSocket {
  protected socket: any;
}
