import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  public lang: string
  constructor() {}

  ngOnInit(): void {
    this.lang = localStorage.getItem('lang') || 'Esp'
  }
}
