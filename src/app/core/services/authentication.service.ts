import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { User } from '../../home/models/userManagement.model'
import { environment } from '../../../environments/environment'

//model for user credentials
export class UserCredentials {
    EmployeeID: string;
    Password: string;
}

@Injectable({
    'providedIn': 'root'
})
export class AuthenticationService {
    apiUrl = environment.baseUrl + 'AccessManagement'; //api url for access management

    constructor(private _httpClient: HttpClient) { }

    //calling access management authenticate api to authenticate the user credentials and to get the menu details
    AuthenticateUser(user: UserCredentials): Observable<any> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this._httpClient.post<User>(this.apiUrl + '/Authenticate', JSON.stringify(user), httpOptions)
            .pipe(
                map((res: any) => {
                    if (res && res.status && res.status.statuscode === 200) {
                        return <string>res.data;
                    }
                }), catchError((error: HttpErrorResponse) => {
                    return throwError(error);
                }
                ))
    }

}