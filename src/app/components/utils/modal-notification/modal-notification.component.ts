import { Component, OnInit } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { UiService } from 'src/app/services/ui.service'

@Component({
  selector: 'app-modal-notification',
  templateUrl: './modal-notification.component.html',
  styleUrls: ['./modal-notification.component.scss'],
})
export class ModalNotificationComponent implements OnInit {
  constructor(public ui: UiService) {}

  ngOnInit(): void {}
  closeModal() {
    this.ui.dismissModal(ModalNotificationComponent)
  }
}
