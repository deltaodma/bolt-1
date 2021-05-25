import { Projects } from './Projects'

export class User {
  id: string
  first_name: string
  last_name: string
  country: string
  employee_code: string
  role: any
  created_at: Date
  updated_at: Date
  deleted_at: Date
  constructor(data?: any) {
    if (data !== undefined) {
      this.id = data['id'] !== undefined ? data['id'] : undefined

      this.first_name =
        data['first_name'] !== undefined ? data['first_name'] : undefined

      this.last_name =
        data['last_name'] !== undefined ? data['last_name'] : undefined

      this.country = data['country'] !== undefined ? data['country'] : undefined

      this.employee_code =
        data['employee_code'] !== undefined ? data['employee_code'] : undefined

      this.role = data['role'] !== undefined ? data['role'] : undefined

      this.created_at =
        data['created_at'] !== undefined ? data['created_at'] : undefined

      this.updated_at =
        data['updated_at'] !== undefined ? data['updated_at'] : undefined

      this.deleted_at =
        data['deleted_at'] !== undefined ? data['deleted_at'] : undefined
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

    data['employee_code'] =
      this.employee_code !== undefined ? this.employee_code : null

    data['role'] = this.role !== undefined ? this.role : null

    data['created_at'] = this.created_at !== undefined ? this.created_at : null
    data['updated_at'] = this.updated_at !== undefined ? this.updated_at : null
    data['deleted_at'] = this.deleted_at !== undefined ? this.deleted_at : null

    return data
  }

  toJSON() {
    return JSON.stringify(this.toJS())
  }
}
