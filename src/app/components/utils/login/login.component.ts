import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MsalService } from '@azure/msal-angular'
import { AuthenticationResult } from '@azure/msal-common'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private msalService: MsalService, private router: Router) {
    // obtaining active account
  }
  ngOnInit() {
    this.msalService.instance.handleRedirectPromise().then((res) => {
      if (res != null && res.account != null) {
        this.msalService.instance.setActiveAccount(res.account)
      }
    })
    this.login()
  }
  isLoggedIn(): boolean {
    return this.msalService.instance.getActiveAccount() != null
  }

  login() {
    this.msalService
      .loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(response.account)
        this.router.navigate(['home'], {
          queryParamsHandling: 'preserve',
        })
      })
    // this.msalService.loginRedirect()
  }

  logout() {
    this.msalService.logout()
  }
}
