import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  /** Name of the selected country. */
  selectedCountry: string = '';

  /** Data of the selected country. */
  countryData: Country | undefined;

  /** Line chart data for displaying medal counts per participation. */
  lineChartData: any[] = [];

  /** Subject to manage subscriptions and unsubscribe from observables. */
  private unsubscribe$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   * Fetches detail data for the selected country.
   */
  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(params => {
        this.selectedCountry = params['country'];
        this.fetchDetailData();
      });
  }

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Unsubscribes from subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  /**
   * Fetches detail data for the selected country.
   */
  private fetchDetailData(): void {
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Country[] | null) => {
        if (data) {
          this.countryData = data.find(country => country.country === this.selectedCountry);
          if (!this.countryData) {
            this.router.navigateByUrl('error');
            return;
          }
          this.lineChartData = this.olympicService.processLineChartData(this.countryData);
        } else {
          this.router.navigateByUrl('error');
        }
      });
  }

  /**
   * Returns the number of participations for the selected country.
   * @returns The number of participations.
   */
  joParticipations(): number {
    return this.countryData ? this.countryData.participations.length : 0;
  }

  /**
   * Returns the total number of medals for the selected country.
   * @returns The total number of medals.
   */
  Totalmedals(): number {
    let totalMedals = 0;
    if (this.countryData) {
      this.countryData.participations.forEach((participation) => {
        totalMedals += participation.medalsCount;
      });
    }
    return totalMedals;
  }

  /**
   * Returns the total number of athletes for the selected country.
   * @returns The total number of athletes.
   */
  numberAthletes(): number {
    let totalAthletes = 0;
    if (this.countryData) {
      this.countryData.participations.forEach((participation) => {
        totalAthletes += participation.athleteCount;
      });
    }
    return totalAthletes;
  }

  /**
   * Navigates to the previous page.
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
