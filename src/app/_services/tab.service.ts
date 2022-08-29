import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

Injectable({ providedIn: 'root' })
export class tabService {
 selectedInput:BehaviorSubject<number> = new BehaviorSubject<number>(1);
}
