export interface ContactsPreviewInterface {
  id: string;
  name: string;
  lastChatMessage: string;
  lastChatMessageHour: Date;
  messagesWithoutRead: number;
  isUserMessage: boolean;
  urlImg: string;
  isArchived: boolean;
  notificationsSilenced: NotificationsSilencedEnum | false;
  isPinned: Date | undefined;
  isRead: boolean;
  inFavorites: boolean;
  isBlocked: boolean;
  showOptions: boolean;
  isGroup: boolean;
  status: string;
}

export enum NotificationsSilencedEnum {
  HOUR = 'hour',
  WEEK = 'week',
  ALWAYS = 'always',
}

export interface ChatPreviewFiltersInterface {
  query?: string;
  all: boolean;
  noRead?: boolean;
  favorite?: boolean;
  groups?: boolean;
}

export enum ChatPreviewFiltersEnum {
  QUERY = 'query',
  ALL = 'all',
  NO_READ = 'noRead',
  FAVORITE = 'favorite',
  GROUPS = 'groups',
}
