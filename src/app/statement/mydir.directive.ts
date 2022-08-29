import { Directive, ElementRef, HostListener, Input, Renderer2  } from '@angular/core';


@Directive({
  selector: '[appMydir]'
})
export class MydirDirective {
	private el: ElementRef;
	@Input() onReturn: string;
	constructor(private _el: ElementRef) {
		this.el = this._el;
	}
	@HostListener('keydown', ['$event']) onKeyDown(e:any) {
		if ((e.which == 13 || e.keyCode == 13)) {
			e.preventDefault();
			let control:any;
			control = e.srcElement.nextElementSibling;
			while (true){
				if (control) {
					if ((!control.hidden) &&
						(	control.nodeName == 'NG-INPUT'||
							control.nodeName == 'NG-SELECT' ||
							control.nodeName == 'INPUT' ||
							control.nodeName == 'SELECT' ||
							control.nodeName == 'BUTTON' ||
							control.nodeName == 'TEXTAREA'))
					{
						control.focus();
						return;
					}else{
						control = control.nextElementSibling;
					}
				}
				else {
					console.log('close keyboard');
					return;
				}
			}
		}
	}
}
