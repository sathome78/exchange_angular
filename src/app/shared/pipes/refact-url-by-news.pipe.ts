import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'refactUrlByNews' })
export class RefactUrlByNewsPipe implements PipeTransform {
  transform(url: string) {
    const candidate = url.replace('https://', '')
                         .replace('http://', '')
                         .split('/')[0];
    return !!candidate ? `https://${candidate}` : url;
  }
}
