import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { UiService } from 'src/app/services/ui.service'
import { ModalConfirmationComponent } from '../../utils/admin/modal-confirmation/modal-confirmation.component'
import { ModalNotificationComponent } from '../../utils/modal-notification/modal-notification.component'

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
  public projectPermission: boolean
  public subMenuPermission: boolean
  public forceState: boolean
  public forceStateSub: boolean

  constructor(public ui: UiService, public dialog: MatDialog) {}

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

  receiveMessage($event) {
    this.projectPermission = $event
    console.log(this.projectPermission)
  }

  projectStatus(project, event: MatSlideToggleChange) {
    if (event.checked) {
      const confDialog = this.dialog.open(ModalConfirmationComponent, {
        id: ModalConfirmationComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
        data: {
          project_name: project.name,
        },
      })

      confDialog.afterClosed().subscribe((result) => {
        this.projectPermission = result
        if (this.projectPermission) {
          // TO DO http request update project status
          // if 200
          this.ui.showModal(
            ModalNotificationComponent,
            '500px',
            'auto',
            null,
            null,
            {
              message_es: `Se deshabilito con éxito el proyecto ${project.name}`,
              message_en: `Successfully disabled the project ${project.name}`,
            },

            // show loading and reload page to update data view
          )
        } else {
          console.log(event)
        }
      })
    }
  }

  subMenuDisable(submenu, event: MatSlideToggleChange) {
    if (!event.checked) {
      const confDialog = this.dialog.open(ModalConfirmationComponent, {
        id: ModalConfirmationComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
        data: {
          submenu_name: submenu.name,
        },
      })

      confDialog.afterClosed().subscribe((result) => {
        this.projectPermission = result
        if (this.projectPermission) {
          // TO DO http request update project status
          this.ui.showLoading()
          setTimeout(() => {
            this.ui.dismissLoading()
          }, 2000)
        } else {
          console.log(event)
        }
      })
    }
  }
}
