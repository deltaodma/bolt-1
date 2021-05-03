import { Component, OnInit } from '@angular/core'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { Banners } from 'src/app/mocks/banner-mock'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public prop = MockProjects
  public bannerList: any = Banners

  public date = new Date().toLocaleDateString()
  public favList: any = []

  constructor() {}

  ngOnInit(): void {
    this.prop.forEach((project) => {
      project.menu.forEach((subM) => {
        subM.app_list.forEach((item) => {
          if (item.fav) {
            this.favList.push(item)
          }
        })
      })
    })
  }

  redirectTo(exUrl: string) {
    console.log('redireccion externa')
    window.open(exUrl)
  }

  openApp(dashboard) {
    console.log(dashboard)
    // this.router.navigate(["home"], { queryParamsHandling: "preserve" });
  }
}
