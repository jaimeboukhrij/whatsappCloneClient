import { NgModule } from '@angular/core'
import { RouterModule,  Routes } from '@angular/router'
import { ChannelsComponent } from './channels.component'

const routes: Routes = [{ path: '', component: ChannelsComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelsRoutingModule { }
