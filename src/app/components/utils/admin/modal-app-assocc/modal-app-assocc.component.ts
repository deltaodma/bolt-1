import { Component, Inject, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { UiService } from 'src/app/services/ui.service'
import { DialogData } from '../modal-confirmation/modal-confirmation.component'

@Component({
  selector: 'app-modal-app-assocc',
  templateUrl: './modal-app-assocc.component.html',
  styleUrls: ['./modal-app-assocc.component.scss'],
})
export class ModalAppAssoccComponent implements OnInit {
  public updateAppAssocForm: FormGroup
  public lang: string
  public hide: boolean = false
  public hide2: boolean = false
  public checked: boolean = false
  private errorMessage: any = {
    es: {
      item_name_es: 'Ingrese un nombre en español',
      item_name_en: 'Ingrese un nombre en inglés',
      item_type: 'Seleccione un tipo de aplicación',
      url: 'Ingrese una url',
      user: 'Ingrese un usuario',
      password: 'Ingrese una contraseña',
      password_confirm: 'La contraseña reescrita no coincide con su contraseña',
    },
    en: {
      item_name_es: 'Enter a name in spanish',
      item_name_en: 'enter a name in english',
      item_type: 'Select a type of application',
      url: 'Enter a url',
      user: 'Enter a username',
      password: 'Enter a password',
      password_confirm: 'The retyped password does not match your password',
    },
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public ui: UiService,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    if (this.data) {
    }
    this.initforms()
    this.loadProject()
  }

  initforms() {
    this.updateAppAssocForm = this.formBuilder.group({
      item_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      item_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      item_type: new FormControl('', [Validators.required]),
      url: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(100),
      ]),
      user: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      password_confirm: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
    })
  }

  closeModal() {
    this.ui.dismissModal(ModalAppAssoccComponent)
  }

  loadProject() {
    if (this.data) {
      this.updateAppAssocForm.patchValue({
        item_name_es: this.data['app']['item_name'],
        item_name_en: this.data['app']['item_name'],
        item_type: this.data['app']['item_icon'],
        url: this.data['app']['url'],
        user: this.data['app']['user'],
      })
    }
  }

  uploadApp() {
    if (
      this.updateAppAssocForm.invalid ||
      this.updateAppAssocForm.controls.password_confirm.value !=
        this.updateAppAssocForm.controls.password.value
    ) {
      ;(<any>Object)
        .values(this.updateAppAssocForm.controls)
        .forEach((control) => {
          control.markAsTouched()
        })
      return
    } else {
      if (!this.data) {
        // TO DO POST request

        console.log('post request')
      } else {
        // TO DO PUT request
        console.log('put')
      }
    }
  }

  public getMessageform(controlName: any): string {
    let error = ''
    const control = this.updateAppAssocForm.get(controlName)
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
}
