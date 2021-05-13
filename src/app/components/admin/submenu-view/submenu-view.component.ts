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
  public submenu_id: any
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
    this.submenu_id = this.activeRoute.snapshot.params.id

    this.projects.forEach((proj) => {
      proj.menu.forEach((sub) => {
        if (sub.id == this.submenu_id) {
          this.submenu_data = sub
          this.app_list = sub.app_list
        }
      })
    })
    console.log(this.submenu_data)
    // console.log(this.app_list)

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
          value: '',
          disabled: true,
        },
        [],
      ),
      last_update: new FormControl(
        {
          value: '',
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
    if (this.submenu_data) {
      this.createProjectForm.patchValue({
        submenu_name_es: this.submenu_data['name_es'],
        submenu_name_en: this.submenu_data['name_en'],
        // created_by: this.submenu_data['description'],
        // last_update: this.submenu_data['description'],
      })
    }
  }

  goBack() {
    this.router.navigate(['admin/projects'])
  }
}
