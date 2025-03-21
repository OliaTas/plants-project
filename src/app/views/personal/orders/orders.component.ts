import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { OrdersStatusUtil } from 'src/app/shared/utils/orders-status.utils';
import { DefaultResponseType } from 'src/types/default-response.type';
import { OrderType } from 'src/types/order.type';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: OrderType[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders()
      .subscribe((data: OrderType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        this.orders = (data as OrderType[]).map(item => {
          const status = OrdersStatusUtil.getStatusAndColor(item.status);
          item.statusRus = status.name;
          item.color = status.color;

          return item;
        });
      })
  }

}
