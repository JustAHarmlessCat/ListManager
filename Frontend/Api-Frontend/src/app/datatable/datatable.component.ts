import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GetContentService } from '../get-content.service';
import { SaveListService } from '../save-list.service';
import { Subscription, of } from 'rxjs';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { routes } from '../app.routes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [
    DataTablesModule,
    MatTableModule,
    CommonModule,
    MatIcon,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css'],
})
export class DatatableComponent implements OnInit, OnDestroy {
  @Input() chosenList: string | undefined;
  AddTextFieldVisible = false;
  content: string = '';
  currentListData: any[] = [];
  ListDataLength: number[] = [];
  validList: boolean = true;
  private subscription: Subscription = new Subscription();
  dataSource: MatTableDataSource<{ id: number; name: any }> =
    new MatTableDataSource();
  currentAction = 'Add';
  displayedColumns = ['id', 'name', 'actions'];
  EXAMPLE_DATA: { id: number; name: any }[] | undefined;
  currentlyEditing: number = 0;
  deleteConfirmation: boolean = false;
  elementToDelete: any;
  saved: boolean = true;
  form: HTMLFormElement = document.querySelector('#inputfield')!;
  constructor(
    private getContentService: GetContentService,
    private SaveListService: SaveListService,
    private router: Router,
    private _liveAnnouncer: LiveAnnouncer,
    private cookieService: CookieService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  @ViewChild(MatSort) sort: MatSort = <MatSort>{};
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydownHandler(event: KeyboardEvent) {
    this.closePopup();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKeydownHandler(event: KeyboardEvent) {
    if (this.AddTextFieldVisible) {
      if (this.currentAction === 'Add') {
        this.newItem(this.content);
        this.AddTextFieldVisible = false;
      }
    }
  }

  private handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!this.saved) {
      const confirmationMessage = 'It looks like you have been editing something. If you leave before saving, your changes will be lost.';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
    return null;
  };

  reloaddataSource() {
    this.dataSource.data = this.EXAMPLE_DATA || [];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getArray();
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  ngOnChanges() {
    this.getArray();
  }

  ngAfterViewInit() {
    this.reloaddataSource();
    this.dataSource.paginator = this.paginator;
  }

  showAddTextField() {
    this.AddTextFieldVisible = !this.AddTextFieldVisible;
  }

  newItem(text: string) {
    this.saved = false;
    if (text) {
      this.ListDataLength = [];
      this.currentListData.push(text);
      this.AddTextFieldVisible = false;
      for (let i = 0; i < this.currentListData.length; i++) {
        this.ListDataLength.push(i + 1);
      }
      this.EXAMPLE_DATA = this.currentListData.map((name, index) => ({
        id: index + 1,
        name,
      }));
      this.reloaddataSource();
    } else {
      this.AddTextFieldVisible = false;
    }
  }

  getArray(): any {
    const username = this.cookieService.get('user');
    if (!this.chosenList) {
      this.validList = false;
      return of(null).subscribe();
    }
    this.validList = true;
    this.ListDataLength = [];
    this.subscription.add(
      this.getContentService.getContent(this.chosenList, username).subscribe({
        next: (data: any[]) => {
          this.currentListData = data;
          for (let i = 0; i < this.currentListData.length; i++) {
            this.ListDataLength.push(i + 1);
          }
          this.EXAMPLE_DATA = this.currentListData.map((name, index) => ({
            id: index + 1,
            name,
          }));
          this.reloaddataSource();
        },
        error: (err: any) => {
          console.error('Error fetching data:', err);
        },
      })
    );
  }

  saveData() {
    this.saved = true;
    const username = this.cookieService.get('user');
    this.SaveListService.saveArray(
      this.chosenList || '',
      this.currentListData,
      username
    ).subscribe({
      next: (data) => {
        console.log('Data saved: ', data);
        this.getArray();
      },
    });
  }

  finaleditItem(content: string) {
    this.saved = false;
    this.showAddTextField();
    if (this.content) {
      this.currentListData[this.currentlyEditing] = this.content;
      this.EXAMPLE_DATA = this.currentListData.map((name, index) => ({
        id: index + 1,
        name,
      }));
      this.reloaddataSource();
    } else {
      this.deleteItem(this.currentlyEditing);
    }
  }

  editItem(id: number) {
    this.currentAction = 'Edit';
    this.showAddTextField();
    this.currentlyEditing = id;
  }

  deleteItem(id: number) {
    this.currentListData.splice(id, 1);
    this.EXAMPLE_DATA = this.currentListData.map((name, index) => ({
      id: index + 1,
      name,
    }));
    this.reloaddataSource();
  }

  closePopup() {
    this.AddTextFieldVisible = false;
    this.form.reset();
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    this.subscription.unsubscribe();
  }
}
