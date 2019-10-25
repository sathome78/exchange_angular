import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SyndexCountry } from '../models/syndex-country.model';
import { SyndexOrderInfo } from '../models/syndex-order-info.model';
import { SyndexPSCurrency, SyndexPaymentSystem } from '../models/syndex-payment-system.model';

const mockCountries = [
  {
    "id": "AF",
    "name": "Afghanistan",
    "default_currency": null
  },
  {
    "id": "AX",
    "name": "Aland Islands",
    "default_currency": null
  },
  {
    "id": "AL",
    "name": "Albania",
    "default_currency": null
  },
  {
    "id": "DZ",
    "name": "Algeria",
    "default_currency": null
  },
  {
    "id": "AS",
    "name": "American Samoa",
    "default_currency": null
  },
  {
    "id": "AD",
    "name": "Andorra",
    "default_currency": null
  },
  {
    "id": "AO",
    "name": "Angola",
    "default_currency": null
  },
  {
    "id": "AI",
    "name": "Anguilla",
    "default_currency": null
  },
  {
    "id": "AQ",
    "name": "Antarctica",
    "default_currency": null
  },
  {
    "id": "AG",
    "name": "Antigua and Barbuda",
    "default_currency": null
  },
  {
    "id": "AR",
    "name": "Argentina",
    "default_currency": null
  },
  {
    "id": "AM",
    "name": "Armenia",
    "default_currency": null
  },
  {
    "id": "AW",
    "name": "Aruba",
    "default_currency": null
  },
  {
    "id": "AU",
    "name": "Australia",
    "default_currency": null
  },
  {
    "id": "AT",
    "name": "Austria",
    "default_currency": null
  },
  {
    "id": "AZ",
    "name": "Azerbaijan",
    "default_currency": null
  },
  {
    "id": "BS",
    "name": "Bahamas",
    "default_currency": null
  },
  {
    "id": "BH",
    "name": "Bahrain",
    "default_currency": null
  },
  {
    "id": "BD",
    "name": "Bangladesh",
    "default_currency": null
  },
  {
    "id": "BB",
    "name": "Barbados",
    "default_currency": null
  },
  {
    "id": "BY",
    "name": "Belarus",
    "default_currency": null
  },
  {
    "id": "BE",
    "name": "Belgium",
    "default_currency": null
  },
  {
    "id": "BZ",
    "name": "Belize",
    "default_currency": null
  },
  {
    "id": "BJ",
    "name": "Benin",
    "default_currency": null
  },
  {
    "id": "BM",
    "name": "Bermuda",
    "default_currency": null
  },
  {
    "id": "BT",
    "name": "Bhutan",
    "default_currency": null
  },
  {
    "id": "BO",
    "name": "Bolivia, Plurinational State of",
    "default_currency": null
  },
  {
    "id": "BQ",
    "name": "Bonaire, Sint Eustatius",
    "default_currency": null
  },
  {
    "id": "BA",
    "name": "Bosnia and Herzegovina",
    "default_currency": null
  },
  {
    "id": "BW",
    "name": "Botswana",
    "default_currency": null
  },
  {
    "id": "BV",
    "name": "Bouvet Island",
    "default_currency": null
  },
  {
    "id": "BR",
    "name": "Brazil",
    "default_currency": null
  },
  {
    "id": "IO",
    "name": "British Indian Ocean Territory",
    "default_currency": null
  },
  {
    "id": "BN",
    "name": "Brunei Darussalam",
    "default_currency": null
  },
  {
    "id": "BG",
    "name": "Bulgaria",
    "default_currency": null
  },
  {
    "id": "BF",
    "name": "Burkina Faso",
    "default_currency": null
  },
  {
    "id": "BI",
    "name": "Burundi",
    "default_currency": null
  },
  {
    "id": "KH",
    "name": "Cambodia",
    "default_currency": null
  },
  {
    "id": "CM",
    "name": "Cameroon",
    "default_currency": null
  },
  {
    "id": "CA",
    "name": "Canada",
    "default_currency": null
  },
  {
    "id": "CV",
    "name": "Cape Verde",
    "default_currency": null
  },
  {
    "id": "KY",
    "name": "Cayman Islands",
    "default_currency": null
  },
  {
    "id": "CF",
    "name": "Central African Republic",
    "default_currency": null
  },
  {
    "id": "TD",
    "name": "Chad",
    "default_currency": null
  },
  {
    "id": "CL",
    "name": "Chile",
    "default_currency": null
  },
  {
    "id": "CN",
    "name": "China",
    "default_currency": null
  },
  {
    "id": "CX",
    "name": "Christmas Island",
    "default_currency": null
  },
  {
    "id": "CC",
    "name": "Cocos (Keeling) Islands",
    "default_currency": null
  },
  {
    "id": "CO",
    "name": "Colombia",
    "default_currency": null
  },
  {
    "id": "KM",
    "name": "Comoros",
    "default_currency": null
  },
  {
    "id": "CG",
    "name": "Congo",
    "default_currency": null
  },
  {
    "id": "CD",
    "name": "Congo, the Democratic Republic of the",
    "default_currency": null
  },
  {
    "id": "CK",
    "name": "Cook Islands",
    "default_currency": null
  },
  {
    "id": "CR",
    "name": "Costa Rica",
    "default_currency": null
  },
  {
    "id": "CI",
    "name": "Cote d'Ivoire",
    "default_currency": null
  },
  {
    "id": "HR",
    "name": "Croatia",
    "default_currency": null
  },
  {
    "id": "CU",
    "name": "Cuba",
    "default_currency": null
  },
  {
    "id": "CW",
    "name": "Curacao",
    "default_currency": null
  },
  {
    "id": "CY",
    "name": "Cyprus",
    "default_currency": null
  },
  {
    "id": "CZ",
    "name": "Czech Republic",
    "default_currency": null
  },
  {
    "id": "DK",
    "name": "Denmark",
    "default_currency": null
  },
  {
    "id": "DJ",
    "name": "Djibouti",
    "default_currency": null
  },
  {
    "id": "DM",
    "name": "Dominica",
    "default_currency": null
  },
  {
    "id": "DO",
    "name": "Dominican Republic",
    "default_currency": null
  },
  {
    "id": "EC",
    "name": "Ecuador",
    "default_currency": null
  },
  {
    "id": "EG",
    "name": "Egypt",
    "default_currency": null
  },
  {
    "id": "SV",
    "name": "El Salvador",
    "default_currency": null
  },
  {
    "id": "GQ",
    "name": "Equatorial Guinea",
    "default_currency": null
  },
  {
    "id": "ER",
    "name": "Eritrea",
    "default_currency": null
  },
  {
    "id": "EE",
    "name": "Estonia",
    "default_currency": null
  },
  {
    "id": "ET",
    "name": "Ethiopia",
    "default_currency": null
  },
  {
    "id": "FK",
    "name": "Falkland Islands (Malvinas)",
    "default_currency": null
  },
  {
    "id": "FO",
    "name": "Faroe Islands",
    "default_currency": null
  },
  {
    "id": "FJ",
    "name": "Fiji",
    "default_currency": null
  },
  {
    "id": "FI",
    "name": "Finland",
    "default_currency": null
  },
  {
    "id": "FR",
    "name": "France",
    "default_currency": null
  },
  {
    "id": "GF",
    "name": "French Guiana",
    "default_currency": null
  },
  {
    "id": "PF",
    "name": "French Polynesia",
    "default_currency": null
  },
  {
    "id": "TF",
    "name": "French Southern Territories",
    "default_currency": null
  },
  {
    "id": "GA",
    "name": "Gabon",
    "default_currency": null
  },
  {
    "id": "GM",
    "name": "Gambia",
    "default_currency": null
  },
  {
    "id": "GE",
    "name": "Georgia",
    "default_currency": null
  },
  {
    "id": "DE",
    "name": "Germany",
    "default_currency": null
  },
  {
    "id": "GH",
    "name": "Ghana",
    "default_currency": null
  },
  {
    "id": "GI",
    "name": "Gibraltar",
    "default_currency": null
  },
  {
    "id": "GR",
    "name": "Greece",
    "default_currency": null
  },
  {
    "id": "GL",
    "name": "Greenland",
    "default_currency": null
  },
  {
    "id": "GD",
    "name": "Grenada",
    "default_currency": null
  },
  {
    "id": "GP",
    "name": "Guadeloupe",
    "default_currency": null
  },
  {
    "id": "GU",
    "name": "Guam",
    "default_currency": null
  },
  {
    "id": "GT",
    "name": "Guatemala",
    "default_currency": null
  },
  {
    "id": "GG",
    "name": "Guernsey",
    "default_currency": null
  },
  {
    "id": "GN",
    "name": "Guinea",
    "default_currency": null
  },
  {
    "id": "GW",
    "name": "Guinea-Bissau",
    "default_currency": null
  },
  {
    "id": "GY",
    "name": "Guyana",
    "default_currency": null
  },
  {
    "id": "HT",
    "name": "Haiti",
    "default_currency": null
  },
  {
    "id": "HM",
    "name": "Heard Island and McDonald Islands",
    "default_currency": null
  },
  {
    "id": "VA",
    "name": "Holy See (Vatican City State)",
    "default_currency": null
  },
  {
    "id": "HN",
    "name": "Honduras",
    "default_currency": null
  },
  {
    "id": "HK",
    "name": "Hong Kong",
    "default_currency": null
  },
  {
    "id": "HU",
    "name": "Hungary",
    "default_currency": null
  },
  {
    "id": "IS",
    "name": "Iceland",
    "default_currency": null
  },
  {
    "id": "IN",
    "name": "India",
    "default_currency": null
  },
  {
    "id": "ID",
    "name": "Indonesia",
    "default_currency": null
  },
  {
    "id": "IR",
    "name": "Iran, Islamic Republic of",
    "default_currency": null
  },
  {
    "id": "IQ",
    "name": "Iraq",
    "default_currency": null
  },
  {
    "id": "IE",
    "name": "Ireland",
    "default_currency": null
  },
  {
    "id": "IM",
    "name": "Isle of Man",
    "default_currency": null
  },
  {
    "id": "IL",
    "name": "Israel",
    "default_currency": null
  },
  {
    "id": "IT",
    "name": "Italy",
    "default_currency": null
  },
  {
    "id": "JM",
    "name": "Jamaica",
    "default_currency": null
  },
  {
    "id": "JP",
    "name": "Japan",
    "default_currency": null
  },
  {
    "id": "JE",
    "name": "Jersey",
    "default_currency": null
  },
  {
    "id": "JO",
    "name": "Jordan",
    "default_currency": null
  },
  {
    "id": "KZ",
    "name": "Kazakhstan",
    "default_currency": null
  },
  {
    "id": "KE",
    "name": "Kenya",
    "default_currency": null
  },
  {
    "id": "KI",
    "name": "Kiribati",
    "default_currency": null
  },
  {
    "id": "KP",
    "name": "Korea, Democratic People's Republic of",
    "default_currency": null
  },
  {
    "id": "KW",
    "name": "Kuwait",
    "default_currency": null
  },
  {
    "id": "KG",
    "name": "Kyrgyzstan",
    "default_currency": null
  },
  {
    "id": "LA",
    "name": "Lao People's Democratic Republic",
    "default_currency": null
  },
  {
    "id": "LV",
    "name": "Latvia",
    "default_currency": null
  },
  {
    "id": "LB",
    "name": "Lebanon",
    "default_currency": null
  },
  {
    "id": "LS",
    "name": "Lesotho",
    "default_currency": null
  },
  {
    "id": "LR",
    "name": "Liberia",
    "default_currency": null
  },
  {
    "id": "LY",
    "name": "Libyan Arab Jamahiriya",
    "default_currency": null
  },
  {
    "id": "LI",
    "name": "Liechtenstein",
    "default_currency": null
  },
  {
    "id": "LT",
    "name": "Lithuania",
    "default_currency": null
  },
  {
    "id": "LU",
    "name": "Luxembourg",
    "default_currency": null
  },
  {
    "id": "MO",
    "name": "Macao",
    "default_currency": null
  },
  {
    "id": "MK",
    "name": "Macedonia, the former Yugoslav Republic of",
    "default_currency": null
  },
  {
    "id": "MG",
    "name": "Madagascar",
    "default_currency": null
  },
  {
    "id": "MW",
    "name": "Malawi",
    "default_currency": null
  },
  {
    "id": "MY",
    "name": "Malaysia",
    "default_currency": null
  },
  {
    "id": "MV",
    "name": "Maldives",
    "default_currency": null
  },
  {
    "id": "ML",
    "name": "Mali",
    "default_currency": null
  },
  {
    "id": "MT",
    "name": "Malta",
    "default_currency": null
  },
  {
    "id": "MH",
    "name": "Marshall Islands",
    "default_currency": null
  },
  {
    "id": "MQ",
    "name": "Martinique",
    "default_currency": null
  },
  {
    "id": "MR",
    "name": "Mauritania",
    "default_currency": null
  },
  {
    "id": "MU",
    "name": "Mauritius",
    "default_currency": null
  },
  {
    "id": "YT",
    "name": "Mayotte",
    "default_currency": null
  },
  {
    "id": "MX",
    "name": "Mexico",
    "default_currency": null
  },
  {
    "id": "FM",
    "name": "Micronesia, Federated States of",
    "default_currency": null
  },
  {
    "id": "MD",
    "name": "Moldova, Republic of",
    "default_currency": null
  },
  {
    "id": "MC",
    "name": "Monaco",
    "default_currency": null
  },
  {
    "id": "MN",
    "name": "Mongolia",
    "default_currency": null
  },
  {
    "id": "ME",
    "name": "Montenegro",
    "default_currency": null
  },
  {
    "id": "MS",
    "name": "Montserrat",
    "default_currency": null
  },
  {
    "id": "MA",
    "name": "Morocco",
    "default_currency": null
  },
  {
    "id": "MZ",
    "name": "Mozambique",
    "default_currency": null
  },
  {
    "id": "MM",
    "name": "Myanmar",
    "default_currency": null
  },
  {
    "id": "NA",
    "name": "Namibia",
    "default_currency": null
  },
  {
    "id": "NR",
    "name": "Nauru",
    "default_currency": null
  },
  {
    "id": "NP",
    "name": "Nepal",
    "default_currency": null
  },
  {
    "id": "NL",
    "name": "Netherlands",
    "default_currency": null
  },
  {
    "id": "AN",
    "name": "Netherlands Antilles",
    "default_currency": null
  },
  {
    "id": "NC",
    "name": "New Caledonia",
    "default_currency": null
  },
  {
    "id": "NZ",
    "name": "New Zealand",
    "default_currency": null
  },
  {
    "id": "NI",
    "name": "Nicaragua",
    "default_currency": null
  },
  {
    "id": "NE",
    "name": "Niger",
    "default_currency": null
  },
  {
    "id": "NG",
    "name": "Nigeria",
    "default_currency": null
  },
  {
    "id": "NU",
    "name": "Niue",
    "default_currency": null
  },
  {
    "id": "NF",
    "name": "Norfolk Island",
    "default_currency": null
  },
  {
    "id": "MP",
    "name": "Northern Mariana Islands",
    "default_currency": null
  },
  {
    "id": "NO",
    "name": "Norway",
    "default_currency": null
  },
  {
    "id": "OM",
    "name": "Oman",
    "default_currency": null
  },
  {
    "id": "PK",
    "name": "Pakistan",
    "default_currency": null
  },
  {
    "id": "PW",
    "name": "Palau",
    "default_currency": null
  },
  {
    "id": "PS",
    "name": "Palestinian Territory, Occupied",
    "default_currency": null
  },
  {
    "id": "PA",
    "name": "Panama",
    "default_currency": null
  },
  {
    "id": "PG",
    "name": "Papua New Guinea",
    "default_currency": null
  },
  {
    "id": "PY",
    "name": "Paraguay",
    "default_currency": null
  },
  {
    "id": "PE",
    "name": "Peru",
    "default_currency": null
  },
  {
    "id": "PH",
    "name": "Philippines",
    "default_currency": null
  },
  {
    "id": "PN",
    "name": "Pitcairn",
    "default_currency": null
  },
  {
    "id": "PL",
    "name": "Poland",
    "default_currency": null
  },
  {
    "id": "PT",
    "name": "Portugal",
    "default_currency": null
  },
  {
    "id": "PR",
    "name": "Puerto Rico",
    "default_currency": null
  },
  {
    "id": "QA",
    "name": "Qatar",
    "default_currency": null
  },
  {
    "id": "RE",
    "name": "Reunion",
    "default_currency": null
  },
  {
    "id": "RO",
    "name": "Romania",
    "default_currency": null
  },
  {
    "id": "RU",
    "name": "Russian Federation",
    "default_currency": null
  },
  {
    "id": "RW",
    "name": "Rwanda",
    "default_currency": null
  },
  {
    "id": "BL",
    "name": "Saint Barthelemy",
    "default_currency": null
  },
  {
    "id": "SH",
    "name": "Saint Helena",
    "default_currency": null
  },
  {
    "id": "KN",
    "name": "Saint Kitts and Nevis",
    "default_currency": null
  },
  {
    "id": "LC",
    "name": "Saint Lucia",
    "default_currency": null
  },
  {
    "id": "MF",
    "name": "Saint Martin (French part)",
    "default_currency": null
  },
  {
    "id": "PM",
    "name": "Saint Pierre and Miquelon",
    "default_currency": null
  },
  {
    "id": "VC",
    "name": "Saint Vincent and the Grenadines",
    "default_currency": null
  },
  {
    "id": "WS",
    "name": "Samoa",
    "default_currency": null
  },
  {
    "id": "SM",
    "name": "San Marino",
    "default_currency": null
  },
  {
    "id": "ST",
    "name": "Sao Tome and Principe",
    "default_currency": null
  },
  {
    "id": "SA",
    "name": "Saudi Arabia",
    "default_currency": null
  },
  {
    "id": "SN",
    "name": "Senegal",
    "default_currency": null
  },
  {
    "id": "RS",
    "name": "Serbia",
    "default_currency": null
  },
  {
    "id": "SC",
    "name": "Seychelles",
    "default_currency": null
  },
  {
    "id": "SL",
    "name": "Sierra Leone",
    "default_currency": null
  },
  {
    "id": "SG",
    "name": "Singapore",
    "default_currency": null
  },
  {
    "id": "SX",
    "name": "Sint Maarten",
    "default_currency": null
  },
  {
    "id": "SK",
    "name": "Slovakia",
    "default_currency": null
  },
  {
    "id": "SI",
    "name": "Slovenia",
    "default_currency": null
  },
  {
    "id": "SB",
    "name": "Solomon Islands",
    "default_currency": null
  },
  {
    "id": "SO",
    "name": "Somalia",
    "default_currency": null
  },
  {
    "id": "ZA",
    "name": "South Africa",
    "default_currency": null
  },
  {
    "id": "GS",
    "name": "South Georgia and South Sandwich Islands",
    "default_currency": null
  },
  {
    "id": "KR",
    "name": "South Korea",
    "default_currency": null
  },
  {
    "id": "SS",
    "name": "South Sudan",
    "default_currency": null
  },
  {
    "id": "ES",
    "name": "Spain",
    "default_currency": null
  },
  {
    "id": "LK",
    "name": "Sri Lanka",
    "default_currency": null
  },
  {
    "id": "SD",
    "name": "Sudan",
    "default_currency": null
  },
  {
    "id": "SR",
    "name": "Suriname",
    "default_currency": null
  },
  {
    "id": "SJ",
    "name": "Svalbard and Jan Mayen",
    "default_currency": null
  },
  {
    "id": "SZ",
    "name": "Swaziland",
    "default_currency": null
  },
  {
    "id": "SE",
    "name": "Sweden",
    "default_currency": null
  },
  {
    "id": "CH",
    "name": "Switzerland",
    "default_currency": null
  },
  {
    "id": "SY",
    "name": "Syrian Arab Republic",
    "default_currency": null
  },
  {
    "id": "TW",
    "name": "Taiwan, Province of China",
    "default_currency": null
  },
  {
    "id": "TJ",
    "name": "Tajikistan",
    "default_currency": null
  },
  {
    "id": "TZ",
    "name": "Tanzania, United Republic of",
    "default_currency": null
  },
  {
    "id": "TH",
    "name": "Thailand",
    "default_currency": null
  },
  {
    "id": "TL",
    "name": "Timor-Leste",
    "default_currency": null
  },
  {
    "id": "TG",
    "name": "Togo",
    "default_currency": null
  },
  {
    "id": "TK",
    "name": "Tokelau",
    "default_currency": null
  },
  {
    "id": "TO",
    "name": "Tonga",
    "default_currency": null
  },
  {
    "id": "TT",
    "name": "Trinidad and Tobago",
    "default_currency": null
  },
  {
    "id": "TN",
    "name": "Tunisia",
    "default_currency": null
  },
  {
    "id": "TR",
    "name": "Turkey",
    "default_currency": null
  },
  {
    "id": "TM",
    "name": "Turkmenistan",
    "default_currency": null
  },
  {
    "id": "TC",
    "name": "Turks and Caicos Islands",
    "default_currency": null
  },
  {
    "id": "TV",
    "name": "Tuvalu",
    "default_currency": null
  },
  {
    "id": "UG",
    "name": "Uganda",
    "default_currency": null
  },
  {
    "id": "UA",
    "name": "Ukraine",
    "default_currency": "UAH"
  },
  {
    "id": "AE",
    "name": "United Arab Emirates",
    "default_currency": null
  },
  {
    "id": "GB",
    "name": "United Kingdom",
    "default_currency": null
  },
  {
    "id": "US",
    "name": "United States",
    "default_currency": null
  },
  {
    "id": "UM",
    "name": "United States Minor Outlying Islands",
    "default_currency": null
  },
  {
    "id": "UY",
    "name": "Uruguay",
    "default_currency": null
  },
  {
    "id": "UZ",
    "name": "Uzbekistan",
    "default_currency": null
  },
  {
    "id": "VU",
    "name": "Vanuatu",
    "default_currency": null
  },
  {
    "id": "VE",
    "name": "Venezuela, Bolivarian Republic of",
    "default_currency": null
  },
  {
    "id": "VN",
    "name": "Viet Nam",
    "default_currency": null
  },
  {
    "id": "VG",
    "name": "Virgin Islands, British",
    "default_currency": null
  },
  {
    "id": "VI",
    "name": "Virgin Islands, U.S.",
    "default_currency": null
  },
  {
    "id": "WF",
    "name": "Wallis and Futuna",
    "default_currency": null
  },
  {
    "id": "EH",
    "name": "Western Sahara",
    "default_currency": null
  },
  {
    "id": "YE",
    "name": "Yemen",
    "default_currency": null
  },
  {
    "id": "ZM",
    "name": "Zambia",
    "default_currency": null
  },
  {
    "id": "ZW",
    "name": "Zimbabwe",
    "default_currency": null
  }
]

const mockPayments = [
  {
    "id": "Transfers with specific bank",
    "name": "Transfers with specific bank",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "National bank transfer",
    "name": "National bank transfer",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "CashU",
    "name": "CashU",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Worldremit",
    "name": "Worldremit",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Moneygram",
    "name": "Moneygram",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "WeChat",
    "name": "WeChat",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "advcash",
    "name": "advcash",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Payoneer",
    "name": "Payoneer",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "SolidTrustPay",
    "name": "SolidTrustPay",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Neteller",
    "name": "Neteller",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Payeer",
    "name": "Payeer",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Yandex Money",
    "name": "Yandex Money",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Western Union",
    "name": "Western Union",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "RIA Money Transfer",
    "name": "RIA Money Transfer",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "OKPay",
    "name": "OKPay",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "WebMoney",
    "name": "WebMoney",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Paypal",
    "name": "Paypal",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Transferwise",
    "name": "Transferwise",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "International Wire (SWIFT)",
    "name": "International Wire (SWIFT)",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "QIWI",
    "name": "QIWI",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Payza",
    "name": "Payza",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Credit card",
    "name": "Credit card",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Paxum",
    "name": "Paxum",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Perfect Money",
    "name": "Perfect Money",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  },
  {
    "id": "Moneybookers / Skrill",
    "name": "Moneybookers / Skrill",
    "currency": [
      {
        "id": "AED",
        "iso": "AED"
      },
      {
        "id": "AFN",
        "iso": "AFN"
      },
      {
        "id": "ALL",
        "iso": "ALL"
      },
      {
        "id": "AMD",
        "iso": "AMD"
      },
      {
        "id": "ANG",
        "iso": "ANG"
      },
      {
        "id": "AOA",
        "iso": "AOA"
      },
      {
        "id": "ARS",
        "iso": "ARS"
      },
      {
        "id": "AUD",
        "iso": "AUD"
      },
      {
        "id": "AWG",
        "iso": "AWG"
      },
      {
        "id": "AZN",
        "iso": "AZN"
      },
      {
        "id": "BAM",
        "iso": "BAM"
      },
      {
        "id": "BBD",
        "iso": "BBD"
      },
      {
        "id": "BDT",
        "iso": "BDT"
      },
      {
        "id": "BGN",
        "iso": "BGN"
      },
      {
        "id": "BHD",
        "iso": "BHD"
      },
      {
        "id": "BIF",
        "iso": "BIF"
      },
      {
        "id": "BMD",
        "iso": "BMD"
      },
      {
        "id": "BND",
        "iso": "BND"
      },
      {
        "id": "BOB",
        "iso": "BOB"
      },
      {
        "id": "BRL",
        "iso": "BRL"
      },
      {
        "id": "BSD",
        "iso": "BSD"
      },
      {
        "id": "BTN",
        "iso": "BTN"
      },
      {
        "id": "BWP",
        "iso": "BWP"
      },
      {
        "id": "BYN",
        "iso": "BYN"
      },
      {
        "id": "BYR",
        "iso": "BYR"
      },
      {
        "id": "BZD",
        "iso": "BZD"
      },
      {
        "id": "CAD",
        "iso": "CAD"
      },
      {
        "id": "CDF",
        "iso": "CDF"
      },
      {
        "id": "CHF",
        "iso": "CHF"
      },
      {
        "id": "CLF",
        "iso": "CLF"
      },
      {
        "id": "CLP",
        "iso": "CLP"
      },
      {
        "id": "CNH",
        "iso": "CNH"
      },
      {
        "id": "CNY",
        "iso": "CNY"
      },
      {
        "id": "COP",
        "iso": "COP"
      },
      {
        "id": "CRC",
        "iso": "CRC"
      },
      {
        "id": "CUC",
        "iso": "CUC"
      },
      {
        "id": "CUP",
        "iso": "CUP"
      },
      {
        "id": "CVE",
        "iso": "CVE"
      },
      {
        "id": "CZK",
        "iso": "CZK"
      },
      {
        "id": "DJF",
        "iso": "DJF"
      },
      {
        "id": "DKK",
        "iso": "DKK"
      },
      {
        "id": "DOP",
        "iso": "DOP"
      },
      {
        "id": "DZD",
        "iso": "DZD"
      },
      {
        "id": "EEK",
        "iso": "EEK"
      },
      {
        "id": "EGP",
        "iso": "EGP"
      },
      {
        "id": "ERN",
        "iso": "ERN"
      },
      {
        "id": "ETB",
        "iso": "ETB"
      },
      {
        "id": "EUR",
        "iso": "EUR"
      },
      {
        "id": "FJD",
        "iso": "FJD"
      },
      {
        "id": "FKP",
        "iso": "FKP"
      },
      {
        "id": "GBP",
        "iso": "GBP"
      },
      {
        "id": "GEL",
        "iso": "GEL"
      },
      {
        "id": "GGP",
        "iso": "GGP"
      },
      {
        "id": "GHS",
        "iso": "GHS"
      },
      {
        "id": "GIP",
        "iso": "GIP"
      },
      {
        "id": "GMD",
        "iso": "GMD"
      },
      {
        "id": "GNF",
        "iso": "GNF"
      },
      {
        "id": "GTQ",
        "iso": "GTQ"
      },
      {
        "id": "GYD",
        "iso": "GYD"
      },
      {
        "id": "HKD",
        "iso": "HKD"
      },
      {
        "id": "HNL",
        "iso": "HNL"
      },
      {
        "id": "HRK",
        "iso": "HRK"
      },
      {
        "id": "HTG",
        "iso": "HTG"
      },
      {
        "id": "HUF",
        "iso": "HUF"
      },
      {
        "id": "IDR",
        "iso": "IDR"
      },
      {
        "id": "ILS",
        "iso": "ILS"
      },
      {
        "id": "IMP",
        "iso": "IMP"
      },
      {
        "id": "INR",
        "iso": "INR"
      },
      {
        "id": "IQD",
        "iso": "IQD"
      },
      {
        "id": "IRR",
        "iso": "IRR"
      },
      {
        "id": "ISK",
        "iso": "ISK"
      },
      {
        "id": "JEP",
        "iso": "JEP"
      },
      {
        "id": "JMD",
        "iso": "JMD"
      },
      {
        "id": "JOD",
        "iso": "JOD"
      },
      {
        "id": "JPY",
        "iso": "JPY"
      },
      {
        "id": "KES",
        "iso": "KES"
      },
      {
        "id": "KGS",
        "iso": "KGS"
      },
      {
        "id": "KHR",
        "iso": "KHR"
      },
      {
        "id": "KMF",
        "iso": "KMF"
      },
      {
        "id": "KPW",
        "iso": "KPW"
      },
      {
        "id": "KRW",
        "iso": "KRW"
      },
      {
        "id": "KWD",
        "iso": "KWD"
      },
      {
        "id": "KYD",
        "iso": "KYD"
      },
      {
        "id": "KZT",
        "iso": "KZT"
      },
      {
        "id": "LAK",
        "iso": "LAK"
      },
      {
        "id": "LBP",
        "iso": "LBP"
      },
      {
        "id": "LKR",
        "iso": "LKR"
      },
      {
        "id": "LRD",
        "iso": "LRD"
      },
      {
        "id": "LSL",
        "iso": "LSL"
      },
      {
        "id": "LTL",
        "iso": "LTL"
      },
      {
        "id": "LVL",
        "iso": "LVL"
      },
      {
        "id": "LYD",
        "iso": "LYD"
      },
      {
        "id": "MAD",
        "iso": "MAD"
      },
      {
        "id": "MDL",
        "iso": "MDL"
      },
      {
        "id": "MGA",
        "iso": "MGA"
      },
      {
        "id": "MKD",
        "iso": "MKD"
      },
      {
        "id": "MMK",
        "iso": "MMK"
      },
      {
        "id": "MNT",
        "iso": "MNT"
      },
      {
        "id": "MOP",
        "iso": "MOP"
      },
      {
        "id": "MRO",
        "iso": "MRO"
      },
      {
        "id": "MRU",
        "iso": "MRU"
      },
      {
        "id": "MTL",
        "iso": "MTL"
      },
      {
        "id": "MUR",
        "iso": "MUR"
      },
      {
        "id": "MVR",
        "iso": "MVR"
      },
      {
        "id": "MWK",
        "iso": "MWK"
      },
      {
        "id": "MXN",
        "iso": "MXN"
      },
      {
        "id": "MYR",
        "iso": "MYR"
      },
      {
        "id": "MZN",
        "iso": "MZN"
      },
      {
        "id": "NAD",
        "iso": "NAD"
      },
      {
        "id": "NGN",
        "iso": "NGN"
      },
      {
        "id": "NIO",
        "iso": "NIO"
      },
      {
        "id": "NOK",
        "iso": "NOK"
      },
      {
        "id": "NPR",
        "iso": "NPR"
      },
      {
        "id": "NZD",
        "iso": "NZD"
      },
      {
        "id": "OMR",
        "iso": "OMR"
      },
      {
        "id": "PAB",
        "iso": "PAB"
      },
      {
        "id": "PEN",
        "iso": "PEN"
      },
      {
        "id": "PGK",
        "iso": "PGK"
      },
      {
        "id": "PHP",
        "iso": "PHP"
      },
      {
        "id": "PKR",
        "iso": "PKR"
      },
      {
        "id": "PLN",
        "iso": "PLN"
      },
      {
        "id": "PYG",
        "iso": "PYG"
      },
      {
        "id": "QAR",
        "iso": "QAR"
      },
      {
        "id": "RON",
        "iso": "RON"
      },
      {
        "id": "RSD",
        "iso": "RSD"
      },
      {
        "id": "RUB",
        "iso": "RUB"
      },
      {
        "id": "RWF",
        "iso": "RWF"
      },
      {
        "id": "SAR",
        "iso": "SAR"
      },
      {
        "id": "SBD",
        "iso": "SBD"
      },
      {
        "id": "SCR",
        "iso": "SCR"
      },
      {
        "id": "SDG",
        "iso": "SDG"
      },
      {
        "id": "SEK",
        "iso": "SEK"
      },
      {
        "id": "SGD",
        "iso": "SGD"
      },
      {
        "id": "SHP",
        "iso": "SHP"
      },
      {
        "id": "SLL",
        "iso": "SLL"
      },
      {
        "id": "SOS",
        "iso": "SOS"
      },
      {
        "id": "SRD",
        "iso": "SRD"
      },
      {
        "id": "SSP",
        "iso": "SSP"
      },
      {
        "id": "STD",
        "iso": "STD"
      },
      {
        "id": "STN",
        "iso": "STN"
      },
      {
        "id": "SVC",
        "iso": "SVC"
      },
      {
        "id": "SYP",
        "iso": "SYP"
      },
      {
        "id": "SZL",
        "iso": "SZL"
      },
      {
        "id": "THB",
        "iso": "THB"
      },
      {
        "id": "TJS",
        "iso": "TJS"
      },
      {
        "id": "TMT",
        "iso": "TMT"
      },
      {
        "id": "TND",
        "iso": "TND"
      },
      {
        "id": "TOP",
        "iso": "TOP"
      },
      {
        "id": "TRY",
        "iso": "TRY"
      },
      {
        "id": "TTD",
        "iso": "TTD"
      },
      {
        "id": "TWD",
        "iso": "TWD"
      },
      {
        "id": "TZS",
        "iso": "TZS"
      },
      {
        "id": "UAH",
        "iso": "UAH"
      },
      {
        "id": "UGX",
        "iso": "UGX"
      },
      {
        "id": "USD",
        "iso": "USD"
      },
      {
        "id": "UYU",
        "iso": "UYU"
      },
      {
        "id": "UZS",
        "iso": "UZS"
      },
      {
        "id": "VES",
        "iso": "VES"
      },
      {
        "id": "VND",
        "iso": "VND"
      },
      {
        "id": "VUV",
        "iso": "VUV"
      },
      {
        "id": "WST",
        "iso": "WST"
      },
      {
        "id": "XAF",
        "iso": "XAF"
      },
      {
        "id": "XAG",
        "iso": "XAG"
      },
      {
        "id": "XAR",
        "iso": "XAR"
      },
      {
        "id": "XAU",
        "iso": "XAU"
      },
      {
        "id": "XCD",
        "iso": "XCD"
      },
      {
        "id": "XDR",
        "iso": "XDR"
      },
      {
        "id": "XOF",
        "iso": "XOF"
      },
      {
        "id": "XPD",
        "iso": "XPD"
      },
      {
        "id": "XPF",
        "iso": "XPF"
      },
      {
        "id": "XPT",
        "iso": "XPT"
      },
      {
        "id": "YER",
        "iso": "YER"
      },
      {
        "id": "ZAR",
        "iso": "ZAR"
      },
      {
        "id": "ZMK",
        "iso": "ZMK"
      },
      {
        "id": "ZMW",
        "iso": "ZMW"
      },
      {
        "id": "ZWL",
        "iso": "ZWL"
      }
    ],
    "min_amount": {
      "AED": 11.97,
      "AFN": 254.78,
      "ALL": 364.6,
      "AMD": 1551.53,
      "ANG": 5.71,
      "AOA": 1232.38,
      "ARS": 187.99,
      "AUD": 4.82,
      "AWG": 5.87,
      "AZN": 5.55,
      "BAM": 5.81,
      "BBD": 6.52,
      "BDT": 275.5,
      "BGN": 5.81,
      "BHD": 1.23,
      "BIF": 6015,
      "BMD": 3.26,
      "BND": 4.49,
      "BOB": 22.51,
      "BRL": 13.32,
      "BSD": 3.26,
      "BTN": 230.77,
      "BWP": 35.98,
      "BYN": 6.77,
      "BYR": 65285.58,
      "BZD": 6.56,
      "CAD": 4.34,
      "CDF": 5410.78,
      "CHF": 3.25,
      "CLF": 0.08,
      "CLP": 2336.07,
      "CNH": 23.22,
      "CNY": 23.3,
      "COP": 11378.66,
      "CRC": 1891.1,
      "CUC": 3.26,
      "CUP": 83.94,
      "CVE": 329.26,
      "CZK": 76.38,
      "DJF": 580.44,
      "DKK": 22.18,
      "DOP": 169.34,
      "DZD": 391.93,
      "EEK": 47.4,
      "EGP": 53.17,
      "ERN": 48.9,
      "ETB": 95.82,
      "EUR": 2.97,
      "FJD": 7.14,
      "FKP": 2.64,
      "GBP": 2.64,
      "GEL": 9.67,
      "GGP": 2.64,
      "GHS": 17.53,
      "GIP": 2.64,
      "GMD": 164.63,
      "GNF": 30081.52,
      "GTQ": 25.27,
      "GYD": 679.03,
      "HKD": 25.57,
      "HNL": 80.11,
      "HRK": 22.03,
      "HTG": 311.75,
      "HUF": 987.59,
      "IDR": 46089.88,
      "ILS": 11.35,
      "IMP": 2.64,
      "INR": 231.4,
      "IQD": 3883.66,
      "IRR": 137262.3,
      "ISK": 403.13,
      "JEP": 2.64,
      "JMD": 436.1,
      "JOD": 2.31,
      "JPY": 348.12,
      "KES": 338.32,
      "KGS": 227.06,
      "KHR": 13302.06,
      "KMF": 1465.04,
      "KPW": 2934,
      "KRW": 3899.51,
      "KWD": 0.99,
      "KYD": 2.71,
      "KZT": 1266.48,
      "LAK": 28700.05,
      "LBP": 4921.06,
      "LKR": 590.9,
      "LRD": 684.28,
      "LSL": 49.35,
      "LTL": 10.46,
      "LVL": 2.13,
      "LYD": 4.61,
      "MAD": 31.58,
      "MDL": 57.7,
      "MGA": 12123.66,
      "MKD": 182.7,
      "MMK": 4983.67,
      "MNT": 8686.82,
      "MOP": 26.29,
      "MRO": 1163.82,
      "MRU": 121.67,
      "MTL": 2.23,
      "MUR": 118.92,
      "MVR": 50.2,
      "MWK": 2390.43,
      "MXN": 63.81,
      "MYR": 13.64,
      "MZN": 202.29,
      "NAD": 49.35,
      "NGN": 1180.64,
      "NIO": 109.41,
      "NOK": 29.73,
      "NPR": 369.23,
      "NZD": 5.15,
      "OMR": 1.26,
      "PAB": 3.26,
      "PEN": 11.03,
      "PGK": 11.08,
      "PHP": 168.85,
      "PKR": 510.19,
      "PLN": 12.87,
      "PYG": 20847.83,
      "QAR": 11.85,
      "RON": 14.1,
      "RSD": 349.13,
      "RUB": 211.49,
      "RWF": 3011.49,
      "SAR": 12.23,
      "SBD": 26.98,
      "SCR": 44.66,
      "SDG": 146.82,
      "SEK": 32.11,
      "SGD": 4.5,
      "SHP": 2.64,
      "SLL": 24057.85,
      "SOS": 1882.69,
      "SRD": 24.31,
      "SSP": 424.65,
      "STD": 70288.18,
      "STN": 73.25,
      "SVC": 28.48,
      "SYP": 1673.18,
      "SZL": 49.69,
      "THB": 99.26,
      "TJS": 31.54,
      "TMT": 11.41,
      "TND": 9.3,
      "TOP": 7.59,
      "TRY": 18.6,
      "TTD": 22.01,
      "TWD": 100.81,
      "TZS": 7470.62,
      "UAH": 80.75,
      "UGX": 11980.45,
      "USD": 3.26,
      "UYU": 120.5,
      "UZS": 30675.56,
      "VES": 65859.2,
      "VND": 75518.34,
      "VUV": 381.01,
      "WST": 8.66,
      "XAF": 1948.36,
      "XAG": 0.19,
      "XAR": 188.36,
      "XAU": 0,
      "XCD": 8.81,
      "XDR": 2.38,
      "XOF": 1948.36,
      "XPD": 0,
      "XPF": 354.45,
      "XPT": 0,
      "YER": 816.14,
      "ZAR": 49.43,
      "ZMK": 17121.6,
      "ZMW": 42.85,
      "ZWL": 1049.72
    }
  }
]

const mockOrderInfo = {
  "id": 61921,    // id ордера
  "amount": 550.00000000,   // сумма
  "status": "COMPLETE",      // статус
  "commission": 11.00000000,   //комиссия мерчанты
  "paymentSystemId": "OKPay",  // платежная система
  "currency": "SGD",   //валюта
  "countryId": "SG",   //id старны
  "paymentDetails": "платежные детали 4531231656556146",  //детали для оплаты
  "statusModifDate": "2019-10-22 17:07:40",    //дата последнего изменения статуса
  "paymentDetailsReceivedDate": "2019-10-22 16:57:18",   // дата получения срока оплаты или платежных деталей
  "paymentEndTime": "2019-10-22 17:15:21",  // срок оплаты, обязательно выводить юзеру!
  "confirmed": true  //подтверждена ли оптала юзером
}

@Injectable()
export class SyndexService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getSyndexCountries(): Observable<SyndexCountry[]> {
    // return this.http.get<SyndexCountry[]>(`${this.apiUrl}/api/public/v2/syndex/country`);
    return of(mockCountries)
  }

  getSyndexPaymentSystems(countryId: string): Observable<SyndexPaymentSystem[]> {
    // const params = {
    //   country: countryId,
    // };
    // return this.http.get<SyndexPaymentSystem[]>(`${this.apiUrl}/api/public/v2/syndex/country`, { params });
    return of(mockPayments)
  }

  getSyndexOrderInfo(orderId: string): Observable<SyndexOrderInfo> {
    // const params = {
    //   id: orderId,
    // };
    // return this.http.get<SyndexOrderInfo>(`${this.apiUrl}/api/private/v2/syndex/order`, { params });
    return of(mockOrderInfo);
  }

  postSyndexOrder(orderId: string) {
    // const params = {
    //   id: orderId,
    // };
    // return this.http.post<SyndexOrderInfo>(`${this.apiUrl}/api/private/v2/syndex/order`, { params });
    return of(mockOrderInfo);
  }

  postSyndexOrderDisput(id: string, text: string) {
    // const params = {
    //   id,
    //   text,
    // };
    // return this.http.post<SyndexOrderInfo>(`${this.apiUrl}/api/private/v2/syndex/order/dipsute`, { params });
    return of(mockOrderInfo);
  }

}
