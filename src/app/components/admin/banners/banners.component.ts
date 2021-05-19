import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { UiService } from 'src/app/services/ui.service'
import { ModalConfirmationComponent } from '../../utils/admin/projects/modal-confirmation/modal-confirmation.component'
import { Banners } from '../../../mocks/banner-mock'

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss'],
})
export class BannersComponent implements OnInit {
  public lang: string
  public bannerForm: FormGroup
  public banner_list: any = Banners
  public redirec_option: boolean = false
  public sizeError: boolean = false
  public sizeErrorPdf: boolean = false
  public pdfFileName: string = ''
  public imgFileName: string = ''

  private errorMessage: any = {
    es: {
      banner_name_es: 'Ingrese un nombre de proyecto en español',
      banner_name_en: 'Ingrese un nombre de proyecto en inglés',
      button_text_es: 'Ingrese un texto para el botón en español',
      button_text_en: 'Ingrese un texto para el botón en inglés',
      message_es: 'Ingrese una descripción en español',
      message_en: 'Ingrese una descripción en inglés',
      role_projects: 'Seleccione por lo menos un proyecto',
    },
    en: {
      rol_name_es: 'Enter a name in spanish',
      rol_name_en: 'Enter a name in english',
      button_text_es: 'Enter a button text in spanish',
      button_text_en: 'Enter a button text in english',
      message_es: 'Enter a description in spanish',
      message_en: 'Enter a description in english',
      role_projects: 'Select a least one',
    },
  }
  constructor(
    private formBuilder: FormBuilder,
    public ui: UiService,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.initforms()
  }
  initforms() {
    this.bannerForm = this.formBuilder.group({
      banner_name_es: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      banner_name_en: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      button_text_es: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      button_text_en: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
      url_exter: new FormControl('', [
        Validators.minLength(10),
        Validators.maxLength(150),
      ]),
      message_es: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30),
      ]),
      message_en: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30),
      ]),
      pdf_file: new FormControl('', []),
      banner_image: new FormControl('', [Validators.required]),
    })
  }

  updateBanner() {
    if (this.pdfFileName.length == 0) {
      this.sizeErrorPdf = true
    }
    if (this.imgFileName.length == 0) {
      this.sizeError = true
    }
    if (this.bannerForm.invalid) {
      ;(<any>Object).values(this.bannerForm.controls).forEach((control) => {
        control.markAsTouched()
      })
      return
    }
  }

  updateBannerStatus(toogleStatus: boolean, target: any) {
    // TO DO PUT request
    console.log('put app', toogleStatus, target)
    let response = 200
    if (response == 200) {
      setTimeout(() => {
        this.ui.dismissLoading()
        window.location.reload()
      }, 2000)
    } else {
      this.ui.dismissLoading()
      //TO DO show http error
    }
  }

  public getMessageform(controlName: any): string {
    let error = ''
    const control = this.bannerForm.get(controlName)
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

  showConfirmation(target: any, message_es: string, message_en: string) {
    if (target.status == true) {
      message_es = 'deshabilitar'
      message_en = 'disable'
    }
    const confDialog = this.dialog.open(ModalConfirmationComponent, {
      id: ModalConfirmationComponent.toString(),
      disableClose: true,
      hasBackdrop: true,
      width: '500px',
      height: 'auto',
      data: {
        role_name: target.role_name_es,
        message_action_es: message_es,
        message_action_en: message_en,
      },
    })

    confDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ui.showLoading()
        let toogle = !target.active
        this.updateBannerStatus(toogle, target)
      } else {
        window.location.reload()
      }
    })
  }

  loadFile(eventfile) {
    if (eventfile.item(0).type == 'application/pdf') {
      if (eventfile.item(0).size > 500000) {
        this.sizeErrorPdf = true
        return
      }
      this.sizeErrorPdf = false
      this.pdfFileName = eventfile.item(0).name
    }
    if (
      eventfile.item(0).type == 'image/jpeg' ||
      eventfile.item(0).type == 'image/png'
    ) {
      if (eventfile.item(0).size > 500000) {
        this.sizeError = true
        return
      }
      this.sizeError = false
      this.imgFileName = eventfile.item(0).name
    }
    console.log(eventfile.item(0))

    // this.termsExp = eventfile.item(0)
  }
}
