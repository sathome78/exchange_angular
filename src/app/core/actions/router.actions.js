export var GO = '[Router] Go';
export var BACK = '[Router] Back';
export var FORWARD = '[Router] Forward';
export var SEARCH = '[Router] Search';
var GoAction = /** @class */ (function () {
    function GoAction(payload) {
        this.payload = payload;
        this.type = GO;
    }
    return GoAction;
}());
export { GoAction };
/**
 * Navigates back
 */
var BackAction = /** @class */ (function () {
    function BackAction() {
        this.type = BACK;
    }
    return BackAction;
}());
export { BackAction };
/**
 * Navigates forward
 */
var ForwardAction = /** @class */ (function () {
    function ForwardAction() {
        this.type = FORWARD;
    }
    return ForwardAction;
}());
export { ForwardAction };
/**
 * Navigate with changing quesry params
 */
var SearchAction = /** @class */ (function () {
    function SearchAction(payload) {
        this.payload = payload;
        this.type = SEARCH;
    }
    ;
    return SearchAction;
}());
export { SearchAction };
/**
 * Temporary function for faster migration to v4 of th ngrx. Creates Go action
 */
export var go = function (path, query) { return new GoAction({ path: [path], query: query }); };
/**
 * Temporary function for faster migration to v4 of th ngrx. Creates Back action
 */
export var back = function () { return new BackAction(); };
/**
 * Temporary function for faster migration to v4 of th ngrx. Creates Search
 */
export var search = function (query) { return new SearchAction(query); };
