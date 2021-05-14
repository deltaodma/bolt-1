import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalConfirmationComponent } from 'src/app/components/utils/admin/projects/modal-confirmation/modal-confirmation.component'
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

  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public ui: UiService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    console.log(this.users)

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

  addNewRol(target: any): void {
    // TO DO PUT req
    console.log('POST request', target)
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

  createNewUser() {}

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
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ui.showLoading()
      } else {
        window.location.reload()
      }
    })
  }
}
