var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { HeaderComponent } from './components/header/header.component';
import { S3UploadsService } from './services/s3-uploads.service';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { FooterComponent } from './components/footer/footer.component';
import { SubscribeService } from './services/subscribe.service';
import { SharedModule } from '../shared/shared.module';
import { CommonLayout } from '../pages/layouts/common/common.layout';
import { CategoriesService } from './services/categories.service';
import { AssessmentService } from './services/assessment.service';
import { ProductService } from '../catalog/services/product.service';
import { PlatformService } from './services/platform.service';
import { CoreEffects } from './effects/core.effects';
import { LocaleService } from './services/locale.service';
import { ValidationService } from './services/validation';
import { RouterEffects } from './effects/router.effects';
var CoreModule = /** @class */ (function () {
    function CoreModule(parentModule) {
        if (parentModule) {
            throw new Error('CoreModule is already loaded. Import it in the AppModule only');
        }
    }
    CoreModule = __decorate([
        NgModule({
            imports: [
                SharedModule,
                CommonModule,
                RouterModule,
                FormsModule,
                SharedModule,
                EffectsModule.forFeature([CoreEffects, RouterEffects])
            ],
            providers: [
                S3UploadsService,
                SubscribeService,
                CategoriesService,
                AssessmentService,
                ProductService,
                PlatformService,
                LocaleService,
                ValidationService
            ],
            declarations: [
                HeaderComponent,
                FooterComponent,
                BaseLayoutComponent,
                SubscribeComponent,
                CommonLayout
            ],
            exports: [
                HeaderComponent,
                BaseLayoutComponent,
                SubscribeComponent
            ]
        }),
        __param(0, Optional()), __param(0, SkipSelf()),
        __metadata("design:paramtypes", [CoreModule])
    ], CoreModule);
    return CoreModule;
}());
export { CoreModule };
