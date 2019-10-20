import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage.service'
import { BaseComponent } from '../base/base-component';

//header component to add common header to the application layout
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent implements OnInit {
	items: any[];

	constructor(private sidebarService: NbSidebarService, private strorageService: StorageService, private router: Router) {
		super();
	}

	ngOnInit() {
		//initializes items for user profile option
		this.items = [
			{ label: 'Profile', icon: 'pi pi-user' },
			{ label: 'Log Out', icon: 'pi pi-sign-out', command: () => this.logOut() }];
	}

	//clear the sessionStorage and navigate user to login page
	logOut() {
		this.strorageService.clearSeesion();
		this.router.navigateByUrl("/auth/login");
	}

	//toggle the sidebar using ngx-admin's sidebar service
	toggle() {
		this.sidebarService.toggle(true);
		return false;
	}
}
