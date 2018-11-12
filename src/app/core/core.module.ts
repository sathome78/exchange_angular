import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {EffectsModule} from '@ngrx/effects';

import {HeaderComponent} from './components/header/header.component';
import {SubscribeComponent} from './components/subscribe/subscribe.component';
import {BaseLayoutComponent} from './components/base-layout/base-layout.component';
import {FooterComponent} from './components/footer/footer.component';
import {SharedModule} from '../shared/shared.module';
import { CommonLayout } from '../pages/layouts/common/common.layout';
import {ProductService} from '../catalog/services/product.service';
import {CoreEffects} from './effects/core.effects';
import {RouterEffects} from './effects/router.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule,

    EffectsModule.forFeature([CoreEffects, RouterEffects])
  ],
  providers: [],
  declarations: [],
  exports: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
