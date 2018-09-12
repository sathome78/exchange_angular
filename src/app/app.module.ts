import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import {DropdownDirective} from './directives/dropdown.directive';
import {AuthGuard} from './services/auth.guard';
import {AuthService} from './services/auth.service';
import {FooterComponent} from './footer/footer.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {SettingsModule} from './settings/settings.module';
import { TwoFactorPopupComponent } from './popups/two-factor-popup/two-factor-popup.component';
import {PopupService} from './services/popup.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DropdownDirective,
    FooterComponent,
    TwoFactorPopupComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    DashboardModule,
    SettingsModule

  ],
  providers: [
    AuthGuard,
    AuthService,
    PopupService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
