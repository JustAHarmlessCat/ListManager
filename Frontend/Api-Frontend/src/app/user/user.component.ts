import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [CookieService],
})
export class UserComponent {
  success = false;
  username = '';
  currentUser = this.cookieService.get('user');
  constructor(private cookieService: CookieService) {}
  ngOnInit() {
    if (this.currentUser) {
      this.username = this.currentUser;
    } else {
      this.username = '';
    }
  }
  setUser(name: string) {
    this.cookieService.set('user', name);
  }
  logout() {
    this.cookieService.deleteAll();
  }
}
