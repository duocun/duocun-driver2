
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { EntityService } from '../entity.service';
import { AuthService } from '../account/auth.service';
import { SharedService } from '../shared/shared.service';



@Injectable()
export class PickupService extends EntityService {
  url;

  constructor(
    public authSvc: AuthService,
    public sharedSvc: SharedService,
    public http: HttpClient
  ) {
    super(authSvc, http);
    this.url = super.getBaseUrl() + 'Pickups';
  }
}
