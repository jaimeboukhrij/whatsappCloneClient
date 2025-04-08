import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { GroupsComponent } from './groups.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../../shared/shared.module'
import { CreateGroupModalComponent } from './components/create-group-modal/create-group-modal.component'

@NgModule({
  declarations: [GroupsComponent, CreateGroupModalComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule],
  exports: [CreateGroupModalComponent]
})
export class GroupsModule {}
