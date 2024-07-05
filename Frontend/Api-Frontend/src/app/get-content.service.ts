import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GetContentService {
  private baseURL = 'http://localhost:8080/getlist';
  temp: any = '';
  array: any = [];
  #httpClient = inject(HttpClient);

  getContent(chosenList: string, username: string): Observable<any> {
    return this.#httpClient
      .post<any>(this.baseURL, { chosenList: chosenList, user: username })
      .pipe(
        map((response) => {
          this.temp = JSON.stringify(response);
          this.array = this.temp.split(', ');
          return this.array.map((item: string) =>
            item.replace(/\\/g, '').replace(/"/g, '').replace(/\[|\]/g, '')
          );
        })
      );
  }
}
