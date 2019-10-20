import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { NbMenuService } from '@nebular/theme';
import { StorageService } from '../../../shared/services/storage.service'

//Component to show menu items
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent implements OnInit {
  menuItems: NbMenuItem[] = [];  //contains all menuItems
  private alive: boolean = true;  //alive property for ngx-admin
  selectedItem: NbMenuItem;  //contains selected menu utem
  menuJSON=[
    {
      title: 'Lot Creation',
      expanded: true,
      sequenceNumber:0,
      children: [
        {
          title: 'Demo Lot Creation',
          link: [], // goes into angular `routerLink`
        },
        {
          title: 'WRS Lot Creation',
          url: '#', // goes directly into `href` attribute
        }
      ],
    },
    {
      title: 'Tool Queues',
      sequenceNumber:1,
      selected : false,
      children: null,
    },
    {
      title: 'Reports',
      selected : false,
      sequenceNumber:2,
      children: null,
    },
    {
      title: 'SPC',
      selected : false,
      sequenceNumber:3,
      children: null,
    },
    {
      title: 'Training',
      selected : false,
      sequenceNumber:4,
      children: null,
    },
    {
      title: 'Experimental Plan',
      sequenceNumber:5,
      selected : false,
      link:"experimentalplan",
      children: null,
    },
    {
      title: 'Other Links',
      selected : false,
      sequenceNumber:6,
      children: null,
    },
  ];

  constructor(private menuService: NbMenuService, private storageService: StorageService) { }

  ngOnInit() {
    //retrieve list of menu items from session storage
    let menuItemsList = this.menuJSON;

    //setting selected to false for each menu item when loading
    menuItemsList.forEach((item: NbMenuItem) => {
      // item.children.forEach((c) => {
      //   //c.parent = null;
      //   c.selected = false;
      // })
      this.menuItems.push(item);
    })

    //setting selected to true for menu item when clicked to highlight
    this.menuService.onItemClick()
      .subscribe((menuItem: any) => {
        if (this.selectedItem) {
          this.toggleMenuSelection(this.selectedItem, false);
        }
        this.selectedItem = menuItem.item;
        this.toggleMenuSelection(menuItem.item, true);
      });
  }

  //method to set selecetd to true to highlight the selected and parent menu
  toggleMenuSelection(item: any, isSelected: boolean) {
    item.selected = isSelected;
    //for highlighting parent menu items
    if (item.parent) {
      this.toggleMenuSelection(item.parent, isSelected);
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
