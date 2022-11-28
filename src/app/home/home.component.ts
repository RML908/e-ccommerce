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
  public gridColumns = 3;
  public page = 1;
  public isLoading: boolean = true
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

    this.isLoading =true
    let json = this.product.getProduct('id')
    let productId = this.activeRoute.snapshot.paramMap.get('productId')
    let cartData = localStorage.getItem('localCart');
    this.productsSubscription = this.product.allProducts(this.page).subscribe((data: any) => {
      this.isLoading = false
      this.allProducts = data;
      this.filterCategory = data
      this.isLoading = false
    })
    this.product.search.subscribe((val:any)=>{
      this.searchKey = val
    })

    this.product.trendyProducts().subscribe((data: any) => {
      if (data)
        this.trendyProducts = data;
    })

    this.user = localStorage.getItem('user');

  }

  addToCart(item: any) {
    this.isLoading = true
    if (!this.user) {
      this.product.localAddToCart(item)
      this.isLoading = false
    } else {
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;
      let cartData: cart = {
        ...item,
        productId: item.id,
        userId
      }
      this.isLoading = false
      delete cartData.id;
      this.product.addToCart(cartData).subscribe((result) => {
        if (result) {
          this.product.getCartList(userId);
        }
        this.isLoading = false
      },error => {

      })
      this.isLoading = false
    }
  }

  filter(category: string) {
     // this.filterCategory =[]
    this.filterCategory =this.allProducts

      .filter((val: any) => {
        if (val.category == category || category == '') {
          this.filterName = val.category
          return val

        }
      })
  }

  onScroll() {
     this.product.allProducts(++this.page)
      .subscribe((item: product[]) => {
        this.allProducts = item;
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
