
export interface ContactI {
  firstName: string
  id: string
  lastName: string
  urlImg: string | null
  status: string | null
}

export interface ContactsViewI {
  letter: string
  data: ContactI[]
}