import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MockProjects } from 'src/app/mocks/projects-mock'

@Component({
  selector: 'app-embed-view',
  templateUrl: './embed-view.component.html',
  styleUrls: ['./embed-view.component.scss'],
})
export class EmbedViewComponent implements OnInit {
  public ext_id: string
  public objEmbed = MockProjects
  public elementProps = []
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.ext_id = this.router.url.replace('/app-view/', '')

    this.objEmbed.forEach((project) => {
      project.menu.forEach((subM) => {
        subM.app_list.forEach((item) => {
          if (item.id == this.ext_id) {
            this.elementProps.push(item)
          }
        })
      })
    })
  }
}
