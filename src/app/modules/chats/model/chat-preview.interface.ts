import { IUser } from '../../../shared/interfaces/user.interface';

export interface ChatRoomI {
  id: string;
  name: string;
  lastChatMessage: string;
  lastChatMessageHour: Date;
  messagesWithoutRead: number;
  isUserMessage: boolean;
  urlImg: string;
  isArchived: boolean;
  notificationsSilenced: NotificationsSilencedEnum | null;
  isPinned: Date | null;
  isRead: boolean;
  inFavorites: boolean;
  isBlocked: boolean;
  showOptions: boolean;
  type: 'private' | 'group';
  users: IUser[];
  createdAt: Date;
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
  ARCHIVED = 'archived',
}
