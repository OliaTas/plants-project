import { Component, HostListener, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultResponseType } from 'src/types/default-response.type';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ProductType } from 'src/types/product.type';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  

  // searchField = new FormControl();
  showedSearch: boolean = false;
  serverStaticPath = environment.serverStaticPath;
  products: ProductType[] = [];
  searchValue: string = '';
  count: number = 0;
  isLogged: boolean = false;
  @Input() categories: CategoryWithTypeType[] = [];

  constructor(private authService: AuthService, private _snackBar: MatSnackBar,
    private router: Router, private cartService: CartService, private productService: ProductService) {
    this.isLogged = this.authService.getLoggedIn();
  }

  ngOnInit(): void {
    // this.searchField.valueChanges
    //   .pipe(
    //     debounceTime(500)
    //   )
    //   .subscribe(value => {
    //     if (value && value.length > 2) {
    //       this.productService.searchProducts(value)
    //         .subscribe((data: ProductType[]) => {
    //           this.products = data;
    //           this.showedSearch = true;
    //         });
    //     } else {
    //       this.products = [];
    //     }
    //   });


    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.cartService.getCartCount()
      .subscribe((data: { count: number } | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        this.count = (data as { count: number }).count;

      })

    this.cartService.count$
      .subscribe(count => {
        this.count = count;
      })

    // isLoggedIn ? this.authService.getUserInfo() : null;
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogOut();
        },
        error: () => {
          this.doLogOut();
        }
      })

  }

  doLogOut(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  changedSearchValue(newValue: string) {
    this.searchValue = newValue;

    if (this.searchValue && this.searchValue.length > 2) {
      this.productService.searchProducts(this.searchValue)
        .subscribe((data: ProductType[]) => {
          this.products = data;
        })
    } else {
      this.products = [];
    }
  }

  selectProduct(url: string) {
    this.router.navigate(['/product/' + url]);
    this.searchValue = '';
    // this.searchField.setValue('');
    this.products = [];
    // this.showedSearch = false;
  }

  changeShowedSearch(value: boolean) {
    setTimeout(() => {
      this.showedSearch = value;
    }, 100)
  }

  // @HostListener('document: click', ['$event'])
  // click(event: Event) {
  //   if(this.showedSearch && (event.target as HTMLElement).className.indexOf('search-product') === -1) {
  //     this.showedSearch = false;
  //   }
  // }

  toggleMenu() {
    const headerContent = document.getElementById('headerContent');
    if( headerContent) {
      headerContent.classList.toggle('open');
    }
   
  }
}
