import { Component, OnInit } from '@angular/core'
import { MatSnackBarRef } from '@angular/material/snack-bar'

@Component({
  selector: 'app-snack-alert',
  templateUrl: './snack-alert.component.html',
  styleUrls: ['./snack-alert.component.scss'],
})
export class SnackAlertComponent implements OnInit {
  constructor(private _snackRef: MatSnackBarRef<SnackAlertComponent>) {}

  ngOnInit(): void {}
  closeSnak() {
    this._snackRef.dismiss()
  }
}
