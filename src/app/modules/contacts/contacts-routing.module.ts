import { NgModule } from '@angular/core'
import { RouterModule, type Routes } from '@angular/router'
import { ContactsComponent } from './contacts.component'

const routes: Routes = [{ path: '', component: ContactsComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule {}
