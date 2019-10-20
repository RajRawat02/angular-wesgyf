import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cell-editor-lf',
  templateUrl: './cell-editor-lf.component.html',
  styleUrls: ['./cell-editor-lf.component.scss']
})
export class CellEditorLfComponent implements OnInit {

  @Input() col: any = {};

  _rowData:any={};
  @Input("rowData")
  set rowData(value: any) {
    if(this.col.type=="date" &&value[this.col.field]!=undefined&&value[this.col.field]!=null)
    {
      value[this.col.field]=new Date(value[this.col.field]);
    }
    this._rowData=value;
  }
  @Input() action: string;
  showError: boolean = false;
  
  constructor() { }

  ngOnInit() {
  }
  // validateText(event) {
  //   if (event.target.value.match(/[^a-zA-Z0-9-_ ]+/g)) {
  //     event.target.value = event.target.value.replace(/[^a-zA-Z0-9-_ ]/g, '')
  //     this._rowData[this.col.field] = event.target.value;
  //     this.showErrorMessage();
  //   }
  // }

  // validateCode(event) {
  //   if (event.target.value.match(/[^a-zA-Z0-9]+/g)) {
  //     event.target.value = event.target.value.replace(/[^a-zA-Z0-9]+/g, '')
  //     this._rowData[this.col.field] = event.target.value;
  //     this.showErrorMessage();
  //   }
  // }

  // validateNumber(event) {
  //   // /[\w\s\d-_] ^[-+]?\d*$ ^[0-9]*$
  //   if (event.target.value.match(/[^\d]/g)) {
  //     event.target.value = event.target.value.replace(/[^\d]/g, '')
  //     this._rowData[this.col.field] = event.target.value;
  //     this.showErrorMessage();
  //   }
  // }

  // validateRange(el) {
  //   if (el.value != "") {
  //     if (parseInt(el.value) < parseInt(el.min)) {
  //       el.value = el.min;
  //     }
  //     if (parseInt(el.value) > parseInt(el.max)) {
  //       el.value = el.max;
  //     }
  //   }
  // }

  // private showErrorMessage() {
  //   this.showError = true;
  //   setTimeout(() => {
  //     this.showError = false;
  //   }, 2500);
  // }

  // getValidation(value,name){
  //   return (value.includes(name));

  // }

}
