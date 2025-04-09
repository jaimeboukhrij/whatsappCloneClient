import { NgModule } from '@angular/core'
import { RouterModule,  Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'chats',
        pathMatch: 'full'
      },

      {
        path: 'chats',
        loadChildren: async () =>
          await import('../modules/chats/chats.module').then((m) => m.ChatsModule)
      },
      {
        path: 'states',
        loadChildren: async () =>
          await import('../modules/states/states.module').then((m) => m.StatesModule)
      },

      {
        path: 'channels',
        loadChildren: async () =>
          await import('../modules/channels/channels.module').then(
            (m) => m.ChannelsModule
          )
      },
      {
        path: 'contacts',
        loadChildren: async () =>
          await import('../modules/contacts/contacts.module').then(
            (m) => m.ContactsModule
          )
      },
      {
        path: 'settings',
        loadChildren: async () =>
          await import('../modules/settings/settings.module').then(
            (m) => m.SettingsModule
          )
      },
      {
        path: 'profile',
        loadChildren: async () =>
          await import('../modules/profile/profile.module').then(
            (m) => m.ProfileModule
          )
      },

      {
        path: '**',
        redirectTo: 'chats'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
