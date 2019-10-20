import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

  constructor() { }

  //method to create excel sheet and file for export
  public exportAsExcelFile(json: any[], excelFileName: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  //method to save Excel file
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().toISOString() + EXCEL_EXTENSION);
  }

  //method to format data coming from table components and calling exportExcel to export
  public formatAndExportAsExcelFile(data: any, columns: any) {
    let updatedData;

    //filtering data object to remove not required columns
    data = data.map(item => {
      let item1 = {};
      columns.forEach(column => {
        item1[column.field] = item[column.field]
      })
      return item1;
    })

    //Code to replace properties name with Header Text
    let tempJSONString = JSON.stringify(data);
    columns.forEach(column => {
      tempJSONString = tempJSONString.split('"' + column.field + '":').join('"' + column.header + '":');
    });
    updatedData = JSON.parse(tempJSONString);

    //calling method to export the formatted data
    this.exportAsExcelFile(updatedData, 'download')
  }

  //method to read data from Excel file and convert to JSON object
  public uploadFromExcel(file: File) {
    return new Promise((resolve, reject) => {
      let excelJSON, tempJSON = [], arrayBuffer: any;
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        arrayBuffer = fileReader.result;
        var data = new Uint8Array(arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        excelJSON = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        excelJSON.forEach(element => {
          tempJSON.push(element);
        });
        resolve(tempJSON);
      }
    })
  };

}

