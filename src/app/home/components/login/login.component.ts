import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/authentication.service'
import { BaseComponent } from '../base/base-component';
import { User, Menus } from '../../models/userManagement.model';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends BaseComponent implements OnInit {
  public userLoginForm: FormGroup;  //creating a form for user login
  userData: User;  //contains user data
  languages: any[];  // array to store language to show the options
  selectedLanguage: any;  //contains selected language
  availableMenus:Menus={icon:'',link:'',sequenceNumber:0,title:'',titleLoc:'',children:new Menus};

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) {
    super()
  }

  ngOnInit() {
    //setting selected language to English
    this.selectedLanguage = "English";
    this.storageService.storeItem("language", 'en-US');
    this.languages = [{ label: 'English', value: 'en-US' }, { label: "Chinese", value: 'zh-CN' }];

    //initializing user login form
    this.userLoginForm = this.formBuilder.group({
      'EmployeeID': new FormControl('', Validators.required),
      'Password': new FormControl('', Validators.required)
    })
  }

  //method to store selected language and to call translate service for selected language
  onLanguageSelect() {
    this.translateService.use(this.selectedLanguage['value']);
    this.storageService.storeItem("language", this.selectedLanguage['value']);
  }

  //Login method to call authentication service method to authenticate user credentials
  login() {
    this.storageService.storeItem("successLoginFlag", "true")
            this.storageService.storeItem("UserID", '699574');
            this.storageService.storeItem("userName", 'Saptarshi');
            this.storageService.storeItem("token", 'abcd');
            this.storageService.storeItem("MenuItems", JSON.stringify(this.availableMenus))
            //this.storageService.storeItem("depatments", JSON.stringify(this.userData.departments))
            // let roles = '';
            // this.userData.roles.forEach(element => {
            //   roles += (element.role + ';')
            // });
            // this.storageService.storeItem('roles', roles)
    this.router.navigateByUrl("/mes");
    //  this.authenticationService.AuthenticateUser(this.userLoginForm.value)
    //   .subscribe(
    //     data => this.userData = data,
    //     error => { },
    //     () => {
    //       if (this.userData) {
    //         //Once user is authenticated, setting required user information to session storage using storage service
    //         this.storageService.storeItem("successLoginFlag", "true")
    //         this.storageService.storeItem("UserID", this.userData.employeeID);
    //         this.storageService.storeItem("userName", this.userData.displayName);
    //         this.storageService.storeItem("token", this.userData.token);
    //         this.storageService.storeItem("MenuItems", JSON.stringify(this.userData.avaiableMenus))
    //         this.storageService.storeItem("depatments", JSON.stringify(this.userData.departments))
    //         let roles = '';
    //         this.userData.roles.forEach(element => {
    //           roles += (element.role + ';')
    //         });
    //         this.storageService.storeItem('roles', roles)
    //         this.router.navigateByUrl("/mes");
    //       }
    //     }
    //   );
  }
}
