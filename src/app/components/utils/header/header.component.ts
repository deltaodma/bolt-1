import { HttpClient } from '@angular/common/http'
import { AfterContentChecked, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MsalService } from '@azure/msal-angular'
const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me'

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
export class HeaderComponent implements OnInit, AfterContentChecked {
  public lang: string
  profile!: ProfileType
  public userName: string = ''
  constructor(
    private router: Router,
    private http: HttpClient,
    private msalService: MsalService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    // this.getProfile()
    this.callProfile()
  }
  ngAfterContentChecked() {
    this.userName = JSON.parse(sessionStorage.getItem('user')).givenName
  }
  changeLang(event) {
    // read the local storage to set a language
    localStorage.setItem('lang', event)
    window.location.reload()
  }

  routerHome() {
    this.router.navigate(['home'])
  }

  callProfile() {
    this.http.get(GRAPH_ENDPOINT).subscribe((profile) => {
      this.profile = profile
      sessionStorage.setItem('user', JSON.stringify(profile))
    })
  }
}
