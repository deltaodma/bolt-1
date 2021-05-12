import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { MockProjects } from 'src/app/mocks/projects-mock'
import { UiService } from 'src/app/services/ui.service'

@Component({
  selector: 'app-submenu-view',
  templateUrl: './submenu-view.component.html',
  styleUrls: ['./submenu-view.component.scss'],
})
export class SubmenuViewComponent implements OnInit {
  public lang: string
  public submenu_data: any
  public app_list: any = []
  public projects: any = MockProjects
  public createProjectForm: FormGroup

  private errorMessage: any = {
    es: {
      submenu_name_es: 'Ingrese un nombre de sub menú en español',
      submenu_name_en: 'Ingrese un nombre de sub menú en inglés',
    },
    en: {
      submenu_name_es: 'Enter a sub menu name in spanish',
      submenu_name_en: 'Enter a sub menu name in english',
    },
  }
  constructor(
    public activeRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public ui: UiService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.submenu_data = this.activeRoute.snapshot.params
    this.projects.forEach((project) => {
      if (project.id == this.submenu_data.id) {
        this.app_list = project.menu
      } else {
      }
    })
    this.initforms()
    this.loadProject()
  }

  initforms() {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.createProjectForm = this.formBuilder.group({
      submenu_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      submenu_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      created_by: new FormControl(
        {
          value: 'Andres montenegro ID:93844 el 24/07/2021-08:34:69',
          disabled: true,
        },
        [],
      ),
      last_update: new FormControl(
        {
          value: 'Sofia Herrera ID:93784 el 16/08/2021-08:34:69',
          disabled: true,
        },
        [],
      ),
      icon: new FormControl('', [Validators.required]),
    })
  }

  saveProject(): void {
    if (this.createProjectForm.invalid) {
      ;(<any>Object)
        .values(this.createProjectForm.controls)
        .forEach((control) => {
          control.markAsTouched()
        })
      return
    } else {
    }
  }
  public getMessageform(controlName: any): string {
    let error = ''
    const control = this.createProjectForm.get(controlName)
    if (control.touched && control.errors) {
      if (this.lang == 'Esp') {
        error = this.errorMessage['es'][controlName]
      }
      if (this.lang == 'Eng') {
        error = this.errorMessage['en'][controlName]
      }
    }
    return error
  }

  loadProject() {
    // if (this.data) {
    //   this.createProjectForm.patchValue({
    //     submenu_name_es: this.data.project['name'],
    //     submenu_name_en: this.data.project['name'],
    //     created_by: this.data.project['description'],
    //     last_update: this.data.project['description'],
    //     icon: this.data.project['icon'],
    //   })
    // }
  }

  goBack() {
    this.router.navigate(['admin/projects'])
  }
}
