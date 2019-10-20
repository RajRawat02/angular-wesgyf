import { Injector } from '@angular/core';

//Injector class to inject root level services to Home module
export class AppInjector {

    private static injector: Injector;

    // implementing setter for injector - setting static injector
    static setInjector(injector: Injector) {
        AppInjector.injector = injector;
    }

    //implementing getter for injector - returning injector
    static getInjector(): Injector {
        return AppInjector.injector;
    }

}   