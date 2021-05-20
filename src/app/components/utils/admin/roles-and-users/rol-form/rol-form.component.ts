import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

import { UiService } from 'src/app/services/ui.service'

import { ModalNotificationComponent } from '../../../pop up/modal-notification/modal-notification.component'
import { DialogData } from '../../../pop up/modal-confirmation/modal-confirmation.component'

@Component({
  selector: 'app-rol-form',
  templateUrl: './rol-form.component.html',
  styleUrls: ['./rol-form.component.scss'],
})
export class RolFormComponent implements OnInit {
  public addNewRolForm: FormGroup
  public httpError: string
  public hide: boolean
  public password: string
  public lang: string

  private errorMessage: any = {
    es: {
      user_roles: 'Selecione como mínimo un rol',
    },
    en: {
      user_roles: 'Select at least one rol',
    },
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public ui: UiService,
  ) {}

  ngOnInit(): void {
    this.initforms()
    this.loadUser()
  }
  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    console.log(this.data['user']['user_id'])
    this.addNewRolForm = this.formBuilder.group({
      user_name: new FormControl(
        {
          value: '',
          disabled: true,
        },
        [],
      ),
      user_id: new FormControl(
        {
          value: this.data.user_name,
          disabled: true,
        },
        [],
      ),
      user_roles: new FormControl('', [Validators.required]),
    })
  }

  saveProject(): void {
    if (this.addNewRolForm.invalid) {
      ;(<any>Object).values(this.addNewRolForm.controls).forEach((control) => {
        control.markAsTouched()
      })
      return
    } else {
      // TO DO POST REQUEST

      console.log('put request')

      this.closeModal()
      this.ui.showModal(
        ModalNotificationComponent,
        '500px',
        'auto',
        '',
        'backdrop',
        {
          message_es: `Los roles del usuario con nombre ${this.addNewRolForm.controls.user_name.value} fueron actualizados con éxito`,
          message_en: `The roles of the user ${this.addNewRolForm.controls.user_name.value} were updated successfully`,
        },
      )
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }
  }

  public getMessageform(controlName: any): string {
    let error = ''
    const control = this.addNewRolForm.get(controlName)
    if (control.touched && control.errors) {
      if (this.lang == 'Esp') {
        error = this.errorMessage['es'][controlName]
      }
      if (this.lang == 'Eng') {
        error = this.errorMessage['en'][controlName]
      }
    }
    return error
  }

  closeModal() {
    this.ui.dismissModal(RolFormComponent)
  }

  loadUser() {
    if (this.data) {
      this.addNewRolForm.patchValue({
        user_name: this.data['user']['user_name'],
        user_id: this.data['user']['user_id'],
        user_roles: this.data['user']['roles'],
      })
    }
  }
}
