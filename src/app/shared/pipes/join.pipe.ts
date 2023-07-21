import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'appJoin',
    standalone: true
})

export class JoinPipe implements PipeTransform {
    transform<T>(values: T[], access: (value: T) => string, join: string): any {
        return values.map(access).join(join);
    }
}