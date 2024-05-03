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
  public olympics: Country[] = [];

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedCountry = params['country'];
      this.fetchDetailData();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fetchDetailData(): void {
    this.olympicService.getOlympics().subscribe((data: Country[] | null) => {
      if (data) {
        this.countryData = data.find(country => country.country === this.selectedCountry);
        this.processLineChartData();
      }
    });
  }

processLineChartData(): void {
  if (this.countryData) {
    this.lineChartData = [{
      name: this.selectedCountry,
      series: this.countryData.participations.map(participation => ({
        name: participation.year.toString(),
        value: participation.medalsCount
      }))
    }];
  }
}


joParticipations(): number {
  if (this.countryData) {
    return this.countryData.participations.length;
  }
  return 0; // Return 0 if countryData is undefined or null
}


Totalmedals(): number {
  let totalMedals = 0;
  if (this.countryData) {
    this.countryData.participations.forEach((participation) => {
      totalMedals += participation.medalsCount;
    });
  }
  return totalMedals;
}


numberAthletes(): number {
  let totalAthletes = 0;
  if (this.countryData) {
    this.countryData.participations.forEach((participation) => {
      totalAthletes += participation.athleteCount;
    });
  }
  return totalAthletes;
}

goBack(): void {
  // Navigate back to the previous page
  this.router.navigate(['/']); // Navigate to the home page, adjust the route as needed
}

}

