import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { Router } from '@angular/router'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { UiService } from 'src/app/services/ui.service'
import { ModalConfirmationComponent } from '../../utils/admin/projects/modal-confirmation/modal-confirmation.component'
import { ModalProjectFormComponent } from '../../utils/admin/projects/modal-project-form/modal-project-form.component'
import { ModalSubmenuFormComponent } from '../../utils/admin/projects/modal-submenu-form/modal-submenu-form.component'
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
  public pages: number
  public projectPermission: boolean
  public subMenuPermission: boolean
  public message_action_es: string = 'deshabilitar'
  public message_action_en: string = 'disable'
  public active_count = 0

  constructor(
    public ui: UiService,
    public router: Router,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.pages = 6
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
  }

  projectStatus(project, event, action) {
    if (event.checked) {
      if (action == 'enable') {
        this.message_action_es = 'habilitar'
        this.message_action_en = 'enable'
      } else {
        this.message_action_es = 'deshabilitar'
        this.message_action_en = 'disable'
      }
      const confDialog = this.dialog.open(ModalConfirmationComponent, {
        id: ModalConfirmationComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
        data: {
          project_name: project.name,
          message_action_es: this.message_action_es,
          message_action_en: this.message_action_en,
        },
      })

      confDialog.afterClosed().subscribe((result) => {
        this.projectPermission = result
        if (this.projectPermission) {
          // TO DO http request update project status
          // if 200
          if (action == 'enable') {
            this.message_action_es = 'habilitó'
            this.message_action_en = 'enabled'
          } else {
            this.message_action_es = 'deshabilitó'
            this.message_action_en = 'disabled'
          }
          this.ui.showModal(
            ModalNotificationComponent,
            '500px',
            'auto',
            null,
            'backdrop',
            {
              message_es: `Se ${this.message_action_es} con éxito el proyecto ${project.name}`,
              message_en: `Successfully ${this.message_action_en} the project ${project.name}`,
            },
          )
          // show loading and reload page to update data view
          setTimeout(() => {
            window.location.reload()
          }, 3000)
        } else {
          window.location.reload()
        }
      })
    }
  }

  subMenuDisable(submenuName, event: MatSlideToggleChange) {
    let message_es
    let message_en
    if (event.checked == false) {
      message_es = 'deshabilitar'
      message_en = 'disable'
    } else {
      message_es = 'habilitar'
      message_en = 'enable'
    }
    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        submenu_name: submenuName,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      this.projectPermission = result
      if (this.projectPermission) {
        // TO DO http request update project status
        this.ui.showLoading()
        setTimeout(() => {
          this.ui.dismissLoading()
          window.location.reload()
        }, 2000)
      } else {
        window.location.reload()
      }
    })
  }

  createProject(project?: any) {
    if (!project) {
      this.ui.showModal(ModalProjectFormComponent, '500px', 'auto', null, null)
    } else {
      this.ui.showModal(
        ModalProjectFormComponent,
        '500px',
        'auto',
        null,
        null,
        {
          project: project,
        },
      )
    }
  }
  createSubmenu() {
    this.ui.showModal(ModalSubmenuFormComponent, '500px', 'auto', null, null)
  }

  updatePage(page: string) {
    if (page == 'start') {
      this.active_count = 0
    }
    if (page == 'prev') {
      this.active_count--
    }
    if (page == 'next') {
      this.active_count++
    }
    if (page == 'last') {
      this.active_count = this.pages
    }
    // TO DO active elements GET request
  }

  editSubMenu(submenuId: string) {
    this.router.navigate([`admin/projects/submenu/${submenuId}`], {
      queryParamsHandling: 'preserve',
    })
  }
}
