import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {product} from '../data-type';
import {ProductService} from '../services/product.service';
import {NgbConfig, NgbDropdownConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = "";
  userName: string = "";
  searchResult: undefined | product[];
  cartItems = 0;
  isCollapsed: boolean = true;
  public searchTerm!: string;

  constructor(private route: Router,
              private product: ProductService,
              private config: NgbDropdownConfig
  ) {
    config.placement = 'top-start';
    config.autoClose = false;
  }

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerStore = localStorage.getItem('seller');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName = sellerData.name;
          this.menuType = 'seller';
        } else if (localStorage.getItem('user')) {
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType = 'user';
          this.product.getCartList(userData.id);
        } else {
          this.menuType = 'default';
        }
      }
    });
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length
    }
    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length
    })
  }

  logout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/'])
  }

  userLogout() {
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth'])
    this.product.cartData.emit([])
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      this.searchTerm = (query.target as HTMLInputElement).value;
      this.product.searchProduct(this.searchTerm).subscribe((result) => {
        if (result.length > 5) {
          result.length = length
        }
        this.searchResult = result;
      })
    }
  }

  hideSearch() {
    this.searchResult = undefined
  }

  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id])
  }

  submitSearch(val: string) {
    this.route.navigate([`search/${val}`]);
  }

  dropdown() {
    let x = document.getElementById('myTopnav') as HTMLDivElement | null;
    const getClass = x?.className === 'dropdown' ? x!.className += 'responsive' : x!.className = 'topnav'
    return getClass
  }

  myFunction() {
    let x = document.getElementById("myTopnav") as HTMLDivElement | null;
    if (x?.className === "topnav") {
      x.className += " responsive";
    } else {
      x!.className = "topnav";
    }
  }
}
