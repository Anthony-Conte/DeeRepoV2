import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Item } from '@org/models';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'dee-list';
  private readonly httpService = inject(HttpClient);
  public items = [] as Item[];
  public ngOnInit(): void {
    this.httpService.get<Item[]>('http://localhost:3000/api/items').subscribe({
      next: (data) => {
        this.items = data;
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    });
  }
}
