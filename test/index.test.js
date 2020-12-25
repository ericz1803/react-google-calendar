import Calendar from "../src/index";
import moment from "moment-timezone";

describe("Use rrule to get recurrences", () => {
  test("proper amount of events", () => {
    let recurrenceString = "RRULE:FREQ=WEEKLY;WKST=SU;COUNT=5;BYDAY=SU"
    let eventStart = moment.parseZone("2020-05-31 17:00");
    let betweenStart = moment.parseZone("2020-06-01");
    let betweenEnd = moment.parseZone("2020-07-01");
    let dates = Calendar.getDatesFromRRule(recurrenceString, eventStart, betweenStart, betweenEnd);
    expect(dates.length).toBe(4);
  });

  test("proper amount of events 2", () => {
    let recurrenceString = "RRULE:FREQ=WEEKLY;WKST=SU;COUNT=5;BYDAY=SU"
    let eventStart = moment.parseZone("2020-05-31");
    let betweenStart = moment.parseZone("2020-05-01");
    let betweenEnd = moment.parseZone("2020-06-01");
    let dates = Calendar.getDatesFromRRule(recurrenceString, eventStart, betweenStart, betweenEnd);
    expect(dates.length).toBe(1);
  });

  test("all day that ends exactly at the beginning of the next month", () => {
    let recurrenceString = "RRULE:FREQ=WEEKLY;BYDAY=TH"
    let eventStart = moment.parseZone("2020-05-29");
    let betweenStart = moment.parseZone("2020-07-01").subtract(1, "day");
    let betweenEnd = moment.parseZone("2020-08-01");
    let dates = Calendar.getDatesFromRRule(recurrenceString, eventStart, betweenStart, betweenEnd);
    expect(dates.length).toBe(5);
  });

  test("all day that ends exactly at the beginning of the next month 2", () => {
    let recurrenceString = "RRULE:FREQ=WEEKLY;BYDAY=TH"
    let eventStart = moment.parseZone("2020-05-31");
    let betweenStart = moment.parseZone("2020-08-01").subtract(1, "day");
    let betweenEnd = moment.parseZone("2020-09-01");
    let dates = Calendar.getDatesFromRRule(recurrenceString, eventStart, betweenStart, betweenEnd);
    expect(dates.length).toBe(4);
  });
});
