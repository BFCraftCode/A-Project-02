import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Country } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Country[] | null>(null);
  public olympics: Country[] = [];

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Country[] | null> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error) => {
        console.error(error);
        this.olympics$.next(null);
        return [];
      })
    );
  }
  
  processPieChartData(olympics: Country[]): { name: string, value: number }[] {
    const aggregatedData = this.aggregateMedalsData(olympics);
    return aggregatedData.map(countryData => ({
      name: countryData.country,
      value: countryData.totalMedals
    }));
  }

  getOlympics(): Observable<Country[] | null> {
    return this.olympics$.asObservable();
  }
  
  aggregateMedalsData(olympics: Country[]): { country: string, totalMedals: number }[] {
    const aggregatedData: { [key: string]: number } = {};
  
    // Aggregate total medals for each country
    olympics.forEach((country) => {
      country.participations.forEach((participation) => {
        aggregatedData[country.country] = (aggregatedData[country.country] || 0) + participation.medalsCount;
      });
    });
  
    // Convert aggregated data into an array of objects
    return Object.entries(aggregatedData).map(([country, totalMedals]) => ({ country, totalMedals }));
  }
  
  processLineChartData(countryData: Country): { name: string, series: { name: string, value: number }[] }[] {
    if (!countryData || !countryData.participations) {
      return [];
    }

    return [{
      name: countryData.country,
      series: countryData.participations.map(participation => ({
        name: participation.year.toString(),
        value: participation.medalsCount
      }))
    }];
  }
}

