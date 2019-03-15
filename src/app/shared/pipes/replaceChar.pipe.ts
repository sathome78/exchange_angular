import {Pipe, PipeTransform} from "@angular/core";


@Pipe({name: "replaceChar"})
export class ReplaceCharPipe implements PipeTransform {
  transform(value: string, oldChar: string = '', newChar: string = ''): string {
    const reg = new RegExp(oldChar, 'g');
    return value.replace(reg, newChar);
  }
}
