import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

//Common cell editor component to be used across all table components for cell editing - provides a common place to put validations
@Component({
  selector: 'app-cell-editor',
  templateUrl: './cell-editor.component.html',
  styleUrls: ['./cell-editor.component.scss']
})
export class CellEditorComponent implements OnInit {
  showError: boolean = false; //flag to show the error 
  isMandatory: boolean = false; //flag to check mandatory field
  isValid: boolean = true; //flag to check whether the input is valid or not
  importErrorMsg: string; //contains error message for import excel
  isDisabled: boolean = false; //flag to disable the fields

  @Input() col: any = {}; //contains table column
  @Input() rowData: any = {}; // contains row data

  _action: string; //contains action like add, edit or import
  @Input('action')
  set action(value: any) {
    this._action = value;
    if (value === 'import') {
      this.validateInput(this.rowData[this.col.field], this.col.type);
    }
  }

  @Output() validOut = new EventEmitter<any>(); //output event emitter for valid input excel data

  constructor() { }

  ngOnInit() {
  }

  //To validate the input for import excel
  validateInput(event: string, colType: any) {
    if (this.col.isDisabled === true) {
      this.isDisabled = true;
    }
    if (event && event !== '') {
      switch (colType) {
        case 'date':
          //try parsing date to date
          let newDate = Date.parse(event);
          if (isNaN(newDate)) {
            this.isValid = false;
            this.importErrorMsg = 'Please enter date values only';
            this.showErrorMessage();
          }
          else {
            this.isValid = true;
          }
          break;
        case 'time':
          this.isValid = true;
          break;
        case 'list':
          if (!this.col.options.find(x => x.label === event.toString())) {
            this.isValid = false;
            this.showErrorMessage();
          }
          else {
            this.isValid = true;
          }
          this.validOut.emit(this.isValid);
          break;
        case 'number':
          if (event.toString().match(/[^0-9 ]+/g)) {
            this.isValid = false;
            this.importErrorMsg = 'Please enter numeric values only';
            this.showErrorMessage();
          }
          else {
            this.isValid = true;
          }
          this.validOut.emit(this.isValid);
          break;
        case 'float':
          if (event.toString().match(/[-+]?[0-9]*\.?[0-9]*/g)) {
            this.isValid = false;
            this.importErrorMsg = 'Please enter numeric values only';
            this.showErrorMessage();
          }
          else {
            this.isValid = true;
          }
          this.validOut.emit(this.isValid);
          break;
        case 'range':
          if (event.toString().match(/[^0-9 ]+/g)) {
            this.isValid = false;
            this.importErrorMsg = 'Please enter numeric values only';
            this.showErrorMessage();
          }
          else {
            this.isValid = true;
          }
          this.validOut.emit(this.isValid);
          break;
        case 'code':
          if (event.toString().match(/[^a-zA-Z0-9]+/g)) {
            this.isValid = false;
            this.importErrorMsg = 'Please enter allowed characters only : alphabets and numbers without spaces.';
            this.showErrorMessage();
          }
          else {
            this.isValid = true;
          }
          this.validOut.emit(this.isValid);
          break;
        case 'noValidate':
          this.importErrorMsg = '';
          this.isValid = true;
          break;
        default:
          if (event.toString().match(/[^a-zA-Z0-9-_ ]+/g)) {
            this.isValid = false;
            this.importErrorMsg = 'Allowed characters - A-z, a-z, 0-9, -, _';
            this.showErrorMessage();
          }
          else {
            this.isValid = true;
          }
          this.validOut.emit(this.isValid);
      }
    } else {
      if (this.col.isRequired && event === '') {
        this.isValid = false;
        this.importErrorMsg = 'This field can not be left blank';
        this.validOut.emit(this.isValid);
      }
    }
  }

  //To get the time from calender
  onTimeSelect(event: any) {
    let hour = new Date(event).getHours() > 10 ? new Date(event).getHours() : `0${new Date(event).getHours()}`;
    let min = new Date(event).getMinutes() > 10 ? new Date(event).getMinutes() : `0${new Date(event).getMinutes()}`;
    let sec = new Date(event).getSeconds() > 10 ? new Date(event).getSeconds() : `0${new Date(event).getSeconds()}`;
    this.rowData[this.col.field] = `${hour}:${min}:${sec}`;
  }

  //To validate the input text
  validateText(event) {
    if (this.col.isRequired) {
      if (/^\s+$/.test(event.target.value))
        this.showMandatoryMessage()
    }
    if (event.target.value.match(/[^a-zA-Z0-9-_ ]+/g)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]/g, '')
      this.rowData[this.col.field] = event.target.value;
      this.showErrorMessage();
    }
  }

  //To show the required field message
  showMandatoryMessage() {
    this.isMandatory = true;
    setTimeout(() => {
      this.isMandatory = false;
    }, 2500);
  }

  //To validate the code.Code should contain only alphabets and numbers
  validateCode(event) {
    if (this.col.isRequired) {
      if (event.target.value === '')
        this.showMandatoryMessage()
    }
    if (event.target.value.match(/[^a-zA-Z0-9]+/g)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/g, '')
      this.rowData[this.col.field] = event.target.value;
      this.showErrorMessage();
    }
  }

  //To validate the number input
  validateNumber(event) {
    if (this.col.isRequired) {
      if (event.target.value === '')
        this.showMandatoryMessage()
    }
    // /[\w\s\d-_] ^[-+]?\d*$ ^[0-9]*$
    if (event.target.value.match(/[^\d]/g)) {
      event.target.value = event.target.value.replace(/[^\d]/g, '')
      this.rowData[this.col.field] = event.target.value;
      this.showErrorMessage();
    }
  }

  //To validate the float number
  validateFloatNumber(event) {
    if (this.col.isRequired) {
      if (event.target.value === '')
        this.showMandatoryMessage()
    }
    // /[\w\s\d-_] ^[-+]?\d*$ ^[0-9]*$

    if (event.target.value.match(/[^\d\.\d)]/g)) {
      event.target.value = event.target.value.replace(/[^\d\.\d)]/g, '')
      this.rowData[this.col.field] = event.target.value;
      this.showErrorMessage();
    }
  }

  //To check the mandatory field
  mandatoryFieldChecking(event) {
    if (this.col.isRequired) {
      if (event.target.value === '')
        this.showMandatoryMessage()
    }
  }

  //To validate the max min range 
  validateRange(el) {
    if (el.value != "") {
      if (parseInt(el.value) < parseInt(el.min)) {
        el.value = el.min;
      }
      if (parseInt(el.value) > parseInt(el.max)) {
        el.value = el.max;
      }
    }
  }

  //To show the error message
  private showErrorMessage() {
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 2500);
  }
}



