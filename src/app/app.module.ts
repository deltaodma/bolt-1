import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { UtilsModule } from './components/utils/utils.module'
import { HomeComponent } from './components/home/home/home.component'

import { MatCarouselModule } from '@ngmodule/material-carousel'
import { MatCardModule } from '@angular/material/card'

import { EmbedViewComponent } from './components/embed-view/embed-view.component'

@NgModule({
  declarations: [AppComponent, HomeComponent, EmbedViewComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    UtilsModule,
    MatCarouselModule.forRoot(),
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
