import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { BannersComponent } from '../../banners/banners.component'
import { ProjectsComponent } from '../../projects/projects.component'
import { EmbedViewComponent } from '../../../home/embed-view/embed-view.component'
import { HomeComponent } from '../../../home/home/home.component'
import { SubmenuViewComponent } from '../../submenu-view/submenu-view.component'
import { LoginComponent } from '../../../utils/login/login.component'
import { RolesComponent } from './roles.component'
import { UsersComponent } from '../users/users.component'

const routes: Routes = [
  // { path: '', component: LoginComponent },
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
        // canActivate: [MsalGuard],
        children: [
          {
            path: '', // child route path
            component: ProjectsComponent,
          },
          {
            path: 'submenu/:id', // child route path
            component: SubmenuViewComponent,
          },
        ],
      },
      {
        path: 'roles',
        // canActivate: [MsalGuard],
        children: [
          {
            path: '', // child route path
            component: RolesComponent,
          },
          {
            path: 'users', // child route path
            component: UsersComponent,
          },
        ],
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
