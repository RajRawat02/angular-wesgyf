import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class SharedService {

    constructor(private http: HttpClient) { }

    //method to read column header and returning the columns back for componentName parameter
    getColumnHeaders(componentName: string) {
        var filename = 'assets/columnHeaders.json';
        return this.http.get(filename)
            .pipe(
                map(res => {
                    return res[0][componentName];
                })
            )
    }

    getESRLotnumbersColumnHeaders(componentName: string) {
        return this.http.get('assets/columnHeaders-ESRLotNumbers.json')
            .pipe(
                map(res => {
                    return res[0][componentName];
                })
            )
    }

    getESRColumnHeaders(componentName: string) {
        return this.http.get('assets/columnHeaders-ESR.json')
            .pipe(
                map(res => {
                    return res[0][componentName];
                })
            )
    }

    getReportsHeaders(componentName: string) {
        return this.http.get('assets/reports.json')
            .pipe(
                map(res => {
                    return res[0][componentName];
                })
            )
    }

    getPlanningColumnHeaders(componentName: string) {
        return this.http.get('assets/columnHeaders-planning.json')
            .pipe(
                map(res => {
                    return res[0][componentName];
                })
            )
    }

    getLotManagementColumnHeaders(componentName: string) {
        return this.http.get('assets/columnHeaders-lotmanagement.json')
            .pipe(
                map(res => {
                    return res[0][componentName];
                })
            )
    }
}