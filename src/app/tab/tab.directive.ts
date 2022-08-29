import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {tabService} from '@app/_services/tab.service';
//обработка клавиш по табу
@Directive({
	selector: '[tabEnterIndex]'
})
export class TabDirective implements OnInit{
	private _index: number;

	get index():any{
		return this._index;
	}

	@Input('tabIndex')

	set index(i:any){
		this._index = parseInt(i);
	}
	@HostListener('keydown',['$event'])
	onInput(e: KeyboardEvent){
		if(e.code ==='Enter'){
			this.TabService.selectedInput.next(this.index + 1)
			e.preventDefault();
		}
	}
	constructor(private el: ElementRef, private TabService: tabService) {
	}

	ngOnInit(): void {
		this.TabService.selectedInput.subscribe((i)=>{
			if(i===this.index){
				this.el.nativeElement.focus();
			}
		})
	}

}
