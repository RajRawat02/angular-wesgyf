import { NgModule } from '@angular/core';
import { customInterceptor } from './interceptor/interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    //providing custom interceptor
    { provide: HTTP_INTERCEPTORS, useClass: customInterceptor, multi: true }
  ],
  exports: []
})
export class CoreModule { }
