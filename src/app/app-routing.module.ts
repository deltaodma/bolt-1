import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { BannersComponent } from './components/admin/banners/banners.component'
import { ProjectsComponent } from './components/admin/projects/projects.component'
import { RolesComponent } from './components/admin/roles/roles.component'
import { EmbedViewComponent } from './components/home/embed-view/embed-view.component'
import { HomeComponent } from './components/home/home/home.component'
import { LoginComponent } from './components/utils/login/login.component'
import { MsalGuard } from './services/msal.guard'

const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [MsalGuard]
  },
  {
    path: 'app-view/:id',
    component: EmbedViewComponent,
    // canActivate: [MsalGuard],
  },
  {
    path: 'admin',
    children: [
      {
        path: 'projects', // child route path
        component: ProjectsComponent, // child route component that the router renders
        // canActivate: [MsalGuard],
      },
      {
        path: 'roles',
        component: RolesComponent, // another child route component that the router renders
        // canActivate: [MsalGuard],
      },
      {
        path: 'banners',
        component: BannersComponent, // another child route component that the router renders
        // canActivate: [MsalGuard],
      },
    ],
  },

  { path: '**', component: HomeComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
