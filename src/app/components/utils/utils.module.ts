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
import { LoadingComponent } from './loading/loading.component'
import { TutorialComponent } from './tutorial/tutorial.component'
import { LoginComponent } from './login/login.component'
import { ModalConfirmationComponent } from './admin/modal-confirmation/modal-confirmation.component'
import { ModalProjectFormComponent } from './admin/modal-project-form/modal-project-form.component'
import { ModalAppAssoccComponent } from './admin/modal-app-assocc/modal-app-assocc.component'
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ModalSubmenuFormComponent } from './admin/modal-submenu-form/modal-submenu-form.component'

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ModalNotificationComponent,
    ModalRolFormComponent,
    ModalAlertComponent,
    LoadingComponent,
    TutorialComponent,
    LoginComponent,
    ModalConfirmationComponent,
    ModalProjectFormComponent,
    ModalAppAssoccComponent,
    ModalSubmenuFormComponent,
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
    MatCheckboxModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ModalNotificationComponent,
    ModalRolFormComponent,
    ModalAlertComponent,
    LoadingComponent,
  ],
})
export class UtilsModule {}
