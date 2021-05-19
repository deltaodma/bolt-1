import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalConfirmationComponent } from 'src/app/components/utils/admin/projects/modal-confirmation/modal-confirmation.component'
import { RolFormComponent } from 'src/app/components/utils/admin/roles-and-users/rol-form/rol-form.component'
import { MockUsers } from 'src/app/mocks/user-mock'
import { UiService } from 'src/app/services/ui.service'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public lang: string
  public pages: number = 3
  public user_list: any = []
  public users: any = MockUsers
  public searchForm: FormGroup
  public active_count = 0

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public ui: UiService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.initforms()
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
    console.log('GET request find user')
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
        user_name: target.user_name,
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
