import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

import { UiService } from 'src/app/services/ui.service'

import { ModalNotificationComponent } from '../../../pop up/modal-notification/modal-notification.component'
import { DialogData } from '../../../pop up/modal-confirmation/modal-confirmation.component'
import { HttpService } from 'src/app/services/http.service'
import { environment } from 'src/environments/environment'

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
  public role_list: any = []

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
    public httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.initforms()
    this.httpService
      .get(environment.serverUrl + environment.roles.getAll)
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            response.body.items.forEach((role) => {
              this.role_list.push(
                this.lang == 'Esp' ? role.name_es : role.name_en,
              )
              this.loadUser()
            })
          }
        },
        (err) => {},
      )
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
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
      let userData = {
        name: this.data['user']['name'],
        last_name: this.data['user']['last_name'],
        country: this.data['user']['country'],
        employee_code: this.data['user']['employee_code'],
        status: this.data['user']['status'],
        roles: this.addNewRolForm.controls.user_roles.value,
      }
      this.httpService
        .put(
          environment.serverUrl +
            environment.users.putById +
            this.data['user']['employee_code'],
          userData,
        )
        .subscribe(
          (response: any) => {
            this.ui.showLoading()
            if (response.status >= 200 && response.status < 300) {
              this.ui.dismissLoading()
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
          },
          (err) => {
            this.ui.dismissLoading()
            this.httpError =
              this.lang == 'Esp'
                ? 'Ha ocurrido un error'
                : 'An error has accoured'
          },
        )
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
      let user_roles = []
      this.data['user']['roles'].forEach((roles) => {
        user_roles.push(this.lang == 'Esp' ? roles.name_es : roles.name_en)
      })
      this.addNewRolForm.patchValue({
        user_name:
          this.data['user']['name'] + ' ' + this.data['user']['last_name'],
        user_id: this.data['user']['employee_code'],
        user_roles: user_roles,
      })
    }
  }
}
