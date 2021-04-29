import { Component, OnInit } from '@angular/core'
import { MatSelectChange } from '@angular/material/select'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public default: string = 'Esp'
  public userName: string = 'Pedro'

  constructor() {}

  ngOnInit(): void {}

  changeLeng(event: MatSelectChange) {
    let selectedData = event.value

    if (selectedData == 'Esp') {
      console.log('Espanol')
    } else {
      this.default = 'Eng'
      console.log('ingles')
    }
  }
}
