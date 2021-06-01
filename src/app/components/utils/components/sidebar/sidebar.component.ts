import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'

import { MockProjects } from 'src/app/mocks/projects-mock'
import { AuthService } from 'src/app/services/auth.service'
import { HttpService } from 'src/app/services/http.service'
import { UiService } from 'src/app/services/ui.service'
import { environment } from 'src/environments/environment'
import { ModalConfirmationComponent } from '../../pop up/modal-confirmation/modal-confirmation.component'
import { ModalNotificationComponent } from '../../pop up/modal-notification/modal-notification.component'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public lang: string
  public arrowType: string = 'arrow_forward_ios'
  public checked: boolean = false
  public favList: any = []
  public isAdmin: boolean = false
  public isAuth: boolean = false
  public sideStatus: boolean = false
  public prop = MockProjects
  public sideMemory: string
  public collapseAll: boolean = false

  constructor(
    private router: Router,
    private ui: UiService,
    public dialog: MatDialog,
    private httpService: HttpService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.isAdmin = this.authService.isAdministrator()
    this.isAuth = this.authService.isAuthenticated()
    this.sideMemory = sessionStorage.getItem('sidebarStatus') || 'open'

    if (this.sideMemory == 'close') {
      this.sideStatus = false
    } else {
      this.sideStatus = true
    }
    this.prop.forEach((project) => {
      project.menu.forEach((subM) => {
        subM.app_list.forEach((item) => {
          if (item.fav) {
            this.favList.push(item)
          }
        })
      })
    })
    this.openSidebar()
    // this.httpService
    //   .get(environment.serverUrl + environment.projects.getAll)
    //   .subscribe((response: any) => {
    //     // console.log(response.body)
    //   })
  }

  openSidebar() {
    let innerArrow = document.querySelector('#arrowSide')
    let sidebar = document.querySelector('#sidebar')

    this.sideStatus = !this.sideStatus
    if (this.sideStatus) {
      this.collapseAll = false

      sessionStorage.setItem('sidebarStatus', 'close')

      sidebar.setAttribute('style', 'width: 80px !important')

      innerArrow.setAttribute('style', 'transform: rotate(0deg) ')
    } else {
      this.collapseAll = true
      sessionStorage.setItem('sidebarStatus', 'open')
      sidebar.setAttribute('style', 'width: 267px !important')
      innerArrow.setAttribute('style', 'transform: rotate(180deg)')
    }
  }

  menuOpened(item) {
    let menu = document.getElementById(item)
    let overlay = document.getElementsByClassName(
      'cdk-overlay-connected-position-bounding-box',
    )
    menu.classList.add('highlight-item')
    overlay[0].setAttribute(
      'style',
      'transform: translateX(211px) translateY(-36px) ;left: 0 !important;',
    )
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
    let message_action_es
    let message_action_en
    let connector_es
    let connector_en
    console.log(event, element)

    if (this.favList.length < 6) {
      if (event) {
        message_action_es = 'agregar'
        message_action_en = 'add'
        // push elements in the array
        this.favList.push(element)
      } else {
        message_action_es = 'eliminar'
        message_action_en = 'delete'
        let elemtFav = this.favList.indexOf(element)
        // deletet element in the array
        this.favList.splice(elemtFav, elemtFav)
      }

      const confDialog = this.dialog.open(ModalConfirmationComponent, {
        id: ModalConfirmationComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
        data: {
          fav_name: element.item_name,
          message_action_es: message_action_es,
          message_action_en: message_action_en,
        },
      })

      confDialog.afterClosed().subscribe((result) => {
        // if confirmation is true
        if (result) {
          // if event is true = add
          if (event) {
            // TO DO  http POST request to insert a new element in the list
            // if 200
            let response = 200
            if (response == 200) {
              message_action_es = 'agregó'
              message_action_en = 'added'
              connector_es = 'a'
              connector_en = 'to'
            } else {
              window.location.reload()
            }
          } else {
            // TO DO  http UPDATE request to insert a new element in the list
            // if 200
            let response = 200
            if (response == 200) {
              message_action_es = 'eliminó'
              message_action_en = 'deleted'
              connector_es = 'de'
              connector_en = 'of'
            } else {
              window.location.reload()
            }
          }

          // show modal notificacion to the user
          this.ui.showModal(
            ModalNotificationComponent,
            '500px',
            'auto',
            null,
            'backdrop',
            {
              message_es: `Se ${message_action_es} con éxito la aplicación ${
                element.item_name + ' ' + connector_es
              }  tu lista de favoritos`,
              message_en: `Successfully ${message_action_en} the app ${
                element.item_name + ' ' + connector_en
              } you favorite list`,
            },
          )
          // show loading and reload page to update data view
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          window.location.reload()
        }
      })
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

  openApp(dashboard: string) {
    this.router.navigate([`app-view/${dashboard}`], {
      queryParamsHandling: 'preserve',
    })
  }
  adminRedirect(route: string) {
    this.router.navigate([`admin/${route}`], {
      queryParamsHandling: 'preserve',
    })
  }

  showConfirmation(event, element, message_action_es, message_action_en) {
    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        fav_name: element.item_name,
        message_action_es: message_action_es,
        message_action_en: message_action_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        // TO DO http request update project status
        // if 200
        if (event == 'enable') {
          message_action_es = 'agregó'
          message_action_en = 'added'
        } else {
          message_action_es = 'eliminó'
          message_action_en = 'deleted'
        }
        this.ui.showModal(
          ModalNotificationComponent,
          '500px',
          'auto',
          null,
          'backdrop',
          {
            message_es: `Se ${message_action_es} con éxito el proyecto ${element.name_es}`,
            message_en: `Successfully ${message_action_en} the project ${element.name_en}`,
          },
        )
        // show loading and reload page to update data view
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        window.location.reload()
      }
    })
  }
}
