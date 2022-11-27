import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appProductColor]'
})
export class ProductColorDirective {
@Input() appProductColor = '';
  constructor(private el: ElementRef,
              private render:Renderer2
              ) {
    // this.el.nativeElement.style.backgroundColor= 'red'
  }
   productColor(color:string){
    this.el.nativeElement.style.backgroundColor=color
  }
@HostListener('mouseenter',)onMouseEnter(){
    // this.render.setStyle(this.el.nativeElement,
    //   'background-color','black'
    //   )
  console.log('changed')
    this.productColor(this.appProductColor||'red')
}

}
