import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FilterModel } from '../../models/filter.model';
import { BaseComponent } from 'src/app/home/components/base/base-component';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})

export class TableComponent extends BaseComponent implements OnInit {
  dateFilters: Date; //Contains selected date from calendar
  isFilterInitilized = false; //flag to initialize date filter
  optionsForChcekbox: any = []; // contains options for checkboxes
  first: number = 0; //property used for primeng table to reset pagination to first page, if needed
  searchRowData = {};  //object to bind to table to contain filter's entered by user
  selectedRows: any; //contains selected row from table

  @ViewChild('dt', { 'static': false }) private _table: Table; //creating view child of table element to access table in this file
  @ViewChild('cal', { 'static': false }) private calendar: any; //creating view child of primeng calendar to access calendar in this file

  _data: any;  // private property to contain table data
  @Input('data') // input property - contains table data and setter for table data
  set data(value: any) {
    this._data = value;
    //to fix intermittent pagination issue
    if (!this.lazy && value && value.length > 0) {
      this.totalRecords = value.length;
    }
  }

  _columns: any; // private property to contain table's column headers
  @Input('columns') // input property - contains table columns and setter for table columns
  set columns(value: any) {
    if (value && value[0] && value[0].columns)
      this._columns = value[0].columns;

    //creating object to bind to search records
    if (this._columns && this.lazy && this.searchRowData === {}) {
      this._columns.forEach(element => {
        if (element.display !== 'none') {
          this.searchRowData[element.field] = '';
          if (element.type === 'date' || element.type === 'shortDate')
            this.searchRowData[element.field + 'Range'] = '';
        }
      });
    }
  }

  selectionMode: string; // private property to contain table's row selection mode
  @Input('rowSelection') // input property - contains table's row selection mode
  set rowSelection(value: string) {
    if (value === '') {
      this.selectionMode = '';
    }
    if (value === 'single') {
      this.selectionMode = 'single';
    }
    if (value === 'multi') {
      this.selectionMode = 'multiple';
    }
  }

  @Input() totalRecords: number; //input property for total records for the table - when lazy is enabled
  @Input() rows: number = 15; //input property to set number of rows per page for the table
  @Input() lazy: boolean = false; //input property to enable lazy loading for the table

  @Output() loadNext = new EventEmitter<FilterModel>(); //output event to load next page's data, when lazy is enabled
  @Output() rowSelectionChange = new EventEmitter<any>(); //output event to pass selected row/s object
  @Output() onLinkClick = new EventEmitter<any>(); //output event for column type link, to send link click event

  constructor(private excelService: ExcelService) {
    super()
    //initialize checkbox options
    this.optionsForChcekbox = [
      { label: 'True', value: 'true' },
      { label: 'False', value: 'false' }];
  }

  ngOnInit() { }

  //method to initialize data range filter
  initializeFilter() {
    var _self = this;
    this._table.filterConstraints['dateRangeFilter'] = (value, filter): boolean => {
      let dateValue = new Date(value);
      if (_self.dateFilters) {
        var s = _self.dateFilters[0].getTime();
        var e;
        if (_self.dateFilters[1]) {
          e = _self.dateFilters[1].getTime() + 86400000;
        } else {
          e = s + 86400000;
        }
        return dateValue.getTime() >= s && dateValue.getTime() <= e;
      }
    }
  }

  //method to load next page's data when lazy is enabled, setting records to skip and load, and calling api using loadNext event
  loadLazy(event: any) {
    if (event) {
      let obj: FilterModel = new FilterModel();
      obj.recordsToSkip = event.first;
      obj.recordsToFetch = event.rows;
      obj.rowsPerPage = event.rows;
      obj.filters = this.searchRowData
      this.loadNext.emit(obj);
    }
  }

  //method to automatically navigate user back to page 0, resetting the pagination
  resetPagination() {
    this.first = 0;
  }

  //method will be called if lazy is enabled - creating filter model using searchRowData, and calling api to get matching records
  onSearch() {
    let obj: FilterModel = new FilterModel();
    obj.recordsToSkip = 0;
    obj.recordsToFetch = this.rows;
    obj.filters = this.searchRowData
    this.loadNext.emit(obj);
    this.resetPagination();
  }

  //trigger search method on enter key
  triggerSearch(event: any) {
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      this.onSearch();
    }
  }

  //trigger search method for date 
  triggerSearchForDate(event: any, value, fieldName) {
    this.searchRowData[fieldName + 'Range'] = [];
    if (value) {
      if (value[0])
        this.searchRowData[fieldName + 'Range'][0] = value[0].toLocaleString().replace(/[^ -~]/g, '');
      if (value[1]) {
        var endDate = new Date(value[1])
        endDate.setHours(23, 59, 59)
        this.searchRowData[fieldName + 'Range'][1] = endDate.toLocaleString().replace(/[^ -~]/g, '');
      }
      else {
        var startdate = new Date(value[0])
        startdate.setHours(0, 0, 0)
        var endDate = new Date(value[0])
        endDate.setHours(23, 59, 59)
        this.searchRowData[fieldName + 'Range'][0] = startdate.toLocaleString().replace(/[^ -~]/g, '');
        this.searchRowData[fieldName + 'Range'][1] = endDate.toLocaleString().replace(/[^ -~]/g, '');
      }
    }
    this.onSearch();
  }

  //trigger search method for date on enter key
  triggerSearchForDateOnEnter(event: any, value, fieldName) {
    this.searchRowData[fieldName + 'Range'] = [];
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      if (value) {
        if (value[0])
          this.searchRowData[fieldName + 'Range'][0] = value[0].toLocaleString().replace(/[^ -~]/g, '');
        if (value[1]) {
          var endDate = new Date(value[1])
          endDate.setHours(23, 59, 59)
          this.searchRowData[fieldName + 'Range'][1] = endDate.toLocaleString().replace(/[^ -~]/g, '');
        }
        else {
          var startdate = new Date(value[0])
          startdate.setHours(0, 0, 0)
          var endDate = new Date(value[0])
          endDate.setHours(23, 59, 59)
          this.searchRowData[fieldName + 'Range'][0] = startdate.toLocaleString().replace(/[^ -~]/g, '');
          this.searchRowData[fieldName + 'Range'][1] = endDate.toLocaleString().replace(/[^ -~]/g, '');
        }
      }
      this.onSearch();
    }
  }

  //method to filter data from table based on selected value from list
  filterStatus(event, field) {
    this.onSearch();
  }

  //method trigger on row select
  onRowSelect(event) {
    this.rowSelectionChange.emit(this.selectedRows);
  }

  //method trigger on row unselect
  onRowUnselect(event) {
    this.rowSelectionChange.emit(this.selectedRows);
  }

  //method to trigger on link click
  followLink(link: any) {
    this.onLinkClick.emit(link);
  }

  //method to filter date from table
  filterDate(event: any, field, filterConstraintsName, dateFilters) {
    if (dateFilters) {
      if (!this.isFilterInitilized && this._data && this._data.length > 0 && this._table && dateFilters) {
        this.initializeFilter();
        this.isFilterInitilized = true;
      }
      return this._table.filter(event, field, filterConstraintsName)
    }
    else
      return this._table.filter('', field, filterConstraintsName)
  }

  //method trigger on date selection change
  onClearDate(event) {
    if (!event) {
      this.onSearch();
    }
  }

  //method trigger on calendar click
  onClick(event: Event) {
    this.calendar.overlayVisible = true;
    this.calendar.appendTo = "body"
  }

  //custom method to export table data in excel file, calling excel service to format and export data 
  exportCSV() {
    let data = this._table._value;
    let columns = this._table._columns;
    if (data.length > 0) {
      this.excelService.formatAndExportAsExcelFile(data, columns);
    }
  }
}
