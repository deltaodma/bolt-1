import { Injectable } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { LoadingComponent } from '../components/utils/loading/loading.component'

@Injectable({
  providedIn: 'root',
})
export class UiService {
  public loading: any
  constructor(public dialog: MatDialog) {}

  showLoading() {
    try {
      this.loading = this.dialog.open(LoadingComponent, {
        disableClose: true,
        panelClass: 'loading-modal',
      })
    } catch (e) {
      console.error('showLoading', e)
    }
  }

  dismissLoading() {
    try {
      if (this.loading) {
        this.loading.close()
      }
    } catch (e) {
      console.error('dismissLoading', e)
    }
  }

  showModal(refComponent, refClass?) {
    try {
      this.dialog.open(refComponent, {
        id: refComponent,
        disableClose: true,
        hasBackdrop: true,
        panelClass: refClass,
        width: '500px',
        height: 'auto',
      })
    } catch (e) {
      console.error('showLoading', e)
    }
  }

  dismissModal(reference: any) {
    try {
      if (reference) {
        this.dialog.getDialogById(reference).close()
      }
    } catch (e) {
      console.error('dismissModal', e)
    }
  }
}
