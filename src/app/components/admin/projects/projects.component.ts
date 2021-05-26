import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSlideToggleChange } from '@angular/material/slide-toggle'
import { Router } from '@angular/router'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { UiService } from 'src/app/services/ui.service'
import { ModalConfirmationComponent } from '../../utils/pop up/modal-confirmation/modal-confirmation.component'
import { ModalProjectFormComponent } from '../../utils/admin/projects/modal-project-form/modal-project-form.component'
import { ModalSubmenuFormComponent } from '../../utils/admin/projects/modal-submenu-form/modal-submenu-form.component'
import { ModalNotificationComponent } from '../../utils/pop up/modal-notification/modal-notification.component'
import { HttpService } from 'src/app/services/http.service'
import { environment } from 'src/environments/environment'
import { element } from 'protractor'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  public lang: string
  public projects: any = []
  // public projects: any = MockProjects
  public activeProjects: any = []
  public inactiveProjects: any = []
  public open: boolean = false
  public pages: number
  public projectPermission: boolean
  public subMenuPermission: boolean
  public message_action_es: string = 'deshabilitar'
  public message_action_en: string = 'disable'
  public active_count = 1

  constructor(
    public dialog: MatDialog,
    public ui: UiService,
    public httpService: HttpService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.httpService
      .get(environment.serverUrl + environment.projects.getAll)
      .subscribe((response: any) => {
        if (response.status >= 200 && response.status < 300) {
          // this.pages = response.body.meta.totalPages
          // this.active_count = response.body.meta.currentPage
          this.projects = response.body
          console.log(response.body)

          this.projects.forEach((project) => {
            if (project.status == 1) {
              this.activeProjects.push(project)
            } else {
              this.inactiveProjects.push(project)
            }
          })
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

  projectStatus(project, event, action) {
    if (event.checked) {
      let ProjName = project.name_es

      if (action == 'enable') {
        this.message_action_es = 'habilitar'
        this.message_action_en = 'enable'
      } else {
        this.message_action_es = 'deshabilitar'
        this.message_action_en = 'disable'
      }
      if (this.lang == 'Eng') {
        ProjName = project.name_en
      }

      const confDialog = this.dialog.open(ModalConfirmationComponent, {
        id: ModalConfirmationComponent.toString(),
        disableClose: true,
        hasBackdrop: true,
        width: '500px',
        height: 'auto',
        data: {
          project_name: ProjName,
          message_action_es: this.message_action_es,
          message_action_en: this.message_action_en,
        },
      })

      confDialog.afterClosed().subscribe((result) => {
        this.projectPermission = result
        let status
        if (this.projectPermission) {
          if (action == 'enable') {
            this.message_action_es = 'habilitó'
            this.message_action_en = 'enabled'
            status = 1
          } else {
            this.message_action_es = 'deshabilitó'
            this.message_action_en = 'disabled'
            status = 0
          }
          let projectStatusData = {
            icon: project['icon'],
            name_es: project['name_es'],
            name_en: project['name_en'],
            description_es: project['description_es'],
            description_en: project['description_en'],
            status: status,
          }
          // TO DO http request update project status
          // if 200
          let project_id = project['id']
          this.httpService
            .put(
              environment.serverUrl + environment.projects.putById + project_id,
              projectStatusData,
            )
            .subscribe((response: any) => {
              if (response.status >= 200 && response.status < 300) {
                this.ui.showModal(
                  ModalNotificationComponent,
                  '500px',
                  'auto',
                  null,
                  'backdrop',
                  {
                    message_es: `Se ${this.message_action_es} con éxito el proyecto ${project.name_es}`,
                    message_en: `Successfully ${this.message_action_en} the project ${project.name_en}`,
                  },
                )
                // show loading and reload page to update data view
                setTimeout(() => {
                  window.location.reload()
                }, 3000)
              }
            })
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
  createSubmenu(project?: any) {
    this.ui.showModal(ModalSubmenuFormComponent, '500px', 'auto', null, null, {
      project: project,
    })
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
