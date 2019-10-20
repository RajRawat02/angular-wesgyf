import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class StorageService {
    
    constructor(private http: HttpClient) {}

    //method to store item in sessionStorage
    public storeItem(key: string, value: any) {
        sessionStorage.setItem(key, value)
    }

    //method to get item from sessionStorage
    public getItem(key: string) {
        let value = sessionStorage.getItem(key);
        return value;
    }

    //method to clear sessionstorage
    public clearSeesion() {
        sessionStorage.clear();
    }
}