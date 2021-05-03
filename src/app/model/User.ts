import { Projects } from './Projects'

export class User {
  id: number
  first_name: string
  last_name: string
  country: string
  email: string
  password: string
  last_login: string
  rol: string
  projects: Projects
  type_id: string
  id_number: string

  cookie_td: string

  constructor(data?: any) {
    if (data !== undefined) {
      this.id = data['id'] !== undefined ? data['id'] : undefined

      this.first_name =
        data['first_name'] !== undefined ? data['first_name'] : undefined

      this.last_name =
        data['last_name'] !== undefined ? data['last_name'] : undefined

      this.country = data['country'] !== undefined ? data['country'] : undefined

      this.email = data['email'] !== undefined ? data['email'] : undefined

      this.last_login =
        data['last_login'] !== undefined ? data['last_login'] : undefined

      this.rol = data['rol'] !== undefined ? data['rol'] : undefined

      this.password =
        data['password'] !== undefined ? data['password'] : undefined

      this.projects =
        data['projects'] !== undefined ? data['projects'] : undefined

      this.type_id = data['type_id'] !== undefined ? data['type_id'] : undefined

      this.id_number =
        data['id_number'] !== undefined ? data['id_number'] : undefined

      this.cookie_td =
        data['cookie_td'] !== undefined ? data['cookie_td'] : null
    }
  }

  static fromJS(data: any): User {
    return new User(data)
  }

  toJS(data?: any) {
    data = {}
    data['id'] = this.id !== undefined ? this.id : null

    data['first_name'] = this.first_name !== undefined ? this.first_name : null

    data['last_name'] = this.last_name !== undefined ? this.last_name : null

    data['country'] = this.country !== undefined ? this.country : null

    data['email'] = this.email !== undefined ? this.email : null
    data['password'] = this.password !== undefined ? this.password : null
    data['projects'] = this.projects !== undefined ? this.projects : null

    data['type_id'] = this.type_id !== undefined ? this.type_id : null
    data['id_number'] = this.id_number !== undefined ? this.id_number : null

    data['last_login'] = this.last_login !== undefined ? this.last_login : null

    data['cookie_td'] = this.cookie_td !== undefined ? this.cookie_td : null

    return data
  }

  toJSON() {
    return JSON.stringify(this.toJS())
  }
}
