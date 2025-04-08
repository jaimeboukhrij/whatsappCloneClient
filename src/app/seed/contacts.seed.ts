import { v4 as uuid } from 'uuid'

export const contactsSeed = [
  {
    id: uuid(),
    name: 'Bebe',
    lastChatMessage: 'como te va el dia?',
    lastChatMessageHour: new Date(+1),
    messagesWithoutRead: 4,
    isUserMessage: true,
    urlImg: 'assets/images/padi_user.jpg',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: true,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Disponible para hablar'
  },
  {
    id: uuid(),
    name: 'Adrian',
    lastChatMessage: 'Hola soy Adrian',
    lastChatMessageHour: new Date(+2),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/adrian_user.png',
    isArchived: true,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: true,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'En la oficina'
  },
  {
    id: uuid(),
    name: 'Alex',
    lastChatMessage: 'Hola soy alex',
    lastChatMessageHour: new Date(+3),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/alex_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'De vacaciones'
  },
  {
    id: uuid(),
    name: 'Dani',
    lastChatMessage: 'Hola soy dani',
    lastChatMessageHour: new Date(+4),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/dani_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Estudiando'
  },
  {
    id: uuid(),
    name: 'Julian',
    lastChatMessage: 'Hola soy Julian',
    lastChatMessageHour: new Date(+5),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/julian_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Entrenando'
  },
  {
    id: uuid(),
    name: 'Lourdes',
    lastChatMessage: 'Hola soy Lourdes',
    lastChatMessageHour: new Date(+6),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/lourdes_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Comiendo'
  },
  {
    id: uuid(),
    name: 'Marcos',
    lastChatMessage: 'Hola soy Marcos',
    lastChatMessageHour: new Date(),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/marcos_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: true,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'De viaje'
  },
  {
    id: uuid(),
    name: 'Natalia',
    lastChatMessage: 'Hola soy Natalia',
    lastChatMessageHour: new Date(+7),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/natalia_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'En línea'
  },
  {
    id: uuid(),
    name: 'Pusher',
    lastChatMessage: 'Hola soy Pusher',
    lastChatMessageHour: new Date(+8),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/pusher_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Durmiendo'
  },
  {
    id: uuid(),
    name: 'Aida',
    lastChatMessage: 'Hola soy Aida',
    lastChatMessageHour: new Date(+8),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/aida_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Estresada'
  },
  {
    id: uuid(),
    name: 'Antonio',
    lastChatMessage: 'Hola soy Antonio',
    lastChatMessageHour: new Date(+8),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/antonio_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'En una reunión'
  },
  {
    id: uuid(),
    name: 'Beatriz',
    lastChatMessage: 'Hola soy Beatriz',
    lastChatMessageHour: new Date(+8),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/beatriz_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Leyendo'
  },
  {
    id: uuid(),
    name: 'Bruno',
    lastChatMessage: 'Hola soy Bruno',
    lastChatMessageHour: new Date(+8),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/bruno_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Haciendo ejercicio'
  },
  {
    id: uuid(),
    name: 'Carmen',
    lastChatMessage: 'Hola soy Carmen',
    lastChatMessageHour: new Date(+8),
    messagesWithoutRead: 4,
    isUserMessage: false,
    urlImg: 'assets/images/carmen_user.png',
    isArchived: false,
    notificationsSilenced: false,
    isPinned: undefined,
    isRead: false,
    inFavorites: false,
    isBlocked: false,
    showOptions: false,
    isGroup: false,
    status: 'Disponible para hablar'
  }
]
