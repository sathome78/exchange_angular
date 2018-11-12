import * as CountryData from 'country-data';
import {Country} from '../models/country';
import {Language} from '../models/language';

export const SUPPORTED_COUNTRIES_CODES = [ 'ID', 'MY', 'SG', 'LK', 'VN', 'PH', 'IN', 'HK', 'US', 'EU' ]
export const SUPPORTED_LANGUAGES_CODES = [ 'en' , 'id']
export const DEFAULT_LANGUAGE_CODE: string = 'en';
export const DEFAULT_COUNTRY_CODE: string = 'SG';

export const SUPPORTED_COUNTRIES: Country[] = SUPPORTED_COUNTRIES_CODES.map( (code: string) => CountryData.countries[code])
export const SUPPORTED_LANGUAGES: Language[] = SUPPORTED_LANGUAGES_CODES.map( (code: string) => CountryData.languages[code])
export const DEFAULT_COUNTRY: Country = CountryData.countries[DEFAULT_COUNTRY_CODE]
export const DEFAULT_CURRENCY_CODE: string = DEFAULT_COUNTRY.currencies[0]
