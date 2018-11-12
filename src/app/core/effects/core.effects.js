var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import 'rxjs/add/operator/map';
import * as core from '../actions/core.actions';
import { CookieHelper } from '../../auth/helpers/cookie.helper';
import { LocaleInfo } from '../models/locale-info';
var CoreEffects = /** @class */ (function () {
    /**
     * Default constructor
     * @param actions$§
     */
    function CoreEffects(actions$) {
        var _this = this;
        this.actions$ = actions$;
        /**
         * Saves user location data to cookies
         */
        this.setCookie$ = this.actions$.ofType(core.SAVE_TO_COOKIE)
            .map(function (action) { return _this.actionHelper(action); });
    }
    /**
     * Helps to handle
     */
    CoreEffects.prototype.actionHelper = function (action) {
        var newCookie = this.mergeCookie(action.payload);
        this.setCookie(newCookie);
        return new core.SaveCompleteAction(newCookie);
    };
    ;
    /**
     * Helps to save data to cookie
     * @param data
     */
    CoreEffects.prototype.setCookie = function (data) {
        var cookie = JSON.stringify(data);
        CookieHelper.setCookie('y-locale', cookie);
    };
    /**
     * Gets cookie and merge with locale info
     */
    CoreEffects.prototype.mergeCookie = function (locale) {
        var cookie = CookieHelper.getCookie('y-locale');
        try {
            if (cookie) {
                var localeInfo = new LocaleInfo(JSON.parse(cookie));
                return __assign({}, localeInfo, locale);
            }
            return __assign({}, locale);
        }
        catch (e) {
            return __assign({}, locale);
        }
    };
    __decorate([
        Effect(),
        __metadata("design:type", Observable)
    ], CoreEffects.prototype, "setCookie$", void 0);
    CoreEffects = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Actions])
    ], CoreEffects);
    return CoreEffects;
}());
export { CoreEffects };
