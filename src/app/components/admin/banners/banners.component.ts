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
  public open_form: boolean = false
  public redirec_option: boolean = false
  public sizeError: boolean = false
  public sizeErrorPdf: boolean = false
  public urlImagBanner: string = ''
  public urlPdfBanner: string = ''
  public pdfFile: any = null
  public imgFile: any = null
  public BannerName: string = ''
  public BannerStatus: number = 0
  public urlAction: boolean = true

  private errorMessage: any = {
    es: {
      banner_name_es: 'Ingrese un nombre en español',
      banner_name_en: 'Ingrese un nombre en inglés',
      button_text_es: 'Ingrese un texto para el botón en español',
      button_text_en: 'Ingrese un texto para el botón en inglés',
      message_es: 'Ingrese una descripción en español',
      message_en: 'Ingrese una descripción en inglés',
    },
    en: {
      banner_name_es: 'Enter a name in spanish',
      banner_name_en: 'Enter a name in english',
      button_text_es: 'Enter a button text in spanish',
      button_text_en: 'Enter a button text in english',
      message_es: 'Enter a description in spanish',
      message_en: 'Enter a description in english',
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
    })
  }

  openBannerForm(action?: any) {
    this.open_form = true
    if (action) {
      this.loadBanner(action)
    }
  }

  loadBanner(target) {
    if (target) {
      this.bannerForm.patchValue({
        banner_name_es: target['name_es'],
        banner_name_en: target['name_en'],
        button_text_es: target['button_es'],
        button_text_en: target['button_en'],
        url_exter: target['url_redirection'],
        message_es: target['content_es'],
        message_en: target['content_en'],
      })
      this.urlImagBanner = target['image']
      this.urlPdfBanner = target['pdf']
      this.BannerStatus = target['status']
      if (target['pdf'].length == 0) {
        this.urlAction = true
      } else {
        this.urlAction = false
      }

      if (this.lang == 'Esp') {
        this.BannerName = target['name_es']
      } else {
        this.BannerName = target['name_en']
      }
    }
  }

  updateBanner() {
    if (this.urlPdfBanner.length == 0 && !this.urlAction) {
      this.sizeErrorPdf = true
      return
    }
    if (this.urlImagBanner.length == 0) {
      this.sizeError = true
      return
    }
    if (this.bannerForm.invalid) {
      ;(<any>Object).values(this.bannerForm.controls).forEach((control) => {
        control.markAsTouched()
      })
      return
    }

    let dataForm = {
      status: true,
      image: this.imgFile,
      pdf: this.pdfFile,
      url_redirection: this.bannerForm.controls.url_exter.value,
      name_es: this.bannerForm.controls.banner_name_es.value,
      name_en: this.bannerForm.controls.banner_name_en.value,
      button_es: this.bannerForm.controls.button_text_es.value,
      buttont_en: this.bannerForm.controls.button_text_en.value,
      message_es: this.bannerForm.controls.message_es.value,
      message_en: this.bannerForm.controls.message_en.value,
    }
    console.log(dataForm)
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

  cancel() {
    this.open_form = false
    this.urlAction = true
    this.urlImagBanner = ''
    this.urlPdfBanner = ''
    this.bannerForm.reset('')
    this.bannerForm.markAsUntouched()
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

  loadFile(eventfile) {
    if (eventfile.item(0).type == 'application/pdf') {
      if (eventfile.item(0).size > 500000) {
        this.sizeErrorPdf = true
        return
      }
      this.sizeErrorPdf = false
      this.urlPdfBanner = eventfile.item(0).name
      this.pdfFile = eventfile.item(0)
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
      this.urlImagBanner = eventfile.item(0).name
      this.imgFile = eventfile.item(0)
    }
  }

  disableField() {
    this.urlAction = !this.urlAction
    if (!this.urlAction) {
      this.bannerForm.controls.url_exter.reset()
    } else {
      this.pdfFile = null
    }
  }
}
