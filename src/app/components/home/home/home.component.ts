import { Component, OnInit } from '@angular/core'
import { MockProjects } from 'src/app/mocks/projects-mock'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public date = new Date().toLocaleDateString()
  public prop = MockProjects
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

  redirectTo() {
    console.log('redireccion externa')
  }

  openApp(dashboard) {
    console.log(dashboard)
  }
}
