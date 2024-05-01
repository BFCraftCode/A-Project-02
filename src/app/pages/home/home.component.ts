import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/Olympic';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public olympics: Country[] = [];
  private unsubscribe$ = new Subject<void>();

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympicService.getOlympics()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: Country[] | null) => {
        if (data) {
          this.olympics = data;
          this.createPieChart();
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  createPieChart(): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    const medalsData = this.aggregateMedalsData();
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: medalsData.map((countryData) => countryData.country),
        datasets: [{
          label: 'Medals',
          data: medalsData.map((countryData) => countryData.totalMedals),
          backgroundColor: this.getRandomColors(medalsData.length),
        }],
      },
      options: {
        responsive: true, // Makes the chart responsive to container size
        maintainAspectRatio: false, // Allows the chart to be resized freely
      },
    });
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

  getRandomColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return colors;
  }
}