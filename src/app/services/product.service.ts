import {HttpClient, HttpContext, HttpHeaders, HttpParams} from '@angular/common/http';
import {EventEmitter, Injectable} from '@angular/core';
import {cart, order, product} from '../data-type';
import {BehaviorSubject, Observable} from "rxjs";
import {PageEvent} from "@angular/material/paginator";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<product[] | []>();
  public search = new BehaviorSubject<String>('');

  constructor(private http: HttpClient) {
  }

  prodcuts: Observable<any> = this.http.get('api/products')
  url = JSON.stringify(this.prodcuts)

  addProduct(data: product) {
    return this.http.post("api/products", data);
  }

  productList() {
    return this.http.get<product[]>(`api/products`);
  }

  producNewtList(event: PageEvent | undefined) {
    return this.http.get<any>(`api/products`);
  }

  deleteProduct(id: number) {
    return this.http.delete(`api/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`api/products/${id}`);
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      'api//products/${product.id}',
      product
    );
  }

  allProducts(page: number): Observable<product[]> {
    return this.http.get(
      `api/products?page=${page}&limit=5`
    ) as Observable<product[]>;
  }

  trendyProducts() {
    return this.http.get<product[]>(`api/trendy_products?/trendy_products`
    ) as Observable<product[]>;
  }

  searchProduct(query: string) {
    return this.http.get<product[]>(
      `api/products?q=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post(`api/cart`, cartData);
  }

  getCartData() {

    return this.http.get<cart[]>(`api/cart`) as Observable<cart[]>

  }

  getCartList(userId: any) {
    return this.http
      .get<product[]>(`api/cart?userId=` + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  removeToCart(cartId: number) {
    return this.http.delete(`api/cart` + cartId);
  }

  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>(`api/cart?userId=` + userData.id);
  }

  orderNow(data: order) {
    return this.http.post(`api/orders`, data);
  }

  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>(`api/orders?userId=` + userData.id);
  }

  deleteCartItems(cartId: number) {
    return this.http.delete(`api/cart/` + cartId).subscribe((result) => {
      this.cartData.emit([]);
    })
  }

  cancelOrder(orderId: number) {
    return this.http.delete(`api/orders/` + orderId)

  }

}
