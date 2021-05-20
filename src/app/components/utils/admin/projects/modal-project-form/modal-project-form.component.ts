import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UiService } from 'src/app/services/ui.service'

import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ModalNotificationComponent } from '../../../pop up/modal-notification/modal-notification.component'
export interface DialogData {
  project: object
}
@Component({
  selector: 'app-modal-project-form',
  templateUrl: './modal-project-form.component.html',
  styleUrls: ['./modal-project-form.component.scss'],
})
export class ModalProjectFormComponent implements OnInit {
  public createProjectForm: FormGroup
  public httpError: string
  public hide: boolean
  public password: string
  public lang: string
  public operation_es: string = 'creado'
  public operation_en: string = 'created'

  private errorMessage: any = {
    es: {
      project_name_es: 'Ingrese un nombre de proyecto en español',
      project_name_en: 'Ingrese un nombre de proyecto en inglés',
      description_es: 'Ingrese una descripción en español',
      description_en: 'Ingrese una descripción en inglés',
      icon: 'Seleccione un icono',
    },
    en: {
      project_name_es: 'Enter a project name in spanish',
      project_name_en: 'Enter a project name in english',
      description_es: 'Enter a description in spanish',
      description_en: 'Enter a description in english',
      icon: 'Select a icon',
    },
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    public ui: UiService,
  ) {}

  ngOnInit(): void {
    this.initforms()
    this.loadProject()
  }
  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.createProjectForm = this.formBuilder.group({
      project_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      project_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      description_es: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(100),
      ]),
      description_en: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(100),
      ]),
      icon: new FormControl('', [Validators.required]),
    })
  }

  saveProject(): void {
    if (this.createProjectForm.invalid) {
      ;(<any>Object)
        .values(this.createProjectForm.controls)
        .forEach((control) => {
          control.markAsTouched()
        })
      return
    } else {
      if (!this.data) {
        // if neither data was received a new project is created
        // TO DO POST REQUEST

        console.log('post request')
      } else {
        // if any data was received the current project will be updated
        // TO DO POST REQUEST
        this.operation_es = 'actualizado'
        this.operation_en = 'updated'
        console.log('put request')
      }
      this.closeModal()
      this.ui.showModal(
        ModalNotificationComponent,
        '500px',
        'auto',
        '',
        'backdrop',
        {
          message_es: `El proyecto de nombre ${this.createProjectForm.controls.project_name_es.value} fue ${this.operation_es} con éxito`,
          message_en: `The ${this.createProjectForm.controls.project_name_en.value} project was successfully ${this.operation_en}`,
        },
      )
    }
  }

  public getMessageform(controlName: any): string {
    let error = ''
    const control = this.createProjectForm.get(controlName)
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
    this.ui.dismissModal(ModalProjectFormComponent)
  }

  loadProject() {
    if (this.data) {
      this.createProjectForm.patchValue({
        project_name_es: this.data.project['name_es'],
        project_name_en: this.data.project['name_en'],
        description_es: this.data.project['description_es'],
        description_en: this.data.project['description_en'],
        icon: this.data.project['icon'],
      })
    }
  }
}
