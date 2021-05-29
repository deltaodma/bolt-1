import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component'
import { HttpService } from './http.service'
import { UiService } from './ui.service'

@Injectable({
  providedIn: 'root',
})
export class SubmenusService {
  public lang: string
  public httpError: string

  private _submenus: any[] = []
  private _submenusSbj = new Subject<any[]>()
  public submenus$ = this._submenusSbj.asObservable()

  constructor(private httpService: HttpService, private ui: UiService) {}

  getFullBanners() {
    return this._submenus
  }

  getFullData(page?: number) {
    if (!page) {
      page = 1
    }
    this.httpService
      .get(environment.serverUrl + environment.submenus.get + '?page=' + page)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()

          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            this._submenus = response.body.items

            this._submenusSbj.next(this._submenus)
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

  getById(id: string) {
    this.httpService
      .get(environment.serverUrl + environment.submenus.getById + id)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()

          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            this._submenus = response.body
            this._submenusSbj.next(this._submenus)
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

  postData(submenuData, fun) {
    this.httpService
      .post(environment.serverUrl + environment.submenus.post, submenuData)
      .subscribe(
        (response: any) => {
          if (response.status == 201) {
            fun
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              '',
              'backdrop',
              {
                message_es: `El submenu de nombre ${submenuData.name_es} fue creado con éxito`,
                message_en: `The ${submenuData.name_en} submenu was successfully created`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          }
        },
        (e) => {
          this.httpError =
            this.lang == 'Esp'
              ? 'Ha ocurrido un error'
              : 'An error has accoured'
        },
      )
  }

  updateData(target: any, submenuData: any, msg_es: string, msg_en: string) {
    this.httpService
      .put(
        environment.serverUrl + environment.submenus.putById + target.id,
        submenuData,
      )
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito el submenú ${target.name_es}`,
                message_en: `Successfully ${msg_en} the submenu ${target.name_en}`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }

  updateStatus(target: any, msg_es: string, msg_en: string) {
    this.httpService
      .put(
        environment.serverUrl +
          environment.submenus.updateStatusById +
          target.id,
      )
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito el submenú ${target.name_es}`,
                message_en: `Successfully ${msg_en} the submenu ${target.name_en}`,
              },
            )
            setTimeout(() => {
              window.location.reload()
            }, 3000)
          }
        },
        (err) => {
          window.location.reload()
        },
      )
  }

  delete(target: any, msg_es: string, msg_en: string) {
    this.httpService
      .delete(
        environment.serverUrl + environment.submenus.deleteById + target.id,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status >= 200 && response.status < 300) {
            this.ui.showModal(
              ModalNotificationComponent,
              '500px',
              'auto',
              null,
              'backdrop',
              {
                message_es: `Se ${msg_es} con éxito el proyecto ${target.name_es}`,
                message_en: `Successfully ${msg_en} the project ${target.name_en}`,
              },
            )
            setTimeout(() => {
              window.history.back()
            }, 3000)
          }
        },
        (err) => {
          this.ui.dismissLoading()
        },
      )
  }
}