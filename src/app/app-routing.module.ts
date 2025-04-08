import { NgModule } from '@angular/core'
import { RouterModule, type Routes } from '@angular/router'
import { AuthGuard } from './core/guards/auth.guard'
import { NoAuthGuard } from './core/guards'

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: async () =>
      await import('./modules/auth/auth.module').then((m) => m.AuthModule),
    canActivate: [NoAuthGuard]
  },
  {
    path: '',
    loadChildren: async () =>
      await import('./layout/layout.module').then((m) => m.LayoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'chats'
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
