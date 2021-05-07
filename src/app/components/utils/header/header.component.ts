import { HttpClient } from '@angular/common/http'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MsalService } from '@azure/msal-angular'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public lang: string
  public userName: any

  constructor(
    private router: Router,
    private http: HttpClient,
    private msalService: MsalService,
  ) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
    this.getProfile()
  }
  getProfile(): string {
    this.userName = JSON.parse(localStorage.getItem('msal-response'))
    return this.userName.account.name
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
