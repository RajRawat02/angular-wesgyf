import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-screens',
  templateUrl: './screens.component.html',
  styleUrls: ['./screens.component.scss']
})
export class ScreensComponent implements OnInit {
  tableHeaders: any[] = [
    {
      "columns": [
        {
          "field": "id",
          "header": "Id",
          "display": "table-cell"
        },
        {
          "field": "unit",
          "header": "Unit",
          "display": "table-cell"
        },
        {
          "field": "lapsID",
          "header": "LAPS ID",
          "display": "table-cell"
        },
        {
          "field": "waferType",
          "header": "Wafer Type",
          "display": "table-cell",
        },

      ]
    }
  ];
  tableData: any[] = [
    {
      id: 25,
      unit:'1',
      lapsID: 'VMAH191014A_01',
      waferType: 'Dummy'
    },
    {
      id: 24,
      unit:'2',
      lapsID: 'VMAH191014A_03',
      waferType: 'WRS'
    },
    {
      id: 23,
      unit:'3',
      lapsID: 'D_VMAH191014A_05',
      waferType: 'Demo'
    },
    {
      id: 22,
      unit:'4',
      lapsID: 'VMAH191013A_06',
      waferType: 'WRS'
    },
    {
      id: 21,
      unit:'5.1',
      lapsID: 'D_VMAH191015A_01_10_15',
      waferType: 'Demo'
    },
    {
      id: 20,
      unit:'5.2',
      lapsID: 'VMAH191015A_01_20_25',
      waferType: 'Dummy'
    },
    {
      id: 19,
      unit:'5.3',
      lapsID: 'VMAH191015A_01_35_45',
      waferType: 'WRS'
    },
    {
      id: 18,
      unit:'5.4',
      lapsID: 'VMAH191015A_01_75_95',
      waferType: 'Demo'
    },
    {
      id: 17,
      unit:'6',
      lapsID: 'D_VMAH191015A_03',
      waferType: 'Demo'
    },
    {
      id: 16,
      unit:'7',
      lapsID: 'VMAH191015A_01',
      waferType: 'WRS'
    },
    {
      id: 15,
      unit:'8',
      lapsID: 'D_VMAH191015A_01',
      waferType: 'Demo'
    },
    {
      id: 14,
      unit:'9',
      lapsID: 'VMAH191015A_02',
      waferType: 'WRS'
    },
    {
      id: 13,
      unit:'10',
      lapsID: 'VMAH191015A_03',
      waferType: 'WRS'
    },

  ];
  constructor() { }

  ngOnInit() {
    console.log("in");
  }

}
