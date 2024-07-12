import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rounded'
})
export class RoundedValuePipe implements PipeTransform {
  transform(value: number, decimalPlaces: number = 0): number {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(value * multiplier) / multiplier;
  }
}
