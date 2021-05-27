import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Subject } from 'rxjs'
import { environment } from 'src/environments/environment'

import { AuthData } from '../model/auth-data.model'

@Injectable()
export class AuthService {
  private token: string =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5YjhlODE4LTBmYzItNDU3Zi1hYTdkLTVmMTcwNWE1MzA4YyIsImVtYWlsIjoibWFudWVsZjA3MTBAZGVsdGFvZG1haG90bWFpbC5vbm1pY3Jvc29mdC5jb20iLCJuYW1lIjoiTWFudWVsIiwibGFzdF9uYW1lIjoiRnVlbnRlcyIsImNvdW50cnkiOiJDb2xvbWJpYSIsImVtcGxveWVlX2NvZGUiOiIxNjIyMDgyNzM5NzQxIiwiaWF0IjoxNjIyMTI5MzQ3LCJleHAiOjE2MjIxNjUzNDd9.F3ZfdA6uRMgVtmSubYqVCDGpIhZDdvoOOCGbF8vDkAg'
  private authStatusListener = new Subject<boolean>()
  private tokenTimer: any
  private isAuth: boolean = true
  public userId: string
  public isAdmin: boolean = false

  constructor(private http: HttpClient, private router: Router) {}

  public isAuthenticated(): boolean {
    return this.isAuth
  }
  public isAdministrator(): boolean {
    return this.isAdmin
  }

  public getToken() {
    // return localStorage.getItem('user_token')
    return this.token
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    }
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        environment.serverUrl + environment.users.getSaml,
        authData,
      )
      .subscribe((response) => {
        const token = response.token
        this.token = token
        if (token) {
          const expiresInDuration = response.expiresIn
          // set timer to logout in funtion of expiresIn var returned by the backend
          this.setAuthTimer(expiresInDuration)
          this.isAuth = true
          // get the userId form backend
          this.userId = response.userId
          this.authStatusListener.next(true)
          // save auth data in local storage
          const now = new Date()
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000,
          )
          this.saveAuthData(token, expirationDate, this.userId)

          this.router.navigate(['/'])
        }
      })
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
      return
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
    if (expiresIn > 0) {
      this.token = authInformation.token
      this.isAuth = true
      this.userId = authInformation.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', this.userId)
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

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }
}
