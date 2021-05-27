import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'
import { HttpService } from './http.service'
import { UiService } from './ui.service'

@Injectable({
  providedIn: 'root',
})
export class BannersService {
  private _banners: any[] = []
  private _bannersSbj = new Subject<any[]>()
  public banners$ = this._bannersSbj.asObservable()

  constructor(private httpService: HttpService, private ui: UiService) {}

  getBanners() {
    return this._banners
  }

  getDataBanners() {
    this.httpService
      .get(environment.serverUrl + environment.banners.getAll)
      .subscribe(
        (response: any) => {
          if (response.status >= 200 && response.status < 300) {
            this._banners = []
            response.body.items.forEach((banner) => {
              this._banners.push(banner)
            })
            this._bannersSbj.next(this._banners)
            console.log(this._banners)
          } else {
            // TODO :: logic for error
          }
        },
        (error) => {
          // TODO :: logic for error
        },
      )
  }

  update(data: any) {
    this.httpService
      .post(environment.serverUrl + environment.banners.post, data)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status == 200) {
            this.ui.dismissLoading()
            console.log('An error has occured during the post request')
            window.location.reload()
          } else {
            this.ui.dismissLoading()
            console.log('An error has occured during the post request')
          }
        },
        (error) => {
          this.ui.dismissLoading()
          console.log('An error has occured during the post request: ' + error)
        },
      )
  }

  delete(target_id: string) {
    this.httpService
      .delete(
        environment.serverUrl + environment.banners.deleteById + target_id,
      )
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status == 200) {
            this.ui.dismissLoading()
            console.log('banner deleted successfully')
            window.location.reload()
          } else {
            this.ui.dismissLoading()
            console.log('An error has occured during the delete request')
          }
        },
        (error) => {
          this.ui.dismissLoading()
          console.log(
            'An error has occured during the delete request: ' + error,
          )
        },
      )
  }

  changeStatus(target_id: string) {
    this.httpService
      .put(environment.serverUrl + environment.banners.upload + target_id)
      .subscribe(
        (response: any) => {
          this.ui.showLoading()
          if (response.status == 200) {
            this.ui.dismissLoading()
            window.location.reload()
          } else {
            //  TO DO show http error
            this.ui.dismissLoading()
            console.log('An error has occured during the update request')
          }
        },
        (error) => {
          // TODO :: logic for error
          console.log(
            'An error has occured during the update request: ' + error,
          )
        },
      )
  }
}
