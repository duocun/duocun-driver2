
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';


import { WizardComponent } from './wizard/wizard.component';
import { MapComponent } from './map/map.component';
import { AddressInputComponent } from './address-input/address-input.component';
import { SharedService } from './shared.service';
import { AddressAutocompleteComponent } from './address-autocomplete/address-autocomplete.component';
import { EntityService } from '../entity.service';
import { WarningDialogComponent } from './warning-dialog/warning-dialog.component';
import { ProgressSpinnerComponent } from './progress-spinner/progress-spinner.component';
import { DeliveryDialogComponent } from '../order/delivery-dialog/delivery-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatDialogModule
  ],
  declarations: [
    WizardComponent,
    MapComponent,
    AddressInputComponent,
    AddressAutocompleteComponent,
    WarningDialogComponent,
    ProgressSpinnerComponent
  ],
  providers: [
    SharedService,
    EntityService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    WizardComponent,
    MapComponent,
    // HeaderComponent,
    // FooterComponent,
    AddressInputComponent,
    AddressAutocompleteComponent,
    WarningDialogComponent,
    ProgressSpinnerComponent
  ],
  entryComponents: [DeliveryDialogComponent]
})
export class SharedModule { }
