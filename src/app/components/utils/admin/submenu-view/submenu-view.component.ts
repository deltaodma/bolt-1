import { stringify } from '@angular/compiler/src/util'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { MockProjects } from 'src/app/mocks/projects-mock'

@Component({
  selector: 'app-submenu-view',
  templateUrl: './submenu-view.component.html',
  styleUrls: ['./submenu-view.component.scss'],
})
export class SubmenuViewComponent implements OnInit {
  public submenu_data: any
  public app_list: any = []
  public projects: any = MockProjects

  constructor(public activeRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.submenu_data = this.activeRoute.snapshot.params
    this.projects.forEach((project) => {
      if (project.id == this.submenu_data.id) {
        this.app_list = project.menu
      } else {
      }
    })
    console.log(this.app_list)

    // this.submenu_data.menu.forEach((app) => {
    //   this.app_list.push(app)
    // })
  }
  goBack() {
    this.router.navigate(['admin/projects'])
  }
}
