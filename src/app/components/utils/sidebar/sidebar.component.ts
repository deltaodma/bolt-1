import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { MockProjects } from 'src/app/mocks/projects-mock'
import { UiService } from 'src/app/services/ui.service'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public lang: string
  public userName: string = 'Pedro'
  public arrowType: string = 'arrow_forward_ios'
  public checked: boolean = false
  public favList: any = []
  public role: string = 'admin'
  public sideStatus: boolean = false
  public prop = MockProjects

  constructor(private router: Router, private ui: UiService) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
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

  openSidebar() {
    let innerArrow = document.querySelector('#arrowSide')
    let sidebar = document.querySelector('#sidebar')
    this.sideStatus = !this.sideStatus
    if (this.sideStatus) {
      sidebar.setAttribute('style', 'transform: translateX(-267px)')

      innerArrow.setAttribute('style', 'transform: rotate(0deg) ')
    } else {
      sidebar.setAttribute('style', 'transform: translateX(0px)')

      innerArrow.setAttribute('style', 'transform: rotate(180deg) ')
    }
  }

  menuOpened(item) {
    let menu = document.getElementById(item)
    menu.classList.add('highlight-item')
  }

  menuClosed(item) {
    let menu = document.getElementById(item)
    menu.classList.remove('highlight-item')
  }

  arrowRotate(state: boolean, id?: number | string) {
    let actArrow = document.getElementById('arrowH' + id)
    let extArrow = document.getElementById('arrowE' + id)

    let actHeader = document.getElementById('panel' + id)
    let extHeader = document.getElementById('ext' + id)

    let actIcon = document.getElementById('iconH' + id)
    let extIcon = document.getElementById('iconE' + id)

    if (typeof id == 'string') {
      if (state) {
        extArrow.classList.add('arrowDown')
        extArrow.classList.remove('arrowUp')
        extHeader.classList.add('bg-black-panel')
        extIcon.classList.remove('menu-icon')
      } else {
        extArrow.classList.add('arrowUp')
        extArrow.classList.remove('arrowDown')
        extHeader.classList.remove('bg-black-panel')
        extIcon.classList.add('menu-icon')
      }
    } else {
      if (state) {
        actArrow.classList.add('arrowDown')
        actArrow.classList.remove('arrowUp')
        actHeader.classList.add('bg-black-panel')
        actIcon.classList.remove('menu-icon')
      } else {
        actArrow.classList.add('arrowUp')
        actArrow.classList.remove('arrowDown')
        actHeader.classList.remove('bg-black-panel')
        actIcon.classList.add('menu-icon')
      }
    }
  }

  updateFav(event, element) {
    if (this.favList.length < 6) {
      if (event) {
        this.favList.push(element)
        // TO DO
        // http request to insert a new element in the list
        return
      } else {
        this.favList.splice(element, 1)
        // TO DO
        // http request to remove the element in the list
        return
      }
    } else {
      if (event) {
        this.ui.createSnackbar(
          'Excedió el número de favoritos para poder asignar un nuevo tablero debe eliminar uno de los que tienes en la sección ',
          'x',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'snack-alert',
          },
        )
      }
    }
  }

  openApp(dashboard) {
    this.router.navigate([`app-view/${dashboard}`], {
      queryParamsHandling: 'preserve',
    })
  }
}
