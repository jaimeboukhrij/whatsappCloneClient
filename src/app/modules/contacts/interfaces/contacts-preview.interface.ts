export interface ContactsPreviewI {
  id: string
  name: string
  lastChatMessage: string
  lastChatMessageHour: Date
  messagesWithoutRead: number
  isUserMessage: boolean
  urlImg: string
  isArchived: boolean
  isPinned: Date | undefined
  isRead: boolean
  inFavorites: boolean
  isBlocked: boolean
  showOptions: boolean
  isGroup: boolean
  status: string

}

