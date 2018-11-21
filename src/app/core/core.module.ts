import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EffectsModule} from '@ngrx/effects';

import {CoreEffects} from './effects/core.effects';
import {RouterEffects} from './effects/router.effects';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    EffectsModule.forRoot([CoreEffects])
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
