import { Component, HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NewListService } from '../new-list.service';

@Component({
  selector: 'app-new-list',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './new-list.component.html',
  styleUrl: './new-list.component.css',
})
export class NewListComponent {
  username = this.cookieService.get('user');

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydownHandler(event: KeyboardEvent) {
    this.hideNewList();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKeydownHandler(event: KeyboardEvent) {
    if (this.newListVisible) {
      this.newList();
    }
  }

  newListName = '';
  newListVisible = false;
  constructor(
    private cookieService: CookieService,
    private newListService: NewListService
  ) {}

  ngOnChange() {
    this.updateUsername();
    if (!this.newListVisible) {
      this.newListName = '';
    }
  }
  newList() {
    this.hideNewList();
    this.updateUsername();
    if (this.username) {
      if (this.newListName === '') {
        this.newListName = 'My List';
      }
      this.newListService
        .newList(this.newListName, this.username)
        .subscribe((response) => {
          response;
        });
    }
  }
  updateUsername() {
    this.username = this.cookieService.get('user');
  }
  hideNewList() {
    this.newListVisible = false;
  }
}
