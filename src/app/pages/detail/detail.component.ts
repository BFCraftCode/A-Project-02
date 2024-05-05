import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  selectedCountry: string = '';
  countryData: Country | undefined;
  private subscription: Subscription | undefined;
  lineChartData: any[] = [];

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
    this.route.params.subscribe(params => {
      this.selectedCountry = params['country'];
      this.fetchDetailData();
    });
  }

  /**
   * Lifecycle hook that is called when a directive, pipe, or service is destroyed.
   * Unsubscribes from subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Fetches detail data for the selected country.
   */
  fetchDetailData(): void {
    this.olympicService.getOlympics().subscribe((data: Country[] | null) => {
      if (data) {
        this.countryData = data.find(country => country.country === this.selectedCountry);
        if (this.countryData) {
          this.lineChartData = this.olympicService.processLineChartData(this.countryData);
        } else {
          this.router.navigateByUrl('error');
        }
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
    if (this.countryData) {
      return this.countryData.participations.length;
    }
    return 0; // Return 0 if countryData is undefined or null
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
    this.router.navigate(['/']); // Navigate to the home page, adjust the route as needed
  }
}


