import { Component, OnInit } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';
import { BaseComponent } from '../base/base-component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';

//Layout component to define common layout for the application - including header, sidebar 
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent extends BaseComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() { }

}
