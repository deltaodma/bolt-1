import { Component, OnInit } from '@angular/core'
import { MatCarousel, MatCarouselComponent } from '@ngmodule/material-carousel'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public date = new Date().toLocaleDateString()
  constructor() {}

  ngOnInit(): void {}

  redirectTo() {
    console.log('redireccion externa')
  }
}
