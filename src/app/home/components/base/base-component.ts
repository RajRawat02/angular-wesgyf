import { Component } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AppInjector } from 'src/app/core/injector/injector';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { StorageService } from '../../../shared/services/storage.service'
import { TranslateService } from '@ngx-translate/core';

//Base component to provide all root level services to all components
@Component({
    template: '',
})
export class BaseComponent {
    protected toastrService: NotificationService; //contains reference of notification service
    spinnerService: SpinnerService;  //contains reference of SpinnerService
    storageService: StorageService;  //contains reference of StorageService
    translateService: TranslateService  //contains reference of TranslateService
    //protected sharedService: SharedService;  //contains reference of SharedService

    constructor() {
        // Manually retrieve the dependencies from the injector    
        // so that child constructor has no dependencies to be passed  
        const injector = AppInjector.getInjector();
        this.toastrService = injector.get(NotificationService);
        this.spinnerService = injector.get(SpinnerService);
        this.storageService = injector.get(StorageService);
        this.translateService = injector.get(TranslateService);
        //this.sharedService = injector.get(SharedService);
        if (this.storageService.getItem('language') !== null) {
            this.translateService.use(this.storageService.getItem('language'));
        }
    }

}   