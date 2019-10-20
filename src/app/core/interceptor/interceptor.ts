import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, finalize } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';
import { SpinnerService } from '../services/spinner.service';
import { StorageService } from 'src/app/shared/services/storage.service';

//custom interceptor to intercept all http requests
@Injectable({
    providedIn: 'root'
})
export class customInterceptor implements HttpInterceptor {
    constructor(private toastrService: NotificationService, private spinnerService: SpinnerService, private storageService: StorageService) { }

    //implementing intercept method to set httpheaders and error handling
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let userToken = this.storageService.getItem('token');
        let language = this.storageService.getItem('language');

        //setting spinner to true for each http request
        setTimeout(() => {
            if (!request.url.includes('GetEquipmentLayout'))
                this.spinnerService.isLoading = true;
        }, 0);

        //modyfying the http request to append the access token and selected language
        const modifiedReq = request.clone({
            headers: new HttpHeaders({
                'Authorization': `Bearer ${userToken}`,
                'Accept-Language': language,
                'Content-Type': 'application/json'
            })
        });

        return next.handle(modifiedReq)
            .pipe(
                tap((event: HttpEvent<any>) => {
                    // common success message to show success when status is 201
                    // if (event instanceof HttpResponse && event.status === 201) {
                    //     this.toastrService.showSuccess('Data saved successfully.', event.statusText);
                    // }
                }),
                // retry(1),      // retry will call api again for the counter given if http call fails for the first time
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';

                    //getting error messages from api response based on diff error statuses and showing the error using toastrService
                    if (error.status === 400 && error.error) {
                        let key = Object.keys(error.error)[0];
                        errorMessage = error.error[key];
                        this.toastrService.showError(errorMessage, '');
                    } else if (error.error && error.error.status) {
                        errorMessage = error.error.status.message;
                        this.toastrService.showError(errorMessage, '');
                    } else {
                        //setting below message if no message is coming from API, or due to some connection issue, request could not reach api
                        errorMessage = 'Connection Error';
                        this.toastrService.showError(errorMessage, 'Connection failed. Please try again after sometime')
                    }

                    //throwing the errormessage to respective component
                    return throwError(errorMessage);
                }),
                finalize(() => {
                    //setting spinner to false once http request is closed
                    setTimeout(() => {
                        this.spinnerService.isLoading = false;
                    }, 0);
                })
            )
    }

}