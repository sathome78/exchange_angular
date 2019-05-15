import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'cutAndAddEllipsis'
})
export class CutAddEllipsisPipe implements PipeTransform {
  transform(value: string, count: number = 300): string {
    return !!value && value.length > count ? `${value.slice(0, count)} ...` : value;
  }
}
