
export interface CreateChatRoomDto {
  name: string
  urlImg: string
  type: 'private' | 'group'
  membersIds: string[]
}





