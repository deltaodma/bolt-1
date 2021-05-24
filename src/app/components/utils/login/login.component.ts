import { Component, OnInit } from '@angular/core'
import { SwUpdate } from '@angular/service-worker'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private swUpdate: SwUpdate) {}

  ngOnInit() {
    this.swUpdate.available.subscribe(() => {
      // here you can reload your page
      window.location.reload()
    })
  }
}
