import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SaveListService {
  private baseURL = 'http://localhost:8080/savelist';

  #httpClient = inject(HttpClient);

  saveArray(
    chosenList: string,
    content: any,
    username: string
  ): Observable<any> {
    return this.#httpClient.put(this.baseURL, {
      chosenList: chosenList,
      content: JSON.stringify(content),
      user: username
    });
  }
}
