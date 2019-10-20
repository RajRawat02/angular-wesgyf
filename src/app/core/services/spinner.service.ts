import { Injectable } from '@angular/core';

@Injectable({
    'providedIn': 'root'
})
export class SpinnerService {
    isLoading: boolean = false; //property to show/hide spinner

    constructor() { }
}