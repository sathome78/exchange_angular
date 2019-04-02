import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {IEOComponent} from './ieo.component';

const ieoRoutes: Routes = [
  {path: '', component: IEOComponent}
];

@NgModule({
  imports: [ RouterModule.forChild(ieoRoutes) ],
  exports: [ RouterModule ]
})
export class IEORoutingModule {
}
