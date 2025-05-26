export interface ForwardUsersDataPreviewI {
  id: string
  name: string
  status: string | null
  urlImg: string | null
  type: 'chat' | 'contact'
  chatRoomId?: string
}