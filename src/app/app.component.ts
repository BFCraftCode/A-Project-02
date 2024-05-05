import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(private olympicService: OlympicService) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Loads initial data for the application using the OlympicService.
   */
  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
  }
}

