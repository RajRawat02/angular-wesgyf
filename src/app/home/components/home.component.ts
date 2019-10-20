import { Component, OnInit } from '@angular/core';

//Home component to bootstrap when starting the application
@Component({
    selector: 'app-home',
    template: `<router-outlet></router-outlet>`
})
export class HomeComponent implements OnInit {

    ngOnInit() {
    }

}
