import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable()
export class AuthService {
  private token: string
  private authStatusListener = new Subject<boolean>()
  private tokenTimer: any
  private isAuth: boolean = true
  public userId: string
  public isAdmin: boolean = true

  constructor(private http: HttpClient, private router: Router) {}

  public isAuthenticated(): boolean {
    return this.isAuth
  }
  public isAdministrator(): boolean {
    return this.isAdmin
  }

  public getToken() {
    this.token = localStorage.getItem('token')
    return this.token
  }

  login() {
    location.href = environment.serverUrl + environment.auth.get
  }

  setListenner() {
    this.authStatusListener.next(true)
  }
  logout() {
    this.token = null
    this.isAuth = false
    this.authStatusListener.next(false)
    // clear timer
    clearTimeout(this.tokenTimer)
    // clear local Storage
    this.clearAuthdata()
    // clear user id
    this.userId = null
    this.router.navigate(['/'])
  }

  autoAuthUser() {
    const authInformation = this.getAuthData()
    if (!authInformation) {
      this.login()
      return
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
    if (expiresIn > 0) {
      this.token = authInformation.token
      this.isAuth = true
      this.userId = authInformation.userId
      this.setAuthTimer(expiresIn)
      this.authStatusListener.next(true)
      this.router.navigate(['/home'])
    }
  }

  saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthdata() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    const userId = localStorage.getItem('userId')
    if (!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    }
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }
}
