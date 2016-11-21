"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
/**
 * Helpers for setting up sorting and paging, used by various components
 */
/**
 * Sort direction (either 'ASC' or 'DESC')
 */
var SortDirection = (function () {
    function SortDirection() {
    }
    SortDirection.desc = 'DESC';
    SortDirection.asc = 'ASC';
    return SortDirection;
}());
exports.SortDirection = SortDirection;
var SortDisplayOption = (function () {
    function SortDisplayOption(label, sortField, sortDir) {
        this.label = label;
        this.sortField = sortField;
        this.sortDir = sortDir;
    }
    return SortDisplayOption;
}());
exports.SortDisplayOption = SortDisplayOption;
var PagingOptions = (function () {
    function PagingOptions(pageNumber, pageSize, totalPages, totalSize, sortField, sortDir) {
        if (pageNumber === void 0) { pageNumber = 0; }
        if (pageSize === void 0) { pageSize = 50; }
        if (totalPages === void 0) { totalPages = 0; }
        if (totalSize === void 0) { totalSize = 0; }
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
        this.totalSize = totalSize;
        this.sortField = sortField;
        this.sortDir = sortDir;
    }
    PagingOptions.prototype.reset = function () {
        this.pageNumber = 0;
        this.pageSize = 50;
        this.totalPages = 0;
        this.totalSize = 0;
    };
    PagingOptions.prototype.set = function (pageNumber, pageSize, totalPages, totalSize) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
        this.totalPages = totalPages;
        this.totalSize = totalSize;
    };
    PagingOptions.prototype.update = function (pageNumber, pageSize) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    };
    PagingOptions.prototype.setPageNumber = function (pageNumber) {
        this.pageNumber = pageNumber;
    };
    PagingOptions.prototype.toObj = function () {
        return {
            page: this.pageNumber,
            size: this.pageSize,
            sort: this.sortField || null,
            dir: this.sortDir || null
        };
    };
    return PagingOptions;
}());
exports.PagingOptions = PagingOptions;
var Pager = (function () {
    function Pager() {
        this.pageNumber = 0;
        this.pageSize = 0;
        this.totalSize = 0;
        this.maxPageSize = 100;
        this.currentSize = 0;
        this.disableGoToEnd = false;
        this.showSortingControls = false;
        this.showCountWarning = false;
        this.countWarningMessage = '';
        this.onChange = new core_1.EventEmitter();
        this.sortdir = SortDirection.desc;
        this.totalPages = 0;
        this.startFormatted = '';
        this.endFormatted = '';
        this.totalFormatted = 'unknown';
    }
    Pager.prototype.ngOnInit = function () {
        // Constrain the max page size
        this.maxPageSize = Math.min(100, Math.max(this.maxPageSize, 1));
        this.calculateTotalPages();
        this.format();
    };
    Pager.prototype.ngOnChanges = function (changes) {
        if (changes.hasOwnProperty('pageSize') || changes.hasOwnProperty('totalSize')) {
            this.calculateTotalPages();
            this.format();
        }
    };
    Pager.prototype.format = function () {
        this.startFormatted = ((this.pageSize * this.pageNumber) + 1).toLocaleString();
        var end = (this.pageSize * this.pageNumber) + this.maxPageSize;
        end = (end > this.totalSize) ? this.totalSize : end;
        this.endFormatted = end.toLocaleString();
        if (this.totalSize !== 0) {
            this.totalFormatted = this.totalSize.toLocaleString();
        }
    };
    Pager.prototype.calculateTotalPages = function () {
        // Constrain the page size to the max
        this.pageSize = Math.min(this.maxPageSize, Math.max(this.pageSize, 1));
        // Calculate number of pages based on page size and number of results
        this.totalPages = Math.ceil(this.totalSize / this.pageSize);
    };
    Pager.prototype.goToPage = function (pageNumber) {
        // Go to specific page number
        this.pageNumber = Math.min(this.totalPages - 1, Math.max(pageNumber, 0));
        this.format();
        // Emit change event
        this.onChange.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize, sortdir: this.sortdir });
    };
    Pager.prototype.setPageSize = function (pageSize) {
        // Page size can never exceed the max
        this.pageSize = Math.min(this.maxPageSize, Math.max(pageSize, 0));
        // Since the size changed, go back to the first page
        this.pageNumber = 0;
        // Emit change event
        this.onChange.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize, sortdir: this.sortdir });
    };
    Pager.prototype.sort = function (direction) {
        this.sortdir = direction;
        // Emit change event
        this.onChange.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize, sortdir: this.sortdir });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Pager.prototype, "pageNumber", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Pager.prototype, "pageSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Pager.prototype, "totalSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Pager.prototype, "maxPageSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], Pager.prototype, "currentSize", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Pager.prototype, "disableGoToEnd", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Pager.prototype, "showSortingControls", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Pager.prototype, "showCountWarning", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Pager.prototype, "countWarningMessage", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Pager.prototype, "onChange", void 0);
    Pager = __decorate([
        core_1.Component({
            selector: 'asy-pager',
            templateUrl: './component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], Pager);
    return Pager;
}());
exports.Pager = Pager;

//# sourceMappingURL=index.js.map
