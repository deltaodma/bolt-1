import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { MatDialog } from '@angular/material/dialog'

import { ModalConfirmationComponent } from 'src/app/components/utils/pop up/modal-confirmation/modal-confirmation.component'
import { MockProjectsByRole } from 'src/app/mocks/projects-by-role-mock'

import { UiService } from 'src/app/services/ui.service'

import { HttpService } from 'src/app/services/http.service'
import { forkJoin, Subscription } from 'rxjs'
import { RolesService } from 'src/app/services/roles.service'
import { ProjectsService } from 'src/app/services/projects.service'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { ThemePalette } from '@angular/material/core'

export interface Task {
  name: string
  completed: boolean
  color: ThemePalette
  subtasks?: Task[]
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  public createRolForm: FormGroup
  public lang: string

  public pages: number = 3
  public role_status: number = 1
  public current_items: number
  public items_length: number
  public active_count: number = 0

  public roles: any
  public projects: any

  public projectResume = []
  public projectsId = []
  public projectNames = []
  public allowed_submenus = []
  public allowed_apps = []

  public showForm: boolean = false
  public editionActive: boolean = false
  public create: boolean = true
  public available_apps: boolean = false

  allComplete: boolean = false

  public role_id: string = null
  public message_action_es: string = 'deshabilitar'
  public message_action_en: string = 'disable'

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

  task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      { name: 'Primary', completed: false, color: 'primary' },
      { name: 'Accent', completed: false, color: 'accent' },
      { name: 'Warn', completed: false, color: 'warn' },
    ],
  }

  constructor(
    public activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public ui: UiService,
    public dialog: MatDialog,
    public httpService: HttpService,
    public rolesService: RolesService,
    public projectService: ProjectsService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.getData(1)
    this.initforms()
  }

  initforms() {
    this.createRolForm = this.formBuilder.group({
      rol_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      rol_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
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

  getData(page: number) {
    let rolesSubs = this.rolesService.getObservableData(page)
    let projSubs = this.projectService.getObservableData()
    this.ui.showLoading()
    forkJoin({ roles: rolesSubs, projects: projSubs }).subscribe((res: any) => {
      this.ui.dismissLoading()

      let fetchRoles = res.roles.body
      this.pages = fetchRoles.meta.totalPages
      this.active_count = fetchRoles.meta.currentPage
      this.current_items = fetchRoles.meta.totalItems
      this.roles = fetchRoles.items
      this.items_length = this.roles.length

      let fetchProjects = res.projects.body.items
      this.projects = fetchProjects
      console.log(this.projects)
    })
  }

  openForm(open?: boolean) {
    if (open) {
      this.showForm = true
      this.create = true
    }
  }

  cancel() {
    this.showForm = false
    this.create = true
    this.role_id = null
    this.projectNames = []
    this.projectResume = []
    this.createRolForm.reset('')
    this.createRolForm.markAsUntouched()
  }

  updateRole(operation: string) {
    if (this.createRolForm.invalid) {
      ;(<any>Object).values(this.createRolForm.controls).forEach((control) => {
        control.markAsTouched()
      })
      return
    }
    let user_id = localStorage.getItem('userId')
    this.projectResume.forEach((projectSelected) => {
      this.projectsId = [...this.projectsId, projectSelected.id]
    })
    let dataForm = {
      status: this.role_status,
      name_es: this.createRolForm.controls.rol_name_es.value,
      name_en: this.createRolForm.controls.rol_name_en.value,
      description_es: this.createRolForm.controls.description_es.value,
      description_en: this.createRolForm.controls.description_en.value,
      created_by: user_id,
      projects: this.projectsId,
      submenus: this.allowed_submenus,
      apps: this.allowed_apps,
    }
    console.log(dataForm)

    if (!operation) {
      this.rolesService.postData(dataForm)
    } else {
      this.message_action_es = 'actualizó'
      this.message_action_en = 'updated'
      // TO DO:: PUT REQUEST
      this.rolesService.updateData(
        this.role_id,
        dataForm,
        this.message_action_es,
        this.message_action_en,
      )
    }
  }

  updateRoleStatus(role, event) {
    let roleName = this.lang == 'Esp' ? role.name_es : role.name_en

    if (event.checked) {
      this.message_action_es = 'habilitar'
      this.message_action_en = 'enable'
    } else {
      this.message_action_es = 'deshabilitar'
      this.message_action_en = 'disable'
    }

    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        role_name: roleName,
        message_action_es: this.message_action_es,
        message_action_en: this.message_action_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        if (event.checked) {
          this.message_action_es = 'habilitó'
          this.message_action_en = 'enabled'
        } else {
          this.message_action_es = 'deshabilitó'
          this.message_action_en = 'disabled'
        }
        this.rolesService.updateStatus(
          role,
          this.message_action_es,
          this.message_action_en,
        )
      } else {
        window.location.reload()
      }
    })
  }

  loadRole(target: any) {
    this.create = false
    this.showForm = true
    this.role_id = target.id
    this.role_status = target.status
    // this.projects = MockProjectsByRole
    console.log(target)

    // target.role_projects.forEach((element) => {
    //   this.projectNames = [...this.projectNames, element.name]
    // })

    this.createRolForm.patchValue({
      rol_name_es: target['name_es'],
      rol_name_en: target['name_en'],
      description_es: target['description_es'],
      description_en: target['description_en'],
      // role_projects: this.projectNames,
    })
    this.readProjectsSelected(this.projectNames)
  }

  deleteRole(role: any) {
    let message_es = 'eliminar'
    let message_en = 'delete'

    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        role_name: this.lang == 'Esp' ? role.name_es : role.name_en,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        message_es = 'eliminó'
        message_en = 'deleted'
        this.rolesService.delete(role, message_es, message_en)
      }
    })
  }

  readProjectsSelected(projects_selected: any) {
    this.projectResume = []
    // TO DO GET request to obtain projects by rol
    this.projects.forEach((singleProject) => {
      projects_selected.forEach((nameProject) => {
        if (
          nameProject == singleProject.name_en ||
          nameProject == singleProject.name_es
        ) {
          this.projectResume = [...this.projectResume, singleProject]
        }
      })
    })
  }

  allowSubmenuAccess(completed: boolean, submenuInserted: any) {
    // set status value in all apps where submenuinserted id is equal to app.submenu_id
    this.projects.forEach((project) => {
      project.submenus.forEach((submenu) => {
        if (submenu == null) {
          return
        }
        submenu.apps.forEach((app) => {
          if (submenuInserted.id == app.submenu_id) {
            completed ? (app.status = 1) : (app.status = 0)
          }
        })
      })
    })
    console.log(this.projects)

    // insert submenu and apps when the father submenu is selected
    // delete submenu and apps when the father submenu is deselected
    if (completed) {
      this.allowed_submenus.push({
        projects_id: submenuInserted.project_id,
        submenu_id: submenuInserted.id,
        access: completed,
      })
      submenuInserted.apps.forEach((app) => {
        if (submenuInserted.id == app.submenu_id) {
          this.allowed_apps.push({
            submenu_id: app.submenu_id,
            app_id: app.id,
            access: completed,
          })
        }
      })
    } else {
      let indexSub = this.allowed_submenus.indexOf(
        this.allowed_submenus.find(
          (sub) => sub.submenu_id == submenuInserted.id,
        ),
      )
      this.allowed_submenus.splice(indexSub, 1)

      submenuInserted.apps.forEach(() => {
        let indexApp = this.allowed_apps.indexOf(
          this.allowed_apps.find((app) => app.app_id == app.id),
        )
        this.allowed_apps.splice(indexApp, 1)
      })
    }
  }

  allowAppAccess(checkboxStatus: boolean, app: any) {
    if (checkboxStatus) {
      // insert app selected
      this.allowed_apps.push({
        submenu_id: app.submenu_id,
        app_id: app.id,
        access: checkboxStatus,
      })
    } else {
      // find and delete app selected
      let indexApp = this.allowed_apps.indexOf(
        this.allowed_apps.find((app) => app.app_id == app.id),
      )
      this.allowed_apps.splice(indexApp, 1)
    }
    console.log(this.allowed_apps)
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
    this.getData(this.active_count)
  }
}
