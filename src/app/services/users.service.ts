import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component'
import { HttpService } from './http.service'
import { UiService } from './ui.service'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public lang: string

  private _users: any[] = []
  private _userSbj = new Subject<any[]>()
  public users$ = this._userSbj.asObservable()

  constructor(private httpService: HttpService, private ui: UiService) {}

  getUsers() {
    return this._users
  }

  getFullData() {
    this.httpService
      .get(environment.serverUrl + environment.users.getAll)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()

          if (response.status == 200) {
            this.ui.dismissLoading()
            this._users = response.body
            this._userSbj.next(this._users)
          } else {
            // TODO :: logic for error
            this.ui.dismissLoading()
          }
        },
        (error) => {
          // TODO :: logic for error
          this.ui.dismissLoading()
        },
      )
  }

  searchUsers(user_data: any) {
    this.httpService
      .get(environment.serverUrl + environment.users.getById + user_data)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()

          if (response.status == 200) {
            this.ui.dismissLoading()
            this._users = []

            response.body.forEach((users) => {
              this._users.push(users)
            })
            this._userSbj.next(this._users)
          } else {
            // TODO :: logic for error
            this.ui.dismissLoading()
          }
        },
        (error) => {
          // TODO :: logic for error
          this.ui.dismissLoading()
        },
      )
  }

  updateStatus(employee_code: string) {
    this.httpService
      .get(
        environment.serverUrl +
          environment.users.updateStatusById +
          employee_code,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()

          if (response.status == 200) {
            this.ui.dismissLoading()
            window.location.reload()
          } else {
            // TODO :: logic for error
            this.ui.dismissLoading()

            setTimeout(() => {
              window.location.reload()
            }, 3000)
          }
        },
        (error) => {
          // TODO :: logic for error
          this.ui.dismissLoading()

          setTimeout(() => {
            window.location.reload()
          }, 3000)
        },
      )
  }

  updateUserRoles(userRoles: any, fun: any) {
    let user_name = userRoles['name'] + ' ' + userRoles['last_name']
    this.httpService
      .put(
        environment.serverUrl +
          environment.users.putById +
          userRoles['employee_code'],
        userRoles,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status == 200) {
            this.ui.dismissLoading()
            fun
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              '',
              'backdrop',
              {
                message_es: `Los roles del usuario con nombre ${user_name} fueron actualizados con éxito`,
                message_en: `The roles of the user ${user_name} were updated successfully`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          } else {
            this.ui.dismissLoading()
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }
}
