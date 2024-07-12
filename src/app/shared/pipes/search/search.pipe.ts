import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
transform(items: any[], searchText: string): any[] {
  if (!items) return [];
  if (!searchText) return items;

  return items.filter((item) => {
    return (
      String(item.firstName).toLowerCase().includes(searchText.toLowerCase()) ||
      String(item.LastName).toLowerCase().includes(searchText.toLowerCase())
    );
  });
}

}
