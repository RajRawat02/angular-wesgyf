import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Injector } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module'
import { ToastrModule } from 'ngx-toastr';
import { HomeRoutingModule } from './home-routing.module';
import { MenuModule } from 'primeng/menu';
import {
  NbThemeModule, NbSidebarModule, NbLayoutModule, NbButtonModule, NbMenuModule,
  NbCardModule, NbInputModule, NbSpinnerModule, NbActionsModule, NbIconModule, NbContextMenuModule,
} from '@nebular/theme'
import { NbAuthModule, NbDummyAuthStrategy } from '@nebular/auth';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbIconLibraries } from '@nebular/theme';

import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/zh-Hans';
import localeZhExtra from '@angular/common/locales/extra/zh-Hans';

registerLocaleData(localeZh, 'zh-Hans', localeZhExtra);

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule, } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { AppInjector } from '../core/injector/injector'
import { MenuComponent } from './components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home.component';
import { LayoutComponent } from './components/layout/layout.component';
import { BaseComponent } from './components/base/base-component'
import { LoginComponent } from './components/login/login.component';
import { ScreensComponent } from './components/screens/screens.component'

const nebularModules = [
  NbMenuModule.forRoot(),
  NbSidebarModule.forRoot(),
  NbIconModule,
  NbContextMenuModule,
  NbEvaIconsModule,
  NbLayoutModule,
  NbButtonModule,
  NbCardModule,
  NbActionsModule,
  NbInputModule,
  NbThemeModule.forRoot(),
  NbAuthModule.forRoot({
    strategies: [
      NbDummyAuthStrategy.setup({
        name: 'email',
      }),
    ],
    forms: {},
  }),
  NbSpinnerModule]

@NgModule({
  declarations: [
    BaseComponent,
    MenuComponent,
    HeaderComponent,
    HomeComponent,
    LayoutComponent,
    LoginComponent,
    ScreensComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    CommonModule,
    HomeRoutingModule,
    MenuModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-full-width',
    }),
    nebularModules,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],
  providers: [],
  bootstrap: [HomeComponent]
})

export class HomeModule {
  constructor(injector: Injector, private iconLibraries: NbIconLibraries) {
    // Store module's injector in the AppInjector class
    AppInjector.setInjector(injector);
  }
}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}