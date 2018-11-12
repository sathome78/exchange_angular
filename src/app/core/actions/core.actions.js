export var SAVE_TO_STORE = '[Core] Saves data to app store';
export var SAVE_COMPLETE = '[Core] Saving user location data to cookie is complete';
export var SAVE_TO_COOKIE = '[Core] Saves user location data to cookie';
export var REHYDRATE = '[Core] Rehydrate store';
/**
 * Change language | region | currency
 */
var SaveToStoreAction = /** @class */ (function () {
    /**
     * Default constructor
     * @param payload
     */
    function SaveToStoreAction(payload) {
        this.payload = payload;
        this.type = SAVE_TO_STORE;
    }
    return SaveToStoreAction;
}());
export { SaveToStoreAction };
/**
 * Change language | region | currency in node-server environment
 */
var SaveCookieAction = /** @class */ (function () {
    /**
     * Default constructor
     * @param payload
     */
    function SaveCookieAction(payload) {
        this.payload = payload;
        this.type = SAVE_TO_COOKIE;
    }
    return SaveCookieAction;
}());
export { SaveCookieAction };
/**
 * Change success
 */
var SaveCompleteAction = /** @class */ (function () {
    /**
     * Default constructor
     * @param payload
     */
    function SaveCompleteAction(payload) {
        this.payload = payload;
        this.type = SAVE_COMPLETE;
    }
    return SaveCompleteAction;
}());
export { SaveCompleteAction };
/**
 * Rehydrate store
 */
var RehydrateAction = /** @class */ (function () {
    /**
     * Default constructor
     * @param payload
     */
    function RehydrateAction(payload) {
        this.payload = payload;
        this.type = REHYDRATE;
    }
    return RehydrateAction;
}());
export { RehydrateAction };
