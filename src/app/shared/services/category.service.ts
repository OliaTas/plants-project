import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryWithTypeType } from 'src/types/category-with-type.type';
import { CategoryType } from 'src/types/category.type';
import { TypeType } from 'src/types/type.type';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(environment.api + 'categories');
  }

  getCategoriesWithTypes(): Observable<CategoryWithTypeType[]> {
    return this.http.get<TypeType[]>(environment.api + 'types')
      .pipe(
        map((items: TypeType[]) => {
          const array: CategoryWithTypeType[] = [];

          items.forEach((item: TypeType) => {

            const foundItem = array.find(arrayItem => arrayItem.url === item.category.url);

            if (foundItem) {
              foundItem.types.push({
                id: item.id,
                name: item.name,
                url: item.url,
              })
            } else {
              array.push({
                id: item.category.id,
                name: item.category.name,
                url: item.category.url,
                types: [{
                  id: item.id,
                  name: item.name,
                  url: item.url,
                }]
              })
            }
          });

          return array;
        })
      );
  }
}
