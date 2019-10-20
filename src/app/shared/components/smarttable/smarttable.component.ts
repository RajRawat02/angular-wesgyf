
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FilterModel } from '../../models/filter.model';
import { Table } from 'primeng/table';
import { BaseComponent } from 'src/app/home/components/base/base-component';
import { ExcelService } from '../../services/excel.service';

//Common Smart table component provides a table to display data with functionalities like adding a new row, row level edit and cancel, lazy loading next page's data, server side filtering etc
@Component({
  selector: 'app-smarttable',
  templateUrl: './smarttable.component.html',
  styleUrls: ['./smarttable.component.scss']
})
export class SmartTableComponent extends BaseComponent implements OnInit {
  first: number = 0; //property used for primeng table to reset pagination to first page, if needed
  header: any; //contains table's column headers data
  newRowData = {};  //object to bind to table to contain new row's data enetered by user
  searchRowData = {};  //object to bind to table to contain filter's entered by user
  adding: boolean = false;  //flag used to check if new row is adding or not
  rowCopy: any[] = [];  //array to keep copies of rows which are in edit mode

  //not using below properties, can be deleted
  // selectedRowData: any;
  // enableEdit: boolean = true;
  // blnImport: boolean = false  //
  // isDisabled: boolean = false;
  // selectedRows: any = {};
  // minField: any;  //
  // maxField: any;  // 
  @ViewChild('dt', { 'static': false }) private _table: Table; //creating view child of table element to access table in this file

  _source: any;   // private property to contain table data
  @Input('dataIn')  // input property - contains table data and setter for table data
  set dataIn(value: any) {
    this._source = value;
    //to fix intermittent pagination issue
    if (!this.lazy && value && value.length > 0) {
      this.totalRecords = value.length;
    }
  }

  private _columns: any;   // private property to contain table's column headers
  @Input('headerLabels') // input property - contains table columns and setter for table columns
  set headerLabels(value: any) {
    this._columns = value;
    if (value) {
      this.header = value[0];

      //initializing object to bind to search/filter records
      if (this.header && this.lazy && this.searchRowData === {}) {
        this.header.columns.forEach(element => {
          if (element.display !== 'none')
            this.searchRowData[element.field] = '';
        });
      }
    }
  }

  @Input() disableAdd: boolean = false;  //input property to disable add for the table
  @Input() disableEdit: boolean = false;   //input property to disable edit for the table
  @Input() disableDelete: boolean = false;    //input property to disable delete for the table
  @Input() lazy: boolean = false;   //input property to enable lazy loading for the table
  @Input() totalRecords: number;   //input property for total records for the table - when lazy is enabled
  @Input() rows: number = 15;   //input property to set number of rows per page for the table

  //output events to call components back to save/ delete the data by calling respective apis
  @Output() addNew = new EventEmitter<any>();  //output event when new row added
  @Output() edit = new EventEmitter<any>();  //output event when row edited
  @Output() delete = new EventEmitter<any>();  //output event when row deleted
  @Output() loadNext = new EventEmitter<any>();   //output event to load next page's data, when lazy is enabled

  constructor(private excelService: ExcelService) {
    super();
  }

  ngOnInit() { }

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

  //method to show placeholder to add a new row when user clickes on add button
  onRowAddInit() {
    this.adding = true;
    this.newRowData = {};
    this.header.columns.forEach(element => {
      if (element.display !== 'none')
        this.newRowData[element.field] = '';
    });
  }

  //method to save newly added row - by emitting addNew event and sending data to respective components/api
  onRowAddSave() {
    let items = [];
    let mandatoryFields = [];
    this.header.columns.forEach(element => {
      if (element.isRequired) {
        if (/^\s*$/.test(this.newRowData[element.field]))
          mandatoryFields.push(element.header)
      }
    });
    //validating min max values before saving the row
    if (!this.validateMaxMin(this.newRowData)) {
      this.toastrService.showError("Max value should be greater than min value", "")
    }
    else if (this.validateData(this.newRowData)) {
      this.adding = false;
      items.push(this.newRowData)
      this.addNew.emit(items);
      this.resetPagination()
    }
    else
      this.toastrService.showError(mandatoryFields.toString() + " cannot be empty. Please enter a valid " + mandatoryFields.toString(), "");
  }

  //method to validate data for required fields before saving the row
  private validateData(row: any) {
    let isValid = true;
    this.header.columns.some(element => {
      if (element.isRequired)
        if (/^\s*$/.test(row[element.field])) {
          isValid = false;
          return isValid;
        }
    });
    return isValid;
  }

  //method to to cancel add row functionality, placeholder for adding new row will be hidden
  onRowAddCancel() {
    this.adding = false;
  }

  //method to init edit functionality for a row, values will be shown in cell-editors, keeping a copy of current row's data for backup
  onRowEditInit(row: any) {
    if (this.rowCopy && this.rowCopy.length > 0) {
      if (this.rowCopy.find(x => x.id === row.id)) {
        let itemIndex = this.rowCopy.findIndex(d => d.id === row.id);
        this.rowCopy.splice(itemIndex, 1)
      }
      this.rowCopy.push(JSON.parse(JSON.stringify(row)));
    } else {
      this.rowCopy.push(JSON.parse(JSON.stringify(row)));
    }
  }

  //method to save edited row - by emitting editRow event and sending data to respective components/api
  onRowEditSave(row: any, event: Event) {
    let items = [];
    let mandatoryFields = [];
    this.header.columns.forEach(element => {
      if (element.isRequired) {
        if (/^\s*$/.test(row[element.field]))
          mandatoryFields.push(element.header)
      }
    });
    //validating min and max values 
    if (!this.validateMaxMin(row)) {
      this.toastrService.showError("Max value should be greater than min value", "");
      // event.preventDefault();
      event.stopPropagation();
      return false;
    }
    //calling method to validate data for mandatory fields
    else if (this.validateData(row)) {
      items.push(row);
      this.edit.emit(items);
      this.resetPagination()
    }
    else {
      this.toastrService.showError(mandatoryFields.toString() + " cannot be empty. Please enter a valid " + mandatoryFields.toString(), "");
      // event.preventDefault();
      event.stopPropagation();
      return false;
    }
  }

  //method to validate min max values - like spec min and spec max
  validateMaxMin(row: any) {
    let isValid = true;
    this.header.columns.some(element => {
      if (element.max && element.min) {
        if ((row[element.max]) && row[element.min]) {
          if (parseInt(row[element.max]) < parseInt(row[element.min]))
            isValid = false
        }
      }
    });
    return isValid;
  }

  //method to cancel edit functionality and using backup to set previouslay saved values back
  onRowEditCancel(row: any, index: number) {
    this._source[index] = this.rowCopy.find(x => x.id === row.id);
  }

  //method to ask for a confirmation before delete and emitting event for delete
  onRowDeleteInit(row: any) {
    //this.delRow = row;
    if (window.confirm('Are you sure you want to delete?')) {
      this.delete.emit(row);
      //this.delRow = null;
    }
  }

  //custom method to export table data in excel file, calling excel service to format and export data 
  exportCSV() {
    let data = this._table._value;
    let columns = this._table._columns;

    if (data.length > 0) {
      this.excelService.formatAndExportAsExcelFile(data, columns);
    }
    //this._table.exportCSV();
  }

}