import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    DialogModule,
    CalendarModule,
    ToggleButtonModule,
    PanelModule,
    TreeTableModule,
    ToolbarModule,
    MessageModule,
    MessagesModule,
    SpinnerModule,
    TreeModule,
    ListboxModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    TabMenuModule,
    FileUploadModule,
    MessageService,
    DialogService,
    InputTextareaModule,
    FieldsetModule,
    AccordionModule,
    ColorPickerModule,
    CardModule,
    StepsModule,
    EditorModule,
    ChartModule
} from 'primeng/primeng';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule, TableService } from 'primeng/table';
import { PickListModule } from 'primeng/picklist';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

import { TreeTableComponent } from './components/treetable/treetable.component';
import { SmartTableComponent } from './components/smarttable/smarttable.component';
import { TableComponent } from './components/table/table.component';
import { CellEditorComponent } from './components/cell-editor/cell-editor.component';

import { ExcelService } from './services/excel.service';
import { SharedService } from './services/shared.service';
import { StorageService } from './services/storage.service';

import { OnlyNumberDirective } from './directives/onlyNumberValidator.directive'
import { RangeValidatorDirective } from './directives/rangeValidator.directive';
import { TextValidatorDirective } from './directives/textValidator.directive';
import { CodeValidatorDirective } from './directives/codeValidator.directive'
// import { ParameterComponent } from './components/parameter/parameter.component'
// import { MultdropdownTreetableComponent } from './components/multdropdown-treetable/multdropdown-treetable.component';
// import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
// import { DynamicControlComponent } from './components/dynamic-form/dynamic-control/dynamic-control.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { CellEditorLfComponent } from './components/cell-editor-lf/cell-editor-lf.component';
//import { DynamicControlService } from './services/dynamic-control.service';
import { NbCardModule } from '@nebular/theme';
import { ToastModule } from 'primeng/toast';
import { UploadExcelComponent } from './components/upload-excel/upload-excel.component';
import { ExportDatatableComponent } from './components/export-datatable/export-datatable.component';

const Export_Primeng_Modules = [
    TableModule,
    InputTextModule,
    PickListModule,
    CalendarModule,
    ButtonModule,
    DropdownModule,
    MultiSelectModule,
    DialogModule,
    CheckboxModule,
    ToggleButtonModule,
    PanelModule,
    TreeTableModule,
    ToolbarModule,
    MessageModule,
    MessagesModule,
    SpinnerModule,
    TreeModule,
    ListboxModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    TabMenuModule,
    FileUploadModule,
    DynamicDialogModule,
    InputTextareaModule, FieldsetModule,
    AccordionModule,
    CardModule,
    EditorModule,
    ToastModule,
    StepsModule,
    ColorPickerModule
]

const Export_Components = [
    TreeTableComponent,
    SmartTableComponent,
    TableComponent,
    UploadExcelComponent,
    CellEditorComponent,
    OnlyNumberDirective,
    RangeValidatorDirective,
    TextValidatorDirective,
    CodeValidatorDirective,
    // ParameterComponent,
    // MultdropdownTreetableComponent,
    // DynamicFormComponent,
    // DynamicControlComponent,
    AutofocusDirective,
    InputAutofocusDirective,
    CellEditorLfComponent,
    ExportDatatableComponent
]

const Export_Primeng_Services = [
    MessageService,
    DialogService
]

const Export_Nebular_Modules = [
    NbCardModule
]

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { InputAutofocusDirective } from './directives/inputAutoFocus.directive';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ...Export_Primeng_Modules,
        ...Export_Nebular_Modules,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        ...Export_Components,
        UploadExcelComponent

    ],
    providers: [
        ...Export_Primeng_Services,
        SharedService,
        ExcelService,
        TableService,
        StorageService,
        //DynamicControlService
    ],
    exports: [
        ...Export_Components,
        ...Export_Primeng_Modules,
        ...Export_Nebular_Modules,
        TranslateModule
    ]
})
export class SharedModule { }



// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http,'./assets/i18n/', '.json');
}


