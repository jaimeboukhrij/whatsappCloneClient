import { NgModule } from '@angular/core'
import { RouterModule,  Routes } from '@angular/router'
import { ChatsComponent } from './chats.component'

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ChatsComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatsRoutingModule {}
