import { Component, OnInit } from '@angular/core'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { Banners } from 'src/app/mocks/banner-mock'
import { Router } from '@angular/router'

import { ModalAlertComponent } from '../../utils/modal-alert/modal-alert.component'
import { UiService } from 'src/app/services/ui.service'
import { TutorialComponent } from '../../utils/tutorial/tutorial.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public user = ['']
  public prop = MockProjects
  public bannerList: any = Banners

  public date = new Date().toLocaleDateString()
  public favList: any = []

  constructor(private router: Router, public ui: UiService) {}

  ngOnInit(): void {
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
    } else {
      this.openAlert()
    }
    if (!localStorage.getItem('tutorial')) {
      this.openTutorial()
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

  redirectTo(exUrl: string) {
    console.log('redireccion externa')
    window.open(exUrl)
  }

  openApp(dashboard) {
    this.router.navigate([`app-view/${dashboard}`], {
      queryParamsHandling: 'preserve',
    })
  }
}
