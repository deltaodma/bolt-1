import { HttpClient } from '@angular/common/http'
import { AfterContentChecked, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'


type ProfileType = {
  givenName?: string
  surname?: string
  userPrincipalName?: string
  id?: string
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public lang: string
  profile!: ProfileType
  public userName: string = 'Cristhopher'
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'

  }

  changeLang(event) {
    // read the local storage to set a language
    localStorage.setItem('lang', event)
    window.location.reload()
  }

  routerHome() {
    this.router.navigate(['home'])
  }

}
