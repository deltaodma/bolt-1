import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { ModalNotificationComponent } from '../modal-notification/modal-notification.component'

@Component({
  selector: 'app-modal-rol-form',
  templateUrl: './modal-rol-form.component.html',
  styleUrls: ['./modal-rol-form.component.scss'],
})
export class ModalRolFormComponent implements OnInit {
  public userRolForm: FormGroup
  public captchaStatus: boolean
  public restartCaptcha: boolean
  public httpError: string
  public hide: boolean
  public password: string
  constructor(
    public dialogForm: MatDialogRef<ModalRolFormComponent>,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initforms()
  }
  initforms() {
    this.userRolForm = this.formBuilder.group({
      user: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(15),
      ]),
      id: new FormControl('', [Validators.required, Validators.minLength(4)]),
      project: new FormControl('', [Validators.required]),

      country: new FormControl('', [Validators.required]),
    })
  }
  loginUser(): void {
    if (this.userRolForm.invalid) {
      // this.showError = true
      ;(<any>Object).values(this.userRolForm.controls).forEach((control) => {
        control.markAsTouched()
      })
      return
    }
    this.closeModal()
    this.dialog.open(ModalNotificationComponent, {
      disableClose: true,
      width: '500px',
      height: '240px',
    })
  }

  public getMessageform(item: any): string {
    if (item.hasError('user')) {
      return 'usuario inválido'
    }
    if (item.hasError('id')) {
      return 'id inválido'
    }
    if (item.hasError('project')) {
      return 'Seleccione un projecto'
    }
    if (item.hasError('country')) {
      return 'Seleccione un país'
    }
  }

  closeModal() {
    this.dialogForm.close()
  }
}
