import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { UiService } from 'src/app/services/ui.service'
import { ModalAppAssoccComponent } from '../../utils/admin/projects/modal-app-assocc/modal-app-assocc.component'
import { ModalConfirmationComponent } from '../../utils/pop up/modal-confirmation/modal-confirmation.component'

@Component({
  selector: 'app-submenu-view',
  templateUrl: './submenu-view.component.html',
  styleUrls: ['./submenu-view.component.scss'],
})
export class SubmenuViewComponent implements OnInit {
  public lang: string
  public submenu_data: any
  public submenu_id: any
  public app_list: any = []
  public projects: any = MockProjects
  public createProjectForm: FormGroup

  private errorMessage: any = {
    es: {
      submenu_name_es: 'Ingrese un nombre de sub menú en español',
      submenu_name_en: 'Ingrese un nombre de sub menú en inglés',
    },
    en: {
      submenu_name_es: 'Enter a sub menu name in spanish',
      submenu_name_en: 'Enter a sub menu name in english',
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
    this.submenu_id = this.activeRoute.snapshot.params.id

    this.projects.forEach((proj) => {
      proj.menu.forEach((sub) => {
        if (sub.id == this.submenu_id) {
          this.submenu_data = sub
          this.app_list = sub.app_list
        }
      })
    })
    this.initforms()
    this.loadProject()
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.createProjectForm = this.formBuilder.group({
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
      created_by: new FormControl(
        {
          value: '',
          disabled: true,
        },
        [],
      ),
      last_update: new FormControl(
        {
          value: '',
          disabled: true,
        },
        [],
      ),
      icon: new FormControl('', [Validators.required]),
    })
  }

  updateSubmenu(target: any): void {
    // TO DO PUT req
    console.log('put request', target)
    let response = 400
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

  deletedSubmenu(target: any) {
    // TO DO DELETE req
    console.log('delete request', target)
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

  updateAppAssoc(app?: any) {
    if (!app) {
      this.ui.showModal(ModalAppAssoccComponent, '500px', 'auto', null, null)
    } else {
      this.ui.showModal(ModalAppAssoccComponent, '500px', 'auto', null, null, {
        app: app,
      })
    }
  }

  updateAppStatus(toogleStatus: boolean, target: any) {
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

  showConfirmation(
    target: any,
    operation: any,
    message_es: string,
    message_en: string,
  ) {
    let submenuName = target.name_es
    let appName
    if (operation == 'updateAppStatus') {
      appName = target.item_name
      if (target.active == true) {
        message_es = 'deshabilitar'
        message_en = 'disable'
      }
    }
    if (this.lang == 'Eng') {
      submenuName = target.name_en
    }

    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        submenu_name: submenuName,
        app_name: appName,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ui.showLoading()
        if (operation == 'deletedSubmenu') {
          this.deletedSubmenu(target)
        } else if (operation == 'updateSubmenu') {
          if (
            this.createProjectForm.controls.submenu_name_en.invalid ||
            this.createProjectForm.controls.submenu_name_es.invalid
          ) {
            ;(<any>Object)
              .values(this.createProjectForm.controls)
              .forEach((control) => {
                control.markAsTouched()
              })
            return
          } else {
            this.updateSubmenu(target)
          }
        } else if (operation == 'updateAppStatus') {
          let toogle = !target.active
          this.updateAppStatus(toogle, target)
        }
      } else {
        window.location.reload()
      }
    })
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

  loadProject() {
    if (this.submenu_data) {
      this.createProjectForm.patchValue({
        submenu_name_es: this.submenu_data['name_es'],
        submenu_name_en: this.submenu_data['name_en'],
      })
    }
  }

  goBack() {
    this.router.navigate(['admin/projects'])
  }
}
