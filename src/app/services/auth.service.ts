import { Injectable } from '@angular/core'

@Injectable()
export class AuthService {
  constructor() {}

  public isAuthenticated(): boolean {
    const token = this.getToken()

    // Check whether the token is expired and return
    // true or false
    // return typeof token == 'string' && token.indexOf('Bearer') == 0
    return true
  }

  public setAuthenticated(token: string) {
    localStorage.setItem('user_token', token)
  }

  public getToken() {
    // return localStorage.getItem('user_token')
    return 'dsa21jk-dcasda-123x123'
  }
}
