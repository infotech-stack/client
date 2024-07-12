import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivate } from '@angular/router';

import { CanActivateService } from '../../services/can-activate/can-activate.service';

@Injectable({
  providedIn: 'root',
})
export class CanActivateGuard implements CanActivate {
  constructor(
    private _canActivateService: CanActivateService,
    private dialog: MatDialog
  ) {}
  canActivate() {
    if (this._canActivateService.configureView()) {
      return true;
    } else {
      // this.checkLoginAccess();
      return false;
    }
  }
  // checkLoginAccess() {
  //   const dialogRef = this.dialog
  //     .open(LoginDialogComponent, {
  //       disableClose: true,
  //       width: '450px',
  //     })
  //     .afterClosed()
  //     .subscribe((res) => {
  //       window.parent.postMessage(
  //         JSON.stringify({ is_redirect_to_apps_landing_page: true })
  //       );
  //     });
  // }
}
