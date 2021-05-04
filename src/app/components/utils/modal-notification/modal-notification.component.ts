import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.component.html',
  styleUrls: ['./modal-notification.component.scss'],
})
export class ModalNotificationComponent implements OnInit {
  constructor(
    public dialogAlert: MatDialogRef<ModalNotificationComponent>,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {}
  closeModal() {
    this.dialogAlert.close()
  }
}
