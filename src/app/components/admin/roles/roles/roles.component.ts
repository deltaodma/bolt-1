import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRoute, Router } from '@angular/router'
import { ModalConfirmationComponent } from 'src/app/components/utils/admin/projects/modal-confirmation/modal-confirmation.component'
import { RolFormComponent } from 'src/app/components/utils/admin/roles-and-users/rol-form/rol-form.component'
import { MockRoles } from 'src/app/mocks/roles-mock'
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
  public createRolForm: FormGroup
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
    console.log(this.roles)

    this.initforms()
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
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

      rol_projects: new FormControl('', []),
    })
  }

  searchUser() {
    //TO DO GET request
    console.log('GET request find user')
  }

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
