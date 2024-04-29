import { Participation } from './Olympic';
export interface Country {
    id: number;
    country: string;
    participations: Participation[];
  }
