import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'

import { MatDialog } from '@angular/material/dialog'

import { ModalConfirmationComponent } from 'src/app/components/utils/pop up/modal-confirmation/modal-confirmation.component'
import { MockRoles } from 'src/app/mocks/roles-mock'
import { MockProjectsByRole } from 'src/app/mocks/projects-by-role-mock'
import { MockProjects } from 'src/app/mocks/projects-mock'

import { UiService } from 'src/app/services/ui.service'

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  public lang: string
  public pages: number = 3
  public roles: any = MockRoles
  public projects
  public createRolForm: FormGroup
  public active_count = 0
  public showForm: boolean = false
  public projectResume = []
  public projectNames = []
  public allowed_apps = []
  public editionActive: boolean = false

  private errorMessage: any = {
    es: {
      rol_name_es: 'Ingrese un nombre de proyecto en español',
      rol_name_en: 'Ingrese un nombre de proyecto en inglés',
      description_es: 'Ingrese una descripción en español',
      description_en: 'Ingrese una descripción en inglés',
      role_projects: 'Seleccione por lo menos un proyecto',
    },
    en: {
      rol_name_es: 'Enter a name in spanish',
      rol_name_en: 'Enter a name in english',
      description_es: 'Enter a description in spanish',
      description_en: 'Enter a description in english',
      role_projects: 'Select a least one',
    },
  }

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public ui: UiService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.projects = MockProjects
    this.initforms()
  }

  initforms() {
    this.createRolForm = this.formBuilder.group({
      rol_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      rol_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      description_es: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
      description_en: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),

      role_projects: new FormControl('', [Validators.required]),
    })
  }

  saveRole() {
    if (this.createRolForm.invalid) {
      ;(<any>Object).values(this.createRolForm.controls).forEach((control) => {
        control.markAsTouched()
      })
      return
    }
    this.showForm = false
    //TO DO POST request
    let dataForm = {
      rol_name_es: this.createRolForm.controls.rol_name_es.value,
      rol_name_en: this.createRolForm.controls.rol_name_en.value,
      description_es: this.createRolForm.controls.description_es.value,
      description_en: this.createRolForm.controls.description_en.value,
      role_projects: {
        projects: this.projectResume,
        apps: this.allowed_apps,
      },
    }
    console.log('POST request save role', dataForm)
    window.location.reload()
  }

  createRol() {
    this.showForm = true
    this.projects = MockProjects
  }

  editRole(target: any) {
    this.showForm = true
    this.projects = MockProjectsByRole

    target.role_projects.forEach((element) => {
      this.projectNames = [...this.projectNames, element.name]
    })

    this.createRolForm.patchValue({
      rol_name_es: target['role_name_es'],
      rol_name_en: target['role_name_en'],
      description_es: target['role_description_es'],
      description_en: target['role_description_en'],
      role_projects: this.projectNames,
    })
    this.readProjectsSelected(this.projectNames)
  }

  cancel() {
    this.showForm = false
    this.projectNames = []
    this.projectResume = []
    this.createRolForm.reset('')
    this.createRolForm.markAsUntouched()
  }

  updateRoleStatus(toogleStatus: boolean, target: any) {
    // TO DO PUT request
    console.log('put app', toogleStatus, target)
    let response = 200
    if (response == 200) {
      setTimeout(() => {
        this.ui.dismissLoading()
        window.location.reload()
      }, 2000)
    } else {
      this.ui.dismissLoading()
      //TO DO show http error
    }
  }

  showConfirmation(target: any, message_es: string, message_en: string) {
    if (target.active == true) {
      message_es = 'deshabilitar'
      message_en = 'disable'
    }
    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        role_name: target.role_name_es,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ui.showLoading()
        let toogle = !target.active
        this.updateRoleStatus(toogle, target)
      } else {
        window.location.reload()
      }
    })
  }

  readProjectsSelected(projects_selected: any) {
    this.projectResume = []
    // TO DO GET request to obtain projects by rol
    this.projects.forEach((singleProject) => {
      projects_selected.forEach((nameProject) => {
        if (nameProject == singleProject.name_en) {
          this.projectResume = [...this.projectResume, singleProject]
        }
      })
    })
  }

  updateCheckboxStatus(checkboxStatus: boolean, submenu: any) {
    let checkbox
    let blocker

    submenu.app_list.forEach((app) => {
      checkbox = document.getElementById(submenu.id + app.id)
      blocker = document.getElementById('blocker' + app.id)
      checkbox.classList.add('mat-checkbox-disabled')
      if (!checkboxStatus) {
        checkbox.classList.add('mat-checkbox-disabled')
        blocker.classList.add('big-z-index')
      } else {
        checkbox.classList.remove('mat-checkbox-disabled')
        blocker.classList.remove('big-z-index')
      }
    })
  }

  allowAccess(checkboxStatus: boolean, parent: any, target: any) {
    if (checkboxStatus) {
      this.allowed_apps = [
        ...this.allowed_apps,
        { parent: parent, chlid: target },
      ]
    }
  }

  public getMessageform(controlName: any): string {
    let error = ''
    const control = this.createRolForm.get(controlName)
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

  updatePage(page: string) {
    if (page == 'start') {
      this.active_count = 0
    }
    if (page == 'prev') {
      this.active_count--
    }
    if (page == 'next') {
      this.active_count++
    }
    if (page == 'last') {
      this.active_count = this.pages
    }
    // TO DO active elements GET request
  }
}
