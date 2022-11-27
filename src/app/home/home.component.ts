import {Component, OnInit, ViewChild} from '@angular/core';
import {cart, product} from '../data-type';
import {ProductService} from '../services/product.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public allProducts: product[];
  public trendyProducts: any;
  public filterCategory: product[];
  public productQuantity: number = 1;
  public searchKey: string = '';
  public filterName: string = '';
  public page = 1;
  private cartData: product | undefined;
  private user: any;
  private products: product;
  private productsSubscription: Subscription


  constructor(private product: ProductService,
              private activeRoute: ActivatedRoute,
              private router: Router
  ) {
    this.user = localStorage.getItem('user');
  }

  ngOnInit(): void {
    let json = this.product.getProduct('id')
    let productId = this.activeRoute.snapshot.paramMap.get('productId')
    let cartData = localStorage.getItem('localCart');
    this.productsSubscription = this.product.allProducts(this.page).subscribe((data: any) => {
      this.allProducts = data;
      this.filterCategory = data
      this.allProducts.forEach((a: any) => {
        if (a.category === "women's clothing" || a.category === "men's clothing") {
          a.category = "fashion"

        }
        Object.assign(a, {quantity: 1, total: a.price})

      })

    })

    this.product.trendyProducts().subscribe((data: any) => {
      if (data)
        this.trendyProducts = data;
    })

    this.user = localStorage.getItem('user');

  }

  addToCart(item: any) {
    if (!localStorage.getItem('user')) {
      this.product.localAddToCart(item.id)
    } else {
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
      let cartData: cart = {
        ...item,
        productId: item.id,
        userId
      }
      delete cartData.id;
      this.product.addToCart(cartData).subscribe((result) => {
        if (result) {
          this.product.getCartList(userId);
        }
      })
    }
  }

  filter(category: string) {
    this.filterCategory = this.allProducts
      .filter((val: any) => {
        if (val.category == category || category == '') {
          this.filterName = val.category
          return val;
        }
      })
  }

  onScroll() {
    this.product.allProducts(this.page)
      .subscribe((item: product[]) => {
        this.allProducts.push(...item);
      })
  }

  onScrollUp() {
    this.product.allProducts(this.page)
      .subscribe((item: product[]) => {
        // this.allProducts.filter()
      })

  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe()
  }

  // not finished yet
  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

}
