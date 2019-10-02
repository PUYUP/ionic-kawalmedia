import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscortRoutingModule } from './escort-routing.module';
import { SubmitMediaPageModule } from './pages/submit-media/submit-media.module';
import { ListMediaPageModule } from './pages/list-media/list-media.module';
import { DetailMediaPageModule } from './pages/detail-media/detail-media.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    EscortRoutingModule,
    SubmitMediaPageModule,
    ListMediaPageModule,
    DetailMediaPageModule
  ]
})
export class EscortModule { }
