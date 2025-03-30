import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'chats',
        pathMatch: 'full',
      },

      {
        path: 'chats',
        loadChildren: () =>
          import('../modules/chats/chats.module').then((m) => m.ChatsModule),
      },
      {
        path: 'states',
        loadChildren: () =>
          import('../modules/states/states.module').then((m) => m.StatesModule),
      },

      {
        path: 'channels',
        loadChildren: () =>
          import('../modules/channels/channels.module').then(
            (m) => m.ChannelsModule
          ),
      },
      {
        path: 'contacts',
        loadChildren: () =>
          import('../modules/contacts/contacts.module').then(
            (m) => m.ContactsModule
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../modules/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../modules/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: '**',
        redirectTo: 'chats',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
