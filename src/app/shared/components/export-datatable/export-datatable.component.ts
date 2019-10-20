import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { ExcelService } from '../../services/excel.service';

//Temp Export datatable component to export all data for components where lazy loading is enabled and hence full data is not available on UI
@Component({
  selector: 'app-export-datatable',
  template: `<p-table #dt></p-table>`,
})
export class ExportDatatableComponent implements OnInit {
  @Input() tempDataSource: any[] = [] //data source for temporary datatable
  @Input() tempColumns: any[] = [] //columns header for temporary datatable

  @ViewChild('dt', { 'static': false }) private _table: Table; //creating view child of table element to access table in this file

  constructor(private excelService: ExcelService) { }

  ngOnInit() {
  }

  //export CSV method to export data as excel file
  exportCSV() {
    let data = this._table._value;
    let columns = this._table._columns;

    if (data.length > 0) {
      this.excelService.formatAndExportAsExcelFile(data, columns);
    }
  }
}
