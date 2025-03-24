import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'chats',
    loadChildren: () =>
      import('./features/chats/chats.module').then((m) => m.ChatsModule),
  },
  {
    path: 'states',
    loadChildren: () =>
      import('./features/states/states.module').then((m) => m.StatesModule),
  },

  {
    path: 'channels',
    loadChildren: () =>
      import('./features/channels/channels.module').then(
        (m) => m.ChannelsModule
      ),
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./features/contacts/contacts.module').then(
        (m) => m.ContactsModule
      ),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: '**',
    redirectTo: 'chats',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
