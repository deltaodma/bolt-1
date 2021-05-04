import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ModalRolFormComponent } from '../modal-rol-form/modal-rol-form.component'

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss'],
})
export class ModalAlertComponent implements OnInit {
  constructor(
    public dialogAlert: MatDialogRef<ModalAlertComponent>,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  closeModal() {
    this.dialogAlert.close()
  }
  openForm() {
    this.closeModal()
    this.dialog.open(ModalRolFormComponent, {
      disableClose: true,
      width: '500px',
      height: 'auto',
    })
  }
}
