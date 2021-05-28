import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalConfirmationComponent } from 'src/app/components/utils/pop up/modal-confirmation/modal-confirmation.component'
import { RolFormComponent } from 'src/app/components/utils/admin/roles-and-users/rol-form/rol-form.component'
import { UiService } from 'src/app/services/ui.service'
import { HttpService } from 'src/app/services/http.service'
import { environment } from 'src/environments/environment'
import { Subscription } from 'rxjs'
import { UsersService } from 'src/app/services/users.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  private userSubs: Subscription
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
    public userService: UsersService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.initforms()

    this.userSubs = this.userService.users$.subscribe((users: any) => {
      this.pages = users.meta.totalPages
      this.active_count = users.meta.currentPage
      this.users = users.items
      console.log(users)
    })
    this.userService.getFullData()
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
    let user_data = this.searchForm.controls.user_id.value

    this.userSubs = this.userService.users$.subscribe((users: any) => {
      this.pages = users.meta.totalPages
      this.active_count = users.meta.currentPage
      this.users = users.items
      console.log(users)
    })
    this.userService.searchUsers(user_data)
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

  updateUserStatus(target: any) {
    this.userService.updateStatus(target.employee_code)
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
        this.updateUserStatus(target)
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

  ngOnDestroy() {
    this.userSubs.unsubscribe()
  }
}
