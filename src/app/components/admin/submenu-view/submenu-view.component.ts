import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'
import { HttpService } from 'src/app/services/http.service'
import { SubmenusService } from 'src/app/services/submenus.service'
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
  public subSvc: Subscription
  public lang: string
  public submenu_data: any
  public submenu_data_name: string
  public submenu_id: any
  public app_list: any = []
  public projects: any = []
  public createSubmenuForm: FormGroup
  public pages: number
  public active_count = 1

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
    private formBuilder: FormBuilder,
    public ui: UiService,
    public dialog: MatDialog,
    public httpService: HttpService,
    public submenuService: SubmenusService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.submenu_id = this.activeRoute.snapshot.params.id
    this.initforms()
    this.getData()
  }

  getData() {
    this.subSvc = this.submenuService.submenus$.subscribe((submenu: any) => {
      // this.pages = subResponse.meta.totalPages
      // this.active_count = subResponse.meta.currentPage
      console.log(submenu)
      this.submenu_data = submenu
      this.submenu_data_name =
        this.lang == 'Esp' ? submenu.name_es : submenu.name_en
      this.app_list = submenu.apps
      this.loadProject()
    })
    this.submenuService.getById(this.submenu_id)
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
    let msg_es = 'actualizado'
    let msg_en = 'updated'
    let userId = localStorage.getItem('userId')
    let submenuData = {
      name_es: this.createSubmenuForm.controls.submenu_name_es.value,
      name_en: this.createSubmenuForm.controls.submenu_name_en.value,
      updated_by: userId,
    }
    this.submenuService.updateData(target, submenuData, msg_es, msg_en)
  }

  deletedSubmenu(target: any) {
    this.submenuService.delete(target, 'eliminó', 'deleted')
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
            (this.createSubmenuForm.controls.submenu_name_en.invalid ||
              this.createSubmenuForm.controls.submenu_name_es.invalid) &&
            this.createSubmenuForm.dirty
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
      let prep = this.lang == 'Esp' ? ' el ' : ' at '
      this.createSubmenuForm.patchValue({
        submenu_name_es: this.submenu_data['name_es'],
        submenu_name_en: this.submenu_data['name_en'],
        created_by:
          this.submenu_data['user_created']['name'] +
          ' ' +
          this.submenu_data['user_created']['last_name'] +
          ' ID: ' +
          this.submenu_data['user_created']['employee_code'] +
          prep +
          new Date(this.submenu_data['created_at']).toLocaleDateString() +
          '-' +
          new Date(this.submenu_data['created_at']).toLocaleTimeString(),

        last_update:
          this.submenu_data['user_update']['name'] +
          ' ' +
          this.submenu_data['user_update']['last_name'] +
          ' ID: ' +
          this.submenu_data['user_update']['employee_code'] +
          prep +
          new Date(this.submenu_data['updated_at']).toLocaleDateString() +
          '-' +
          new Date(this.submenu_data['updated_at']).toLocaleTimeString(),
      })
    }
  }

  goBack() {
    window.history.back()
  }
}
