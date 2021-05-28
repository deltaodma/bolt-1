import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { HttpService } from 'src/app/services/http.service'

import { UiService } from 'src/app/services/ui.service'
import { environment } from 'src/environments/environment'

import { ModalNotificationComponent } from '../../../pop up/modal-notification/modal-notification.component'

export interface DialogData {
  project: object
}

@Component({
  selector: 'app-modal-submenu-form',
  templateUrl: './modal-submenu-form.component.html',
  styleUrls: ['./modal-submenu-form.component.scss'],
})
export class ModalSubmenuFormComponent implements OnInit {
  public createSubMenuForm: FormGroup
  public httpError: string
  public hide: boolean
  public password: string
  public lang: string

  private errorMessage: any = {
    es: {
      submenu_name_es: 'Ingrese un nombre de sub menú en español',
      submenu_name_en: 'Ingrese un nombre de sub menú en inglés',
      description_es: 'Ingrese una descripción(Español)',
      description_en: 'Ingrese una descripción(Inglés)',
    },
    en: {
      submenu_name_es: 'Enter a sub menu name in spanish',
      submenu_name_en: 'Enter a sub menu name in english',
      description_es: 'Enter a description(Spanish)',
      description_en: 'Enter a description(English)',
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
  }
  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.createSubMenuForm = this.formBuilder.group({
      submenu_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      submenu_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      description_es: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
      description_en: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
    })
  }

  saveProject(): void {
    if (this.createSubMenuForm.invalid) {
      ;(<any>Object)
        .values(this.createSubMenuForm.controls)
        .forEach((control) => {
          control.markAsTouched()
        })
      return
    } else {
      // TO DO POST REQUEST
      let user_id = localStorage.getItem('userId')
      let submenuData = {
        created_by: user_id,
        name_es: this.createSubMenuForm.controls.submenu_name_es.value,
        name_en: this.createSubMenuForm.controls.submenu_name_en.value,
        description_es: this.createSubMenuForm.controls.description_es.value,
        description_en: this.createSubMenuForm.controls.description_en.value,
        project_id: this.data.project['id'],
        status: 1,
      }

      this.httpService
        .post(environment.serverUrl + environment.submenus.post, submenuData)
        .subscribe(
          (response: any) => {
            if (response.status == 201) {
              this.closeModal()
              this.ui.showModal(
                ModalNotificationComponent,
                '500px',
                'auto',
                '',
                'backdrop',
                {
                  message_es: `El submenu de nombre ${this.createSubMenuForm.controls.submenu_name_es.value} fue creado con éxito`,
                  message_en: `The ${this.createSubMenuForm.controls.submenu_name_en.value} project was successfully created`,
                },
              )
              setTimeout(() => {
                window.location.reload()
              }, 3000)
            }
          },
          (e) => {
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
    const control = this.createSubMenuForm.get(controlName)
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
    this.ui.dismissModal(ModalSubmenuFormComponent)
  }
}
