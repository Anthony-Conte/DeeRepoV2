import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcome } from './nx-welcome';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@org/models';
import { Item } from '@org/models';

@Component({
  imports: [NxWelcome, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'dee-list';
  private readonly httpService = inject(HttpClient);

  public ngOnInit(): void {
    this.httpService
      .get<ApiResponse<Item[]>>('http://localhost:3000/api/items')
      .subscribe({
        next: (data) => {
          console.log('Data received:', data);
        },
        error: (error) => {
          console.error('Error occurred:', error);
        },
      });
  }
}
