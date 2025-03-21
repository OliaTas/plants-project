import { Component, Input, OnInit } from '@angular/core';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import { CategoryType } from 'src/types/category.type';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() categories: CategoryWithTypeType[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
