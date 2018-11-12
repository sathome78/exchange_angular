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
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions } from '@ngrx/effects';
import * as RouterActions from '../actions/router.actions';
import { URLSearchParams } from '@angular/http';
var objectToQuery = function (obj) {
    var params = new URLSearchParams();
    Object.keys(obj).forEach(function (key) { return params.set(key, obj[key]); });
    return params.toString();
};
var RouterEffects = /** @class */ (function () {
    function RouterEffects(actions$, router, location) {
        var _this = this;
        this.actions$ = actions$;
        this.router = router;
        this.location = location;
        /**
         * Navigates to given path
         */
        this.navigate$ = this.actions$.ofType(RouterActions.GO)
            .map(function (action) { return action.payload; })
            .do(function (_a) {
            var path = _a.path, queryParams = _a.query, extras = _a.extras;
            return _this.router.navigate(path, __assign({ queryParams: queryParams }, extras));
        });
        /**
         * Navigates back
         */
        this.navigateBack$ = this.actions$.ofType(RouterActions.BACK)
            .do(function () { return _this.location.back(); });
        /**
         * Navigates forward
         */
        this.navigateForward$ = this.actions$.ofType(RouterActions.FORWARD)
            .do(function () { return _this.location.forward(); });
        /**
         * Replaces search query
         */
        this.navigateSearch$ = this.actions$.ofType(RouterActions.SEARCH)
            .do(function (action) {
            // console.log('Old path ', this.location.path(false));
            // console.log('Replacing path: ', action.payload, objectToQuery(action.payload));
            var urlTree = _this.router.parseUrl(_this.router.url);
            urlTree.queryParams = action.payload;
            _this.router.navigateByUrl(urlTree);
        });
    }
    __decorate([
        Effect({ dispatch: false }),
        __metadata("design:type", Object)
    ], RouterEffects.prototype, "navigate$", void 0);
    __decorate([
        Effect({ dispatch: false }),
        __metadata("design:type", Object)
    ], RouterEffects.prototype, "navigateBack$", void 0);
    __decorate([
        Effect({ dispatch: false }),
        __metadata("design:type", Object)
    ], RouterEffects.prototype, "navigateForward$", void 0);
    __decorate([
        Effect({ dispatch: false }),
        __metadata("design:type", Object)
    ], RouterEffects.prototype, "navigateSearch$", void 0);
    RouterEffects = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Actions,
            Router,
            Location])
    ], RouterEffects);
    return RouterEffects;
}());
export { RouterEffects };
