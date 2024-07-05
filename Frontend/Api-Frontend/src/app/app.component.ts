import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import axios from 'axios';
import { DatatableComponent } from './datatable/datatable.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UserComponent } from './user/user.component';
import { CookieService } from 'ngx-cookie-service';
import { NewListComponent } from './new-list/new-list.component';
import { HttpClient } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    DatatableComponent,
    UserComponent,
    NewListComponent,
    MatExpansionModule,
    MatListModule,
    MatToolbarModule
  ],
})
export class AppComponent {
  constructor(
    private router: Router,
    private location: Location,
    private cookieService: CookieService,
    private httpClient: HttpClient
  ) {
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }
  chosenList: any;
  apiCallData: any;
  lists: any;
  currentList: any = 'List';
  listInput: any;
  display = false;
  currentListTitle = 'new List';
  currentListData = [];

  ngOnInit() {
    const username = this.cookieService.get('user');
    if (username) {
      this.refresh();
    }
  }

  deleteList(chosenList: string) {
    const username = this.cookieService.get('user');
    if (username) {
      this.httpClient
        .delete('http://localhost:8080/deletelist', {
          body: {
            chosenList: chosenList,
            user: username,
          },
        })
        .subscribe((response: any) => {
          this.refresh();
        });
    }
  }

  refresh() {
    const username = this.cookieService.get('user');
    if (username) {
      this.httpClient
        .post('http://localhost:8080/lists', { user: username })
        .subscribe(
          (response: any) => {
            this.lists = response;
            for (let i = 0; i < this.lists.length; i++) {
              this.lists[i] = this.lists[i].replace('.json', '');
            }
          },
          (error: any) => {
            console.error('There was an error!', error);
          }
        );
    }
  }
  showDataTable() {
    this.display = false;
    this.display = true;
  }
}
