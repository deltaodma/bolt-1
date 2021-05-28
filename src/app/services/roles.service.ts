import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { HttpService } from './http.service'
import { UiService } from './ui.service'

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  public lang: string
  public httpError: string

  private _roles: any[] = []
  private _rolesSbj = new Subject<any[]>()
  public roles$ = this._rolesSbj.asObservable()

  constructor(private httpService: HttpService, private ui: UiService) {}

  getFullData() {
    this.httpService
      .get(environment.serverUrl + environment.roles.getAll)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            this._roles = response.body
            this._rolesSbj.next(this._roles)
          } else {
            // TODO :: logic for error
            this.ui.dismissLoading()
            this.httpError =
              this.lang == 'Esp'
                ? 'Ha ocurrido un error'
                : 'An error has accoured'
          }
        },
        (error) => {
          // TODO :: logic for error
          this.ui.dismissLoading()
          this.httpError =
            this.lang == 'Esp'
              ? 'Ha ocurrido un error'
              : 'An error has accoured'
        },
      )
  }

  postData(projectData: any) {
    this.httpService
      .post(environment.serverUrl + environment.roles.post, projectData)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            window.location.reload()
          } else {
            this.ui.dismissLoading()
            this.httpError =
              this.lang == 'Esp'
                ? 'Ha ocurrido un error'
                : 'An error has accoured'
          }
        },
        (err) => {
          this.ui.dismissLoading()
          this.httpError =
            this.lang == 'Esp'
              ? 'Ha ocurrido un error'
              : 'An error has accoured'
        },
      )
  }

  updateData(project_id: string, projectData: any) {
    this.httpService
      .put(
        environment.serverUrl + environment.roles.putById + project_id,
        projectData,
      )
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            window.location.reload()
          } else {
            this.ui.dismissLoading()
            this.httpError =
              this.lang == 'Esp'
                ? 'Ha ocurrido un error'
                : 'An error has accoured'
          }
        },
        (err) => {
          this.ui.dismissLoading()
          this.httpError =
            this.lang == 'Esp'
              ? 'Ha ocurrido un error'
              : 'An error has accoured'
        },
      )
  }

  updateStatus(target_id: string) {
    this.httpService
      .put(
        environment.serverUrl + environment.roles.updateStatusById + target_id,
      )
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            window.location.reload()
          } else {
            // TODO :: logic for error
            this.ui.dismissLoading()
            this.httpError =
              this.lang == 'Esp'
                ? 'Ha ocurrido un error'
                : 'An error has accoured'
          }
        },
        (error) => {
          // TODO :: logic for error
          this.ui.dismissLoading()
          this.httpError =
            this.lang == 'Esp'
              ? 'Ha ocurrido un error'
              : 'An error has accoured'
        },
      )
  }

  delete(target_id: string) {
    this.httpService
      .delete(environment.serverUrl + environment.roles.deleteById + target_id)
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
}
