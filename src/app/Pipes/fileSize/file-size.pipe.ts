import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  private units = [
    'bytes',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB'
  ];
  transform(bytes: number = 0, precision: number = 2 ): string {
    if (!isFinite(bytes)) {
      return '?';
    }
    let unit = 0;
    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }
    if (bytes % 1024 <= 10) { precision = 0; }
    return bytes.toFixed( + precision ) + ' ' + this.units[ unit ];
  }
}
