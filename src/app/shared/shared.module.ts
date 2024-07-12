import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AddAllToPaginator } from './directives/add-all-to-paginator/add-all-to-paginator.directive';
import { CanActivateGuard } from './guards/can-activate/can-activate.guard';
import { UnsavedChangesGuard } from './guards/unsaved-changes/unsaved-changes.guard';
import { MaterialModule } from './material.module';
import { EllipsisPipe } from './pipes/ellipsis/ellipsis.pipe';
import { NoSanitizePipe } from './pipes/no-sanitize/no-sanitize.pipe';
import { RoundedValuePipe } from './pipes/rounded-value/rounded-value.pipe';
import { FilterPipe } from './pipes/search/search.pipe';
import { SpinnerComponent } from './services/custom-spinner/spinner.component';

const BASE_MODULES = [
  FormsModule,
  ReactiveFormsModule,
  MaterialModule,
 
];

const Guards = [UnsavedChangesGuard, CanActivateGuard];

const Pipes = [EllipsisPipe, NoSanitizePipe, FilterPipe, RoundedValuePipe];

const Directives: any[] = [AddAllToPaginator];

@NgModule({
  declarations: [
    Pipes,
    Directives,
  
  ],
  imports: [CommonModule, RouterModule, BASE_MODULES],
  providers: [Guards],
  exports: [Pipes, Directives, BASE_MODULES],
})
export class SharedModule {}
