import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { EmbedViewComponent } from './components/embed-view/embed-view.component'
import { HomeComponent } from './components/home/home/home.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'app-view', component: EmbedViewComponent },
  { path: 'app-view/:id', component: EmbedViewComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
