import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/components/table/table';
import { FilterModel } from '../../models/filter.model';
import { BaseComponent } from 'src/app/home/components/base/base-component';
import { ExcelService } from '../../services/excel.service';

//Common Tree table component provides a table to display data with functionalities like adding a new row, row level edit and cancel, lazy loading to load next page's data, server side filtering etc with expand option to show child table or picklist
@Component({
  selector: 'app-treetable',
  templateUrl: './treetable.component.html',
  styleUrls: ['./treetable.component.scss'],
})
export class TreeTableComponent extends BaseComponent implements OnInit {
  first: number = 0; //property used for primeng table to reset pagination to first page, if needed
  header: any;  //contains table's column headers data
  colSpanCount: number;  //colSpan count to set colspan for opening child table or picklist
  newRowData = {};  //object to bind to parent table to contain new row's data enetered by user
  searchRowData = {};  //object to bind to parent table to contain filter's entered by user
  newChildRowData = {};  //object to bind to child table to contain new row's data enetered by user
  adding: boolean = false;  //flag used to check if new row is being added to parent table
  childAdding: boolean = false;  //flag used to check if new row is being added to child table
  childEditing: boolean = false;  //flag used to check if child table is in edit mode
  rowCopy: any[] = [];  //array to keep copies of rows for parent table which are in edit mode
  childRowCopy: any;  //object to keep copies of rows for child table which are in edit mode
  childSource: any;  //contains child table's data
  selectedRowData: any; //contains data for current row which is expanded
  filteredAvailableList: any[] = [];  //array to keep available list filtered for current selected row
  selectedList: any[] = [];  //array to keep selected list for picklist for current sekected row
  selectedListCopy: any[] = [];  //array to keep selected list's copy for picklist for current sekected row

  //not using below properties, can be deleted
  //blnImport: boolean = false
  @ViewChild('dt', { 'static': false }) private _table: Table;  //creating view child of table element to access table in this file

  _source: any;  //private property to conatin table data
  @Input('source')  // input property - contains parent table's data and setter for table data
  set source(value: any) {
    this._source = value;
    //updating available and selected list for picklist or child tabls's source
    if (this.header && this.selectedRowData && this.selectedRowData.id) {
      this.selectedRowData = this._source.find(x => x.id === this.selectedRowData.id)
      if (this.header.expandedTemplate === 'picklist') {
        this.selectedList = this.selectedRowData[this.header.expandableField]
        if (this.selectedList && this.selectedList.length > 0)
          this.selectedList = this.selectedList.sort((n1, n2) => n1.sequenceNumber - n2.sequenceNumber);
        this.selectedListCopy = JSON.parse(JSON.stringify(this.selectedList));
        this.filterAvailableList();
      } else if (this.header.expandedTemplate === 'table') {
        this.childSource = this.selectedRowData[this.header.expandableField];
      }
    }
  }

  private _columns: any;  // private property to contain table's column headers
  private headerColumns: any[] = [];
  @Input('columns')  // input property - contains table columns and setter for table columns
  set columns(value: any) {
    this._columns = value;
    if (value) {
      this.header = value[0];
      if (this.header) {
        //setting colspan property to use for child table/picklist
        this.colSpanCount = this.header.columns.filter(x => x.display !== 'none').length + 2;
        this.header.columns.forEach(element => {
          if (element.field !== this.header.expandableField)
            this.headerColumns.push(element);
        });
        //initializing object to bind to search records
        if (this.header && this.lazy && this.searchRowData === {}) {
          this.header.columns.forEach(element => {
            if (element.display !== 'none')
              this.searchRowData[element.field] = '';
          });
        }
      }
    }
  }

  @Input() disableAdd: boolean = false;  //input property to disable add for the parent table
  @Input() disableEdit: boolean = false;  //input property to disable edit for the parent table
  @Input() disableDelete: boolean = false;   //input property to disable delete for the parent table
  @Input() availableList: any;  //input property which contains available list for picklist
  @Input() lazy: boolean = false;  //input property to enable lazy loading for the parent table
  @Input() totalRecords: number;   //input property contains total records for the table - when lazy is enabled
  @Input() rows: number = 15;  //input property to set number of rows per page for the parent table

  //output events to call components back to save/ delete the data by calling respective apis
  @Output() addNew = new EventEmitter<any>();  //parent table output event when new row added
  @Output() edit = new EventEmitter<any>();  //parent table output event when row edited
  @Output() delete = new EventEmitter<any>();  //parent table output event when row deleted
  @Output() childAddNew = new EventEmitter<any>();  //child table output event when new row added
  @Output() childEdit = new EventEmitter<any>();  //child table output event when row edited
  @Output() childDelete = new EventEmitter<any>();  //child table output event when row deleted
  @Output() updateMappings = new EventEmitter<any>();  //picklist output event to save the updated mappings
  @Output() loadNext = new EventEmitter<any>();  //parent table output event to load next page's data, when lazy is enabled

  constructor(private cd: ChangeDetectorRef, private excelService: ExcelService) {
    super();
  }

  ngOnInit() { }

  // parent table methods start
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

  //method toautomatically navigate user back to page 0, resetting the pagination
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
    //calling method to validate for mandatory fields before saving
    if (this.validateData(this.newRowData)) {
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
  onRowEditSave(row: any) {
    let items = [];
    let mandatoryFields = [];
    this.header.columns.forEach(element => {
      if (element.isRequired) {
        if (/^\s*$/.test(row[element.field]))
          mandatoryFields.push(element.header)
      }
    });
    //calling method to validate data for mandatory fields
    if (this.validateData(row)) {
      items.push(row);
      this.edit.emit(items);
      this.resetPagination()
    }
    else
      this.toastrService.showError(mandatoryFields.toString() + " cannot be empty. Please enter a valid " + mandatoryFields.toString(), "");
  }

  //method to cancel edit functionality and using backup to set previouslay saved values back
  onRowEditCancel(row: any, index: number) {
    this._source[index] = this.rowCopy.find(x => x.id === row.id);
  }

  //method to ask for a confirmation before delete and emitting event for delete
  onRowDeleteInit(row: any) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.delete.emit(row);
    }
  }

  //method to expand row to show piclist or child table based on the temaplate defined
  onRowExpand(rowData: any) {
    this.selectedRowData = rowData;
    if (this.header.expandedTemplate === 'picklist') {
      this.selectedList = rowData[this.header.expandableField]
      if (this.selectedList && this.selectedList.length > 0) {
        this.selectedList.sort((n1, n2) => n1.sequenceNumber - n2.sequenceNumber);
        this.selectedListCopy = JSON.parse(JSON.stringify(this.selectedList));
      } else {
        this.selectedListCopy = [];
      }
      this.filterAvailableList();
    } else if (this.header.expandedTemplate === 'table') {
      this.childSource = this.selectedRowData[this.header.expandableField]
    }
  }

  //custom method to export table data in excel file, calling excel service to format and export data 
  exportCSV() {
    let data = this._table._value;
    let columns = this._table._columns;

    if (data.length > 0) {
      this.excelService.formatAndExportAsExcelFile(data, columns);
    }
  }
  // parent table methods end


  // child table methods start
  //method to show placeholder to add a new row when user clickes on add button
  onChildRowAddInit() {
    this.childAdding = true;
    this.newRowData = {};
    this.header.expandedColumns.forEach(element => {
      if (element.display !== 'none')
        this.newRowData[element.field] = '';
    });
  }

  //method to save newly added row - by emitting addNew event and sending data to respective components/api
  onChildRowAddSave() {
    this.childAdding = false;
    let items = [];
    items.push(this.newRowData)
    this.childAddNew.emit({ 'id': this.selectedRowData.id, 'items': items });
  }

  //method to to cancel add row functionality, placeholder for adding new row will be hidden
  onChildRowAddCancel() {
    this.childAdding = false;
  }

  //method to init edit functionality for a row, values will be shown in cell-editors, keeping a copy of current row's data for backup
  onChildRowEditInit(row: any) {
    this.childEditing = true;
    this.childRowCopy = JSON.parse(JSON.stringify(row));
  }

  //method to save edited row - by emitting editRow event and sending data to respective components/api
  onChildRowEditSave(row: any) {
    this.childEditing = false;
    let items = [];
    items.push(row);
    this.childEdit.emit({ 'id': this.selectedRowData.id, 'items': items });
  }

  //method to cancel edit functionality and using backup to set previouslay saved values back
  onChildRowEditCancel(row: any, index: number) {
    this.childSource[index] = this.childRowCopy;
    this.childEditing = false;
  }

  //method to ask for a confirmation before delete and emitting event for delete
  onChildRowDeleteInit(row: any) {
    if (window.confirm('Are you sure you want to delete?')) {
      this.childDelete.emit({ 'id': this.selectedRowData.id, 'item': row });
    }
  }
  // child table methods end


  // picklist method start
  //method to call parent component to save selected mappings
  saveMappings() {
    if (this.selectedList) {
      this.updateMappings.emit({ 'id': this.selectedRowData.id, 'items': this.selectedList });
      this.cd.detectChanges();
    }
  }

  //method to set sequence number when a selected item/s moved to target
  onMoveToTarget(event: any) {
    let count = this.selectedListCopy.length + 1;
    let groupId = this.selectedRowData.id;
    let item;
    event.items.forEach(element => {
      item = {};
      item.sequenceNumber = count;
      item[this.header.expandedItemIdField] = element.id;
      item[this.header.expandedItemNameField] = element[this.header.expandedItemNameField];
      item[this.header.expandedGroupIdField] = groupId;
      this.selectedListCopy.push(item);
      count++;
    });
    this.selectedList = JSON.parse(JSON.stringify(this.selectedListCopy));
  }

  //method to call filteravailablelist  and updateSequenceNumber, when an item/s moved back to source
  onMoveToSource(event: any) {
    this.filterAvailableList();
    if (this.selectedList && this.selectedList.length > 0)
      this.updateSequenceNumber(0);
    this.selectedListCopy = JSON.parse(JSON.stringify(this.selectedList));
  }

  //method to call update sequence when user reorders target list
  onTargetReorder(event: any) {
    let index = this.selectedList.findIndex(x => x[this.header.expandedItemIdField] === event.items[0][this.header.expandedItemIdField]);
    this.updateSequenceNumber(index);
  }

  //method to update sequence number for all items in selected list
  private updateSequenceNumber(index: number) {
    for (let i = index; i < this.selectedList.length; i++) {
      this.selectedList[i].sequenceNumber = i + 1;
    }
  }

  //method to filter available list, if any item is moved to/from target list
  private filterAvailableList() {
    this.filteredAvailableList = JSON.parse(JSON.stringify(this.availableList));
    let index;
    if (this.selectedList && this.selectedList.length > 0) {
      this.selectedList.forEach((element: any) => {
        index = this.filteredAvailableList.findIndex(x => x.id === element[this.header.expandedItemIdField]);
        this.filteredAvailableList.splice(index, 1);
      });
    }
  }
  //picklist methods end 

}


