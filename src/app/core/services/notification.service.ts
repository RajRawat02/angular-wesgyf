import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    'providedIn': 'root'
})
export class NotificationService {
    constructor(private toastrService: ToastrService) { }

    //method to show notification 
    public showNotification(message, detail) {
        this.toastrService.show(message, detail)
    }

    //method to show info type notification - blue
    public showInfo(message, detail) {
        this.toastrService.info(message, detail)
    }

    //method to show success type notification - green 
    public showSuccess(message, detail) {
        this.toastrService.success(message, detail)
    }

    //method to show error type notification - red
    public showError(error, detail) {
        this.toastrService.error(error, detail)
    }
}