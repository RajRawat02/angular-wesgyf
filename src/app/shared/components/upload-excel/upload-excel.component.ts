import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { BaseComponent } from 'src/app/home/components/base/base-component';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.scss']
})
export class UploadExcelComponent extends BaseComponent implements OnInit {
  display: boolean = false;//flag for dialog visibility
  file: File;//file object for imported file
  buttonDisabled: boolean = true;//flag for disabling upload button
  importData: any;//data to be imported
  showTable: boolean = false;//flag for showing table
  disableImportBtn: boolean = true;//flag for disabling import data

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef;

  _data: any
  @Input('data')
  set data(value: any) {
    this._data = value;//imported data
  }

  _columns: any
  @Input('headerLabels')
  set headerLabels(value: any) {
    this._columns = value;//column headers
  }

  _buttonLabel: any
  @Input('buttonLabel')
  set buttonLabel(value: any) {
    this._buttonLabel = value;//input parameter button label
  }

  _idCheckFlag: any
  @Input('idCheckFlag')
  set idCheckFlag(value: any) {
    this._idCheckFlag = value;//flag input parameter for checking id
  }

  @Output() addNew = new EventEmitter<any>();

  constructor() {
    super();
  }

  ngOnInit() {
    if (!this._buttonLabel) {
      this._buttonLabel = "Import From Excel";//setting button label if not sent as input parameter
    }
  }

  //method for showing dialog
  showDialog() {
    this.display = true;
  }

  //method triggered file selected
  incomingfile(event) {
    this.file = event.target.files[0];
    if (this.file) {
      this.buttonDisabled = false;
    }
    else {
      this.buttonDisabled = true;
    }
  }

  //method called on click of the upload button
  Upload() {
    let fileName = this.file.name;
    let format = fileName.split('.');
    //check for file type
    if (format[format.length - 1] === 'csv' || format[format.length - 1] === 'xlsx') {
      this.importData = [];
      this.disableImportBtn = false;
      this.uploadFromExcel(this.file)
    }
    else {
      this.toastrService.showError('Invalid File Format', '');
    }
  }

  //method to read from excel and show in table
  public uploadFromExcel(file: File) {
    this.spinnerService.isLoading = true;
    let excelJSON, tempJSON = [], arrayBuffer: any;
    let changedJSON = [];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    //reading from file
    fileReader.onload = (e) => {
      arrayBuffer = fileReader.result;
      var data = new Uint8Array(arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary", cellDates: true, dateNF: 'yyyy/mm/dd;@' });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      //converting sheet data to json data
      excelJSON = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
      //checking headers
      if (this.validateExcel(excelJSON)) {
        let dateColumns = [];
        let codeColumns = [];
        //checking for date or code fields
        this._columns[0].columns.forEach(e => {
          if (e.type === 'date') {
            dateColumns.push(e.header);
          }
          if (e.type === 'code') {
            codeColumns.push(e.header);
          }
        });
        //converting date fields and code fields
        excelJSON.forEach(element => {
          dateColumns.forEach((x) => {
            element[x] = new Date(element[x]).toLocaleString()
          })
          codeColumns.forEach((x) => {
            element[x] = element[x].toString();
          })
          //checking for cases where id check flag is present: for product,route and bom extra attributes
          if (this._idCheckFlag) {
            if (element.Id) {
              tempJSON.push(element);
            }
          }
          else {
            tempJSON.push(element);
          }
        });
        //converting json to string and replacing headers
        if (tempJSON.length > 0) {
          let tempJSONString = JSON.stringify(tempJSON);
          this._columns[0].columns.forEach(column => {
            tempJSONString = tempJSONString.split('"' + column.header + '":').join('"' + column.field + '":');
          });
          changedJSON = JSON.parse(tempJSONString);
          //removing id and expander fields
          changedJSON.forEach((e) => {
            if (e.id === '') {
              delete e.id;
            }
            if (e.hasOwnProperty('edcParameters')) {
              delete e.edcParameters;
            }
            if (e.hasOwnProperty('defects')) {
              delete e.defects;
            }
            if (e.hasOwnProperty('qiParameters')) {
              delete e.qiParameters;
            }
            if (e.hasOwnProperty('ocapParameters')) {
              delete e.ocapParameters;
            }
            if (e.hasOwnProperty('failmodes')) {
              delete e.failmodes;
            }
            if (e.hasOwnProperty('availableToolingTypes')) {
              delete e.availableToolingTypes;
            }
          })
          this.importData = changedJSON;
          this.showTable = true;
          this.spinnerService.isLoading = false;
        }
        else {
          this.toastrService.showError('No rows to add', '');
          this.spinnerService.isLoading = false;
        }
      }
      else {
        //error in case column headers do not match
        console.log("Error: Number of columns do not match");
        this.toastrService.showError('Number of columns do not match', '');
        this.spinnerService.isLoading = false;
      }
    }
  };

  //method to validate columns and headers of imported data columns
  validateExcel(excelJSON) {
    let keysTable = [];
    //removing space and converting to lowercase
    this._columns[0].columns.forEach(element => {
      if (element.field === 'id') {
        keysTable.push(element.header.toLowerCase().replace(/\s+/g, ''))
      }
      else if (element.display !== 'none') {
        keysTable.push(element.header.toLowerCase().replace(/\s+/g, ''))
      }
    });
    var keysJSON = Object.keys(excelJSON[0]);
    keysJSON = keysJSON.map(v => v.toLowerCase().replace(/\s+/g, ''));
    var isValid: boolean = true;
    //checking table headers and imported data column headers
    keysTable.forEach(i => {
      if (!keysJSON.includes(i)) {
        isValid = false;
        return;
      }
    });
    return isValid;
  }

  //method to check for import event
  checkImport(event: any) {
    if (event === false) {
      this.disableImportBtn = !event;
    }
  }

  //method to emit imported data
  sendImportData() {
    if (!this.disableImportBtn) {
      this.addNew.emit(this.importData);
      this.clearData();
    }
  }

  //method to run cell editor validations by reloading data
  validateExcelAgain() {
    let data: any = [];
    this.disableImportBtn = false;
    data = this.importData;
    this.importData = [];
    setTimeout(() => {
      this.importData = data;
    }, 300);
  }

  //method to clear data
  clearData() {
    this.display = false;
    this.importData = [];
    this.disableImportBtn = false;
    this.showTable = false;
    this.fileInput.nativeElement.value = '';
  }
}
