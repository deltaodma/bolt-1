import { Component, OnInit } from '@angular/core'
import { MockProjects } from 'src/app/mocks/projects-mock'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  public lang: string
  public projects: any = MockProjects
  public activeProjects: any = []
  public inactiveProjects: any = []
  public open: boolean = false
  public pages: number = 6
  constructor() {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'

    this.projects.forEach((project) => {
      if (project.active) {
        this.activeProjects.push(project)
      } else {
        this.inactiveProjects.push(project)
      }
    })
  }

  openPanel(id?: number | string) {
    this.open = !this.open
    let submenu = document.getElementById('submenu' + id)
    let extArrow = document.getElementById('arrowProject' + id)
    let box = document.getElementById('box' + id)

    if (this.open) {
      extArrow.classList.add('arrowDown')
      extArrow.classList.remove('arrowUp')
      submenu.classList.add('background-grey')
      submenu.classList.remove('background-transparent')
      box.setAttribute('style', 'display:inline')
    } else {
      extArrow.classList.add('arrowUp')
      extArrow.classList.remove('arrowDown')
      submenu.classList.add('background-transparent')
      submenu.classList.remove('background-grey')
      box.setAttribute('style', 'display:none')
    }
  }
}
