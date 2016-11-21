import { SimpleChange, EventEmitter } from '@angular/core';
/**
 * Helpers for setting up sorting and paging, used by various components
 */
/**
 * Sort direction (either 'ASC' or 'DESC')
 */
export declare class SortDirection {
    static desc: string;
    static asc: string;
}
export declare class SortDisplayOption {
    label: string;
    sortField: string;
    sortDir: SortDirection;
    constructor(label: string, sortField: string, sortDir: SortDirection);
}
export declare class PagingOptions {
    private pageNumber;
    private pageSize;
    private totalPages;
    private totalSize;
    sortField: string;
    sortDir: SortDirection;
    constructor(pageNumber?: number, pageSize?: number, totalPages?: number, totalSize?: number, sortField?: string, sortDir?: SortDirection);
    reset(): void;
    set(pageNumber: number, pageSize: number, totalPages: number, totalSize: number): void;
    update(pageNumber: number, pageSize: number): void;
    setPageNumber(pageNumber: number): void;
    toObj(): any;
}
export declare class Pager {
    pageNumber: number;
    pageSize: number;
    totalSize: number;
    maxPageSize: number;
    currentSize: number;
    disableGoToEnd: boolean;
    showSortingControls: boolean;
    showCountWarning: boolean;
    countWarningMessage: string;
    onChange: EventEmitter<any>;
    private sortdir;
    private totalPages;
    private startFormatted;
    private endFormatted;
    private totalFormatted;
    constructor();
    ngOnInit(): void;
    ngOnChanges(changes: {
        [propKey: string]: SimpleChange;
    }): void;
    private format();
    private calculateTotalPages();
    private goToPage(pageNumber);
    private setPageSize(pageSize);
    private sort(direction);
}
