import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewListService {
  private baseURL = 'http://localhost:8080/newlist';

  #httpClient = inject(HttpClient);

  newList(listName: string, user: string): Observable<any> {
    return this.#httpClient.post(this.baseURL, {
      listName: listName,
      user: user,
    });
  }
}
