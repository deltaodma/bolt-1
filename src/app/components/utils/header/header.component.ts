import { Component, OnInit } from '@angular/core'
import { MatSelectChange } from '@angular/material/select'
import { Router } from '@angular/router'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public default: string = 'Esp'
  public userName: string = 'Pedro'

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeLeng(event) {
    let selectedData = event
    if (selectedData == 'Esp') {
      console.log('Espanol')
    } else {
      this.default = 'Eng'
      console.log('ingles')
    }
  }

  routerHome() {
    this.router.navigate([''])
  }
}
