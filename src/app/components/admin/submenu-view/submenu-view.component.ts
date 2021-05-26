import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { HttpService } from 'src/app/services/http.service'
import { UiService } from 'src/app/services/ui.service'
import { environment } from 'src/environments/environment'
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
  public submenu_data_name: string
  public submenu_id: any
  public app_list: any = []
  public projects: any = []
  public createSubmenuForm: FormGroup

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
    public httpService: HttpService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.submenu_id = this.activeRoute.snapshot.params.id
    this.ui.showLoading()
    this.initforms()

    this.httpService
      .get(environment.serverUrl + environment.projects.getAll)
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            // this.pages = response.body.meta.totalPages
            // this.active_count = response.body.meta.currentPage
            this.ui.dismissLoading()
            this.projects = response.body
            this.projects.forEach((proj) => {
              proj.submenus.forEach((sub) => {
                if (sub.id == this.submenu_id) {
                  this.submenu_data = sub
                  this.submenu_data_name =
                    this.lang == 'Esp' ? sub.name_es : sub.name_en
                  this.app_list = sub.apps
                }
              })
            })
            this.loadProject()
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.createSubmenuForm = this.formBuilder.group({
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
    let submenuData = {
      project_id: target.id,
      name_es: this.createSubmenuForm.controls.submenu_name_es.value,
      name_en: this.createSubmenuForm.controls.submenu_name_en.value,
      description_en: 'target.description_en',
      description_es: 'target.description_es',
      updated_by: target.updated_by,
      created_by: target.created_by,
      status: target.status,
    }
    this.httpService
      .put(
        environment.serverUrl + environment.submenus.putById + target.id,
        submenuData,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            window.location.reload()
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }

  deletedSubmenu(target: any) {
    this.httpService
      .delete(
        environment.serverUrl + environment.submenus.deleteById + target.id,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status >= 200 && response.status < 300) {
            this.router.navigate(['admin/projects'])
            window.location.reload()
          }
        },
        (err) => {
          this.ui.dismissLoading()
          window.location.reload()
        },
      )
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
    let status
    if (toogleStatus) {
      status = 1
    } else {
      status = 0
    }

    // TO DO PUT request
    this.httpService
      .put(
        environment.serverUrl + environment.apps.updateStatusById + target.id,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            window.location.reload()
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
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
            this.createSubmenuForm.controls.submenu_name_en.invalid ||
            this.createSubmenuForm.controls.submenu_name_es.invalid
          ) {
            ;(<any>Object)
              .values(this.createSubmenuForm.controls)
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
    const control = this.createSubmenuForm.get(controlName)
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
      this.createSubmenuForm.patchValue({
        submenu_name_es: this.submenu_data['name_es'],
        submenu_name_en: this.submenu_data['name_en'],
        created_by: this.submenu_data['created_by'],
        last_update: this.submenu_data['updated_by'],
      })
    }
  }

  goBack() {
    this.router.navigate(['admin/projects'])
  }
}
