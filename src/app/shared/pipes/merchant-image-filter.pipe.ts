import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'merchantImageFilter'
})
export class MerchantImageFilterPipe  implements PipeTransform {
  transform(array: any[], query: string): any[] {
    return array.filter(f => f.image_name.toUpperCase().match(query.toUpperCase()));
  }
}
