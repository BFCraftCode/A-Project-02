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

  // Chart options
  view: [number, number] = [700, 400];


  // Pie chart data
  pieChartData: { name: string, value: number}[] = [];

  constructor(
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Country[] | null) => {
        if (data) {
          this.olympics = data;
          this.processData();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  processData(): void {
    const aggregatedData = this.aggregateMedalsData();
    this.pieChartData = aggregatedData.map(countryData => ({
      name: countryData.country,
      value: countryData.totalMedals
    }));
  }
  

  getTotalParticipations(): number {
    return this.olympics.reduce((total, country) => total + country.participations.length, 0);
  }


  aggregateMedalsData(): { country: string, totalMedals: number }[] {
    const aggregatedData: { [key: string]: number } = {};
    this.olympics.forEach((country) => {
      country.participations.forEach((participation) => {
        if (!aggregatedData[country.country]) {
          aggregatedData[country.country] = 0;
        }
        aggregatedData[country.country] += participation.medalsCount;
      });
    });
    return Object.entries(aggregatedData).map(([country, totalMedals]) => ({ country, totalMedals }));
  }

  onSliceClick(event: any): void {
    if (event) {
      const selectedCountry = event.name;
      this.router.navigate(['/detail', selectedCountry]);
    }
  }
}

