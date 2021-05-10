import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { UtilsModule } from './components/utils/utils.module'
import { HomeComponent } from './components/home/home/home.component'

import { MatCarouselModule } from '@ngmodule/material-carousel'
import { MatCardModule } from '@angular/material/card'
import { MatSnackBarModule } from '@angular/material/snack-bar'

import { EmbedViewComponent } from './components/embed-view/embed-view.component'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { HttpService } from './services/http.service'
import { AuthService } from './services/auth.service'
import {
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser'

import {
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular'

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'b5ccc36d-a024-43a2-a0b5-d3a212700ea5',
      redirectUri: 'http://localhost:4200',
      authority:
        'https://login.microsoftonline.com/1b4c1c25-a699-4f61-95e2-45d8dec5a788',
    },
    cache: {
      cacheLocation: 'localStorage',
    },
  })
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>()
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read'])

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  }
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },
  }
}

@NgModule({
  declarations: [AppComponent, HomeComponent, EmbedViewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UtilsModule,
    MatCarouselModule.forRoot(),
    MatCardModule,
    MatSnackBarModule,
    HttpClientModule,
  ],
  providers: [
    HttpService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
