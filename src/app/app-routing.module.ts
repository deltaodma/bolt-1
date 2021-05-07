import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { EmbedViewComponent } from './components/embed-view/embed-view.component'
import { HomeComponent } from './components/home/home/home.component'
import { LoginComponent } from './components/utils/login/login.component'
import { MsalGuard } from './services/msal.guard'

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [MsalGuard] },
  {
    path: 'app-view/:id',
    component: EmbedViewComponent,
    canActivate: [MsalGuard],
  },
  { path: '**', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
