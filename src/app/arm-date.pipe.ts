import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';
//канал для смены формата даты
@Pipe({
  name: 'armDate'
})
export class ArmDatePipe implements PipeTransform {

  transform(value): any {
  	 let regexp = /(\d{4}-\d{2}-\d{2})[A-Z]/g;
  	 let result = (regexp.exec(value));
  	 if(result){
		 let datePipe = new DatePipe('en');
		 return datePipe.transform(result[1],'dd.MM.yyyy');
  	 }
  	 return  value;
  }
}
