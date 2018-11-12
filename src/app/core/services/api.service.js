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
import { ApiResponse } from '../models/api.response';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthHelper } from '../../auth/helpers/auth.helper';
var headers = new HttpHeaders();
headers.append('Content-Type', 'application/json');
var ApiService = /** @class */ (function () {
    /**
     * Default constructor
     * @param http
     * @param router
     */
    function ApiService(http, router, authHelper) {
        this.http = http;
        this.router = router;
        this.authHelper = authHelper;
    }
    /**
     * Performs request via post method
     * @param url
     * @param body
     * @param options
     * @return {Observable<ApiResponse>}
     */
    ApiService.prototype.post = function (url, body, options) {
        var _this = this;
        // console.log('POST', url);
        return this.http.post(this.url(url), body, __assign({ headers: headers }, options))
            .map(function (res) { return new ApiResponse(res); })
            .catch(function (err) {
            if (err.status == 401) {
                _this.authHelper.clearAuthToken();
                _this.router.navigate(['/']);
            }
            else if (err.status >= 400 && err.status != 404) {
                _this.router.navigate(['/under-maintenance']);
            }
            console.error(err);
            return Observable.empty();
        });
    };
    /**
     * Performs get request
     * @param url
     * @param options
     * @return {Observable<ApiResponse>}
     */
    ApiService.prototype.get = function (url, options) {
        var _this = this;
        // console.log('GET', this.url(url), options);
        return this.http.get(this.url(url), __assign({ headers: headers }, options))
            .map(function (res) { return new ApiResponse(res); })
            .catch(function (err) {
            if (err.status == 401) {
                _this.authHelper.clearAuthToken();
                _this.router.navigate(['/']);
            }
            else if (err.status >= 400 && err.status != 404) {
                _this.router.navigate(['/under-maintenance']);
            }
            console.error(err);
            return Observable.empty();
        });
    };
    /**
     * Performs get request using non authenticated http
     * @param url
     * @param options
     * @return {Observable<ApiResponse>}
     */
    ApiService.prototype.noAuthGet = function (url, options) {
        // console.log('NOAUTHGET', url);
        return this.http.get(this.url(url), __assign({ headers: headers }, options))
            .map(function (res) { return new ApiResponse(res); })
            .catch(function (err) {
            console.error(err.text);
            return Observable.empty();
        });
    };
    /**
     * Returns qualified URL
     * @param url
     * @return {string}
     */
    ApiService.prototype.url = function (url) {
        var apiUrl = environment.apiUrl;
        // hack
        if (url.length && url[0] != '/') {
            url = '/' + url;
        }
        return apiUrl + url;
    };
    ApiService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            Router, AuthHelper])
    ], ApiService);
    return ApiService;
}());
export { ApiService };
