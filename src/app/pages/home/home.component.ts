import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics: Country[] = [];
  private unsubscribe$ = new Subject<void>();

  // Pie chart data
  pieChartData: { name: string, value: number}[] = [];

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Retrieves Olympic data and initializes the component.
   */
  ngOnInit(): void {
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Country[] | null) => {
        if (data) {
          this.olympics = data;
          this.pieChartData = this.olympicService.processPieChartData(data);
        }
      });
  }

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Cleans up subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getTotalParticipations(): number {
    // Initialize a Set to store unique participation IDs
    const uniqueParticipationIds = new Set<number>();
  
    // Iterate through each country
    this.olympics.forEach((country) => {
      // Iterate through each participation of the country
      country.participations.forEach((participation) => {
        // Add the participation ID to the Set
        uniqueParticipationIds.add(participation.id);
      });
    });
  
    // Return the size of the Set, which represents the count of unique participations
    return uniqueParticipationIds.size;
  }

  /**
   * Handles click events on pie chart slices.
   * Navigates to the detail page for the selected country.
   * @param event The event object containing information about the clicked slice.
   */
  onSliceClick(event: { name: string }): void {
    if (event) {
      const selectedCountry = event.name;
      this.router.navigate(['/detail', selectedCountry]);
    }
  }
}


