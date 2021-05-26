import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalConfirmationComponent } from 'src/app/components/utils/pop up/modal-confirmation/modal-confirmation.component'
import { RolFormComponent } from 'src/app/components/utils/admin/roles-and-users/rol-form/rol-form.component'
import { MockUsers } from 'src/app/mocks/user-mock'
import { UiService } from 'src/app/services/ui.service'
import { HttpService } from 'src/app/services/http.service'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public lang: string
  public pages: number
  public user_list: any = []
  public users: any
  public searchForm: FormGroup
  public active_count = 1

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
    this.initforms()

    this.httpService
      .get(environment.serverUrl + environment.users.getAll)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status >= 200 && response.status < 300) {
            // this.pages = response.body.meta.totalPages
            // this.active_count = response.body.meta.currentPage
            this.ui.dismissLoading()
            this.users = response.body.items
            console.log(response.body.items)
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.searchForm = this.formBuilder.group({
      user_name: new FormControl('', []),
      country: new FormControl('', []),
      user_id: new FormControl('', []),
    })
  }

  searchUser() {
    //TO DO GET request
    if (this.searchForm.controls.user_id.value.length == 0) {
      return
    }
    this.httpService
      .get(
        environment.serverUrl +
          environment.users.getById +
          this.searchForm.controls.user_id.value,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          console.log(response)
          if (response >= 200 && response < 300) {
            this.ui.dismissLoading()
            this.users = response.body.items
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }

  // updateUser(target: any) {
  //   this.ui.showModal(
  //     CreateUserFormComponent,
  //     '500px',
  //     'auto',
  //     null,
  //     null,
  //     target,
  //   )
  // }

  addNewRol(target: any): void {
    this.ui.showModal(RolFormComponent, '500px', 'auto', null, null, {
      user: target,
    })
  }

  updateUserStatus(toogleStatus: boolean, target: any) {
    // TO DO PUT request
    this.httpService
      .put(
        environment.serverUrl +
          environment.users.updateStatusById +
          target.employee_code,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response >= 200 && response < 300) {
            this.ui.dismissLoading()
            window.location.reload()
          }
        },
        (err) => {
          this.ui.dismissLoading()
          window.location.reload()
        },
      )
  }

  showConfirmation(target: any, message_es: string, message_en: string) {
    if (target.status == 1) {
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
        user_name: target.name + ' ' + target.last_name,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ui.showLoading()
        let toogle = !target.active
        this.updateUserStatus(toogle, target)
      } else {
        window.location.reload()
      }
    })
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
