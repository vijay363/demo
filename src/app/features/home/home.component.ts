import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  user?: any;
  articles: any[] = [];
  offset = 0;
  limit = 10;
  http = inject(HttpClient);

  ngOnInit(): void {
    this.loadArticles();
  }
  loadArticles() {
    const httpParams = new HttpParams({
      fromObject: {
        offset: this.offset,
        limit: this.limit,
      },
    });
    this.http
      .get('https://jsonplaceholder.typicode.com/posts', { params: httpParams })
      .subscribe((data: any) => {
        this.articles = data;
      });
  }
}
