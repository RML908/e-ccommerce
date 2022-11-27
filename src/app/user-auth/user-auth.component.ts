import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {cart, login, product, signUp} from '../data-type';
import {ProductService} from '../services/product.service';
import {UserService} from '../services/user.service';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true
  authError: string = "";
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;
  alert: { type: any; message: string } = {
    type: 'success',
    message: ''
  };
  signUpForm: FormGroup;
  showAlert: boolean = false;
  @Input() error: string | null;

  constructor(private user: UserService,
              private product: ProductService,
              private formBuilder: FormBuilder,
              private router: Router
  ) {
  }

  ngOnInit(): void {
    // Create the form
    this.signUpForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        agreements: ['', Validators.requiredTrue]
      }
    );
    this.user.userAuthReload();
  }

  signUp(data: signUp) {
    this.user.userSignUp(data);
  }

  login(data: login) {
    this.user.userLogin(data)
    this.user.invalidUserAuth.subscribe((result) => {
      if (result) {
        this.authError = "User not found"
      } else {
        this.localCartToRemoteCart();
      }

    })
  }

  openSignUp() {
    this.showLogin = false
  }

  openLogin() {
    this.showLogin = true;
  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: product[] = JSON.parse(data);

      cartDataList.forEach((product: product, index) => {
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId
        }
        delete cartData.id;
        setTimeout(() => {
          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
            }
          })
        }, 500);
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart')
        }
      })
    }

    setTimeout(() => {
      this.product.getCartList(userId)
    }, 2000);

  }
}
