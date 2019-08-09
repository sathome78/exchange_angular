import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicIData',
})
export class DynamicInputDataPipe implements PipeTransform {
  transform(value: any, textKey: string, idKey: string): DIOptions[] {
    let text = '';
    let id = '';
    if (!textKey) {
      text = 'text';
    } else if (!idKey) {
      id = 'id';
    } else {
      text = textKey;
      id = idKey;
    }
    return value.map(item => ({ text: item[text], id: item[id] }));
  }
}
