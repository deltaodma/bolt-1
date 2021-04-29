import { Component, OnInit, ViewChild } from '@angular/core'
import { MatAccordion } from '@angular/material/expansion'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChild(MatAccordion) accordion1: MatAccordion
  @ViewChild(MatAccordion) accordion2: MatAccordion

  public default: string = 'Esp'
  public userName: string = 'Pedro'
  public arrowType: string = 'arrow_forward_ios'
  public checked: boolean = false
  public favList: any = [1, 2, 3, 4]
  public role: string = 'user'
  public sideStatus: boolean = false

  prop = [
    {
      name: 'bolt',
      menu: [
        {
          name: 'user',
          prog: [
            { item: '1', fav: false },
            { item: '2', fav: false },
            { item: '3', fav: true },
            { item: '4', fav: false },
          ],
        },
        {
          name: 'exter',
          prog: [
            { item: '5', fav: false },
            { item: '6', fav: false },
          ],
        },
        {
          name: 'qa',
          prog: [
            { item: '7', fav: false },
            { item: '8', fav: true },
            { item: '9', fav: false },
          ],
        },
      ],
    },
    {
      name: 'becks',
      menu: [
        {
          name: 'user2',
          prog: [
            { item: '10', fav: true },
            { item: '11', fav: false },
          ],
        },
        { name: 'exter2', prog: [{ item: '12', fav: false }] },
        { name: 'qa2', prog: [{ item: 'asdasdas', fav: true }] },
      ],
    },
    {
      name: 'pony malta',
      menu: [
        {
          name: 'user3',
          prog: [
            { item: '10', fav: true },
            { item: '11', fav: false },
          ],
        },
        { name: 'exter3', prog: [{ item: '12', fav: true }] },
        { name: 'q3', prog: [{ item: 'asdasdas', fav: false }] },
      ],
    },
  ]
  constructor() {}

  ngOnInit(): void {}

  openSidebar() {
    let innerButton = document.querySelector('#collapseSide')
    let innerArrow = document.querySelector('#arrowSide')
    let sidebar = document.querySelector('#sidebar')
    this.sideStatus = !this.sideStatus
    if (this.sideStatus) {
      sidebar.setAttribute('style', 'transform: translateX(-267px)')
      innerButton.setAttribute(
        'style',
        'transform: rotate(180deg) , border-radius: 5px 0 0 5px;',
      )
      innerArrow.setAttribute('style', 'transform: rotate(0deg) ')
    } else {
      sidebar.setAttribute('style', 'transform: translateX(0px)')
      innerButton.setAttribute('style', 'transform: rotate(0deg) ')
      innerArrow.setAttribute('style', 'transform: rotate(180deg) ')
    }
  }

  menuOpened(item) {
    let menu = document.getElementById(item)
    menu.classList.add('highlight-item')
  }

  menuClosed(item) {
    let menu = document.getElementById(item)
    menu.classList.remove('highlight-item')
  }

  arrowRotate(state: boolean, id?: number | string) {
    let actArrow = document.getElementById('arrowH' + id)
    let extArrow = document.getElementById('arrowE' + id)

    let actHeader = document.getElementById('panel' + id)
    let extHeader = document.getElementById('ext' + id)

    let actIcon = document.getElementById('iconH' + id)
    let extIcon = document.getElementById('iconE' + id)

    if (typeof id == 'string') {
      if (state) {
        extArrow.classList.add('arrowDown')
        extArrow.classList.remove('arrowUp')
        extHeader.classList.add('bg-black-panel')
        extIcon.classList.remove('menu-icon')
      } else {
        extArrow.classList.add('arrowUp')
        extArrow.classList.remove('arrowDown')
        extHeader.classList.remove('bg-black-panel')
        extIcon.classList.add('menu-icon')
      }
    } else {
      if (state) {
        actArrow.classList.add('arrowDown')
        actArrow.classList.remove('arrowUp')
        actHeader.classList.add('bg-black-panel')
        actIcon.classList.remove('menu-icon')
      } else {
        actArrow.classList.add('arrowUp')
        actArrow.classList.remove('arrowDown')
        actHeader.classList.remove('bg-black-panel')
        actIcon.classList.add('menu-icon')
      }
    }
  }

  updateFav(event) {
    console.log(event)
  }
}
