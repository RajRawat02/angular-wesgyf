//filter model used by all table templates for server side filtering to set values for records to skip, records to fetch etc
export class FilterModel {
    recordsToSkip: number;
    recordsToFetch: number;
    rowsPerPage : number;
    filters: any;
    sortColumn?: string;
    isDescendingSort: boolean = false;
}