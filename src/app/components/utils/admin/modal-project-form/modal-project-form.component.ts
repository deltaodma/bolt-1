import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { UiService } from 'src/app/services/ui.service'

import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { ModalNotificationComponent } from '../../modal-notification/modal-notification.component'
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

        console.log(
          'post request',
          this.createProjectForm.controls.project_name_es.value,
        )
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

  public getMessageform(item: any): string {
    if (this.lang == 'Esp') {
      if (item.hasError('user')) {
        return 'usuario inválido'
      }
      if (item.hasError('id')) {
        return 'id inválido'
      }
      if (item.hasError('project')) {
        return 'Seleccione un proyecto'
      }
      if (item.hasError('country')) {
        return 'Seleccione un país'
      }
    } else {
      if (item.hasError('user')) {
        return 'invalid user'
      }
      if (item.hasError('id')) {
        return 'invalid id'
      }
      if (item.hasError('project')) {
        return 'Selecct a project'
      }
      if (item.hasError('country')) {
        return 'select  a country'
      }
    }
  }

  closeModal() {
    this.ui.dismissModal(ModalProjectFormComponent)
  }

  loadProject() {
    if (this.data) {
      this.createProjectForm.patchValue({
        project_name_es: this.data.project['name'],
        project_name_en: this.data.project['name'],
        description_es: this.data.project['description'],
        description_en: this.data.project['description'],
        icon: this.data.project['icon'],
      })
    }
  }
}
