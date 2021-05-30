import { Component, OnInit } from '@angular/core'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { Banners } from 'src/app/mocks/banner-mock'
import { Router } from '@angular/router'

import { ModalAlertComponent } from '../../utils/pop up/modal-alert/modal-alert.component'
import { UiService } from 'src/app/services/ui.service'
import { TutorialComponent } from '../../utils/components/tutorial/tutorial.component'
import { AuthService } from 'src/app/services/auth.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public user = ['']
  public prop = MockProjects
  public banners: any = Banners
  public bannerList: any = []
  public lang: string
  public date = new Date().toLocaleDateString()
  public favList: any = []

  constructor(
    private router: Router,
    private ui: UiService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    var token = localStorage.getItem('token')
    if (!token) {
      // get url data
      function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&')
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
          results = regex.exec(url)
        if (!results) return null
        if (!results[2]) return ''
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
      }
      var authData = getParameterByName('SamlReq')
      var decodedAuthData = JSON.parse(atob(authData))
      console.log(decodedAuthData)
      // create user auth data
      token = decodedAuthData.access_token
      const userId = decodedAuthData.user.id
      const expirationDate = new Date(
        new Date().getTime() + decodedAuthData.expiresIn * 1000,
      )
      //save main user info
      localStorage.setItem('userData', JSON.stringify(decodedAuthData.user))
      // save auth data in local storage
      this.authService.saveAuthData(token, expirationDate, userId)
      // set session timer
      this.authService.setAuthTimer(decodedAuthData.expiresIn)
      // set true auth status listenner
      this.authService.setListenner()
      this.router.navigate(['/home'])
    }

    this.ui.dismissLoading()
    this.lang = localStorage.getItem('lang') || 'Esp'

    this.banners.forEach((singleBanner) => {
      if (singleBanner.status) {
        this.bannerList = [...this.bannerList, singleBanner]
      }
    })

    if (this.user && this.user.length > 0) {
      this.prop.forEach((project) => {
        project.menu.forEach((subM) => {
          subM.app_list.forEach((item) => {
            if (item.fav) {
              this.favList.push(item)
            }
          })
        })
      })
      if (!localStorage.getItem('tutorial')) {
        this.openTutorial()
      }
    } else {
      this.openAlert()
    }
  }

  openAlert() {
    this.ui.showModal(ModalAlertComponent, '500px', 'auto', '', 'backdrop')
  }
  openTutorial() {
    this.ui.showModal(
      TutorialComponent,
      '100%',
      'auto',
      'tutorial',
      'no-backdrop',
    )
  }

  redirectTo(slide: any) {
    let extUrl = slide.url_redirection
    if (slide.pdf.length != 0) {
      extUrl = slide.pdf
    }
    window.open(extUrl)
  }

  openApp(dashboard) {
    this.router.navigate([`app-view/${dashboard}`], {
      queryParamsHandling: 'preserve',
    })
  }
}
