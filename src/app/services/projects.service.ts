import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ModalNotificationComponent } from '../components/utils/pop up/modal-notification/modal-notification.component'
import { HttpService } from './http.service'
import { UiService } from './ui.service'

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  public lang: string
  public httpError: string

  private _fullProjects: any[] = []
  private _fullProjectsSbj = new Subject<any[]>()
  public fullProjects$ = this._fullProjectsSbj.asObservable()

  private _simpleProjects: any[] = []
  private _simpleProjectsSbj = new Subject<any[]>()
  public simpleProjects$ = this._simpleProjectsSbj.asObservable()

  constructor(private httpService: HttpService, private ui: UiService) {}

  getFullBanners() {
    return this._fullProjects
  }

  getFullData(page?: number) {
    if (!page) {
      page = 1
    }
    this.httpService
      .get(
        environment.serverUrl + environment.projects.getAll + '?page=' + page,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()

          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            this._fullProjects = response.body

            this._fullProjectsSbj.next(this._fullProjects)
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

  postData(projectData: any, fun: any) {
    this.httpService
      .post(environment.serverUrl + environment.projects.post, projectData)
      .subscribe((response: any) => {
        if (response.status >= 200 && response.status < 300) {
          fun
        } else {
          this.httpError =
            this.lang == 'Esp'
              ? 'Ha ocurrido un error'
              : 'An error has accoured'
        }
      })
  }

  updateData(project_id: string, projectData: any, fun: any) {
    this.httpService
      .put(
        environment.serverUrl + environment.projects.putById + project_id,
        projectData,
      )
      .subscribe((response: any) => {
        if (response.status >= 200 && response.status < 300) {
          fun
        } else {
          this.httpError =
            this.lang == 'Esp'
              ? 'Ha ocurrido un error'
              : 'An error has accoured'
        }
      })
  }

  updateStatus(target: any, data: any, msg_es: string, msg_en: string) {
    this.httpService
      .put(
        environment.serverUrl + environment.projects.putById + target.id,
        data,
      )
      .subscribe((response: any) => {
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
            window.location.reload()
          }, 3000)
        }
      })
  }

  delete(target_id: string) {
    this.httpService
      .delete(
        environment.serverUrl + environment.projects.deleteById + target_id,
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

  getSimpleData() {
    this.httpService
      .get(environment.serverUrl + environment.projects.get)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()

          if (response.status >= 200 && response.status < 300) {
            this.ui.dismissLoading()
            this._simpleProjects = []
            response.body.forEach((projects) => {
              this._simpleProjects.push(projects)
            })
            console.log(this._simpleProjects)

            this._simpleProjectsSbj.next(this._simpleProjects)
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
}
