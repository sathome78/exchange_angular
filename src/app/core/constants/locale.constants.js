import * as CountryData from 'country-data';
export var SUPPORTED_COUNTRIES_CODES = ['ID', 'MY', 'SG', 'LK', 'VN', 'PH', 'IN', 'HK', 'US', 'EU'];
export var SUPPORTED_LANGUAGES_CODES = ['en', 'id'];
export var DEFAULT_LANGUAGE_CODE = 'en';
export var DEFAULT_COUNTRY_CODE = 'SG';
export var SUPPORTED_COUNTRIES = SUPPORTED_COUNTRIES_CODES.map(function (code) { return CountryData.countries[code]; });
export var SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES_CODES.map(function (code) { return CountryData.languages[code]; });
export var DEFAULT_COUNTRY = CountryData.countries[DEFAULT_COUNTRY_CODE];
export var DEFAULT_CURRENCY_CODE = DEFAULT_COUNTRY.currencies[0];
