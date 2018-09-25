import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class LangService {

  currentLanguage = 'en';

  langChangeEvent = new Subject<string>();

  getLanguage() {
    return this.currentLanguage;
  }

  getLanguages(): string[] {
    return ['en', 'ru', 'cn', 'ar', 'in'];
  }

  setLanguage(language: string) {
    this.currentLanguage = language.toLowerCase();
    this.langChangeEvent.next(this.getLanguage());
  }

}
