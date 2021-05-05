import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public lang: string
  public userName: string = 'Pedro'

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
  }

  changeLang(event) {
    // read the local storage to set a language
    localStorage.setItem('lang', event)
    window.location.reload()
  }

  routerHome() {
    this.router.navigate([''])
  }
}
