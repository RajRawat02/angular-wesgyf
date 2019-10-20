import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

//Custom Auth guard to navigate to login page if user is not logged in
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    //checking if success login flag is set, if not navigating user to login page
    canActivate(route: ActivatedRouteSnapshot) {
        if (sessionStorage.getItem('successLoginFlag') === 'true') {
            return true;
        } else if (!(route.data.roles != undefined && route.data.roles.indexOf() != -1)) {
            this.router.navigateByUrl("/auth");
            return false;
        } else {
            this.router.navigateByUrl("/auth");
            return false;
        }
    }
}