import { Moment } from 'moment-timezone';

export interface CalendarProps {
  language: string;
  apiKey: string;
  calendars: any[];
  styles: any;
  showArrow: boolean;
  showFooter: boolean;
}

export interface CalendarState {
  monthNames: string[];
  days: string[];
  today: Moment;
  current: Moment;
  calendars: any[];
  events: any[];
  singleEvents: any[];
  userTimezone: string;
  showArrow: boolean;
  showFooter: boolean;
  processedCalendars: string[];
}
