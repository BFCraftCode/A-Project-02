import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics$: Observable<Country[] | null> = of(null);
  private unsubscribe$ = new Subject<void>();

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics().pipe(
      takeUntil(this.unsubscribe$)
    );
    this.olympics$.subscribe(data => {
      if (data) {
        this.createPieChart(data);
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createPieChart(data: Country[]): void {
    const countryLabels = data.map(country => country.country);
    const medalCounts = data.map(country =>
      country.participations.reduce((acc, participation) => acc + participation.medalsCount, 0)
    );

    // Chart.js data
    this.pieChartData = medalCounts;
    this.pieChartLabels = countryLabels;
  }

  // Define pie chart data properties here
  pieChartData: number[] = [];
  pieChartLabels: string[] = [];
}



