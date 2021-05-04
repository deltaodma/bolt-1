import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component'
import { SidebarComponent } from './sidebar/sidebar.component'

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatMenuModule } from '@angular/material/menu'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSelectModule } from '@angular/material/select'
import { MatDividerModule } from '@angular/material/divider'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatButtonModule } from '@angular/material/button'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { ModalNotificationComponent } from './modal-notification/modal-notification.component'
import { ModalRolFormComponent } from './modal-rol-form/modal-rol-form.component'
import { ModalAlertComponent } from './modal-alert/modal-alert.component'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ModalNotificationComponent,
    ModalRolFormComponent,
    ModalAlertComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDividerModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatExpansionModule,
    MatGridListModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  exports: [FooterComponent, SidebarComponent, HeaderComponent],
})
export class UtilsModule {}
