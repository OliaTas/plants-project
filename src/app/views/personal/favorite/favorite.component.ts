import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/shared/services/cart.service';
import { FavoriteService } from 'src/app/shared/services/favorite.service';
import { environment } from 'src/environments/environment';
import { CartType } from 'src/types/cart.type';
import { DefaultResponseType } from 'src/types/default-response.type';
import { FavoriteType } from 'src/types/favorite.type';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;
  
  count: number = 1;

  constructor(private favoriteService: FavoriteService, private cartService: CartService) { }

  ngOnInit(): void {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.products = data as FavoriteType[];

         this.cartService.getCart()
         .subscribe((cartData: CartType | DefaultResponseType) => {
           if ((cartData as DefaultResponseType).error !== undefined) {
             throw new Error((cartData as DefaultResponseType).message);
           }

           const cartDataResponse = cartData as CartType;
           if (cartDataResponse) {
             this.products.forEach(product => {
               const productInCart = cartDataResponse.items.find(item => item.product.id === product.id);
               if (productInCart) {
                 product.countInCart = productInCart.quantity;
               } else {
                 product.countInCart = 0;
               }
             });
           }
         });
      })
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          //..
          throw new Error(data.message);
        }

        this.products = this.products.filter(item => item.id !== id);
      }
      )

  }

  addToCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        product.countInCart = this.count;
      });
  }

  updateCount(product: FavoriteType, count: number) {
    this.count = count;
    if (product.countInCart) {
      this.cartService.updateCart(product.id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }
          product.countInCart = this.count;
        });
    }
  }

}
