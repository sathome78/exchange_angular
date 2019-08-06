import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IEOComponent } from './ieo.component';
import { CommonIEOComponent } from './components/common-ieo/common-ieo.component';

const ieoRoutes: Routes = [
  { path: '', component: CommonIEOComponent },
  { path: ':id', component: IEOComponent },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(ieoRoutes)],
  exports: [RouterModule],
})
export class IEORoutingModule {}
