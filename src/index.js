import React from "react";
import ReactDOM from 'react-dom'
import moment from "moment";
import Event from "./event";
import { RRule, RRuleSet } from 'rrule';
import "./index.css";
import PropTypes from 'prop-types';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      today: moment(),
      current: moment().startOf('month'), //current position on calendar (first day of month)
      events: [],
      calendarId: this.props.calendarId,
      apiKey: this.props.apiKey,
    };
    this.lastMonth = this.lastMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
  }

  //init and load google calendar api
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    document.body.appendChild(script);
    script.onload = () => {
      gapi.load("client", () => {
        gapi.client.init({ apiKey: this.props.apiKey })
          .then(() => {
            this.loadCalendarAPI();
          });
      });
    };
  }

  //add in events after rendering
  componentDidUpdate() {
    this.clearEvents();
    this.renderEvents();
  }

  loadCalendarAPI() {
    gapi.client
      .load(
        "https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"
      )
      .then(
        () => {
          console.log("GAPI client loaded for API");
          this.getEventsList();
        },
        (err) => {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }

  //stores events from google calendar into state
  getEventsList() {
    gapi.client.calendar.events.list({
      calendarId: this.props.calendarId,
      maxResults: 1000,
    })
      .then(
        (response) => {
          // Handle the results here (response.result has the parsed body).
          console.log("Response", response.result.items);
          let events = [];
          let cancelled = [];
          let cancelled_count = 0;

          response.result.items.forEach((event) => {
            if (event.status == "confirmed") {
              events.push({
                "id": event.id,
                "name": event.summary,
                "start_time": moment(event.start.dateTime || event.start.date), //read date if datetime doesn't exist
                "end_time": moment(event.end.dateTime || event.end.date),
                "description": event.description,
                "location": event.location,
                "recurrence": event.recurrence,
                "cancelled_events": [],
              });
            } else if (event.status == "cancelled") {
              cancelled.push({
                recurringEventId: event.recurringEventId,
                originalStartTime: moment(event.originalStartTime.dateTime || event.originalStartTime.date), 
              });
            } else {
              console.log(event.status, event);
            }
          });

          events.forEach((event, idx, arr) => {
            if (event.recurrence) {
              cancelled.filter(cancel => cancel.recurringEventId == event.id).forEach((cancel) => {
                arr[idx].cancelled_events.push(cancel.originalStartTime);
                cancelled_count++;
              });
            }
          });
          console.log(cancelled_count, cancelled.length);
          this.setState({ events: events});
        },
        (err) => {
          console.error("Execute error", err);
        }
      );
  }

  lastMonth() {
    this.setState({ current: this.state.current.subtract(1, 'months') });
  }

  nextMonth() {
    this.setState({ current: this.state.current.add(1, 'months') });
  }

  clearEvents() {
    for (let i = 1; i <= this.state.current.daysInMonth(); i++) {
      const myNode = document.getElementById("day-" + i);
      while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild);
      }
    }
  }
  

  renderDays() {
    return this.state.days.map((x, i) => <div className="day-name" key={"day-of-week-" + i}>{x}</div>);
  }

  renderDates() {
    var days = [...Array(this.state.current.daysInMonth() + 1).keys()].slice(1); // create array from 1 to number of days in month

    var day_of_week = this.state.current.day(); //get day of week of first day in the month

    var pad_days = (((-this.state.current.daysInMonth() - this.state.current.day()) % 7) + 7) % 7; //number of days to fill out the last row    


    return [
      [...Array(day_of_week)].map((x, i) => (<div className="day" key={"empty-day-" + i}></div>)),
      days.map((x) => (<div className="day" key={"day-" + x}>{x}<div className="innerDay" id={"day-" + x}></div></div>)),
      [...Array(pad_days)].map((x, i) => (<div className="day" key={"empty-day-2-" + i}></div>))
    ];
  }

  renderEvents() {
    console.log(this.state.events);
    this.state.events.forEach((event) => {
      if (event.recurrence) {
        let duration = moment.duration(event.end_time.diff(event.start_time));
        let rule = RRule.fromString('DTSTART:' + moment.utc(event.start_time).format("YYYYMMDDTHHmmss") + "Z\n" + event.recurrence[0]);
        let rruleSet = new RRuleSet();
        rruleSet.rrule(rule);
        let dates = rruleSet.between(this.state.current.toDate(), moment(this.state.current).add(1, "month").toDate()); //get occurences this month
        
        //render recurrences
        dates.forEach((date) => {
          //check if it is in cancelled
          if (event.cancelled_events.some((cancelled_moment) => (cancelled_moment.isSame(date, 'day')))) {
            return;
          }

          let event_start = moment(date);
          let event_end = moment(event_start).add(duration);
          let props = {
            name: event.name,
            start_time: event_start,
            end_time: event_end,
            description: event.description,
            location: event.location,
          };

          let temp_node = document.createElement('div');
          document.getElementById("day-" + event_start.date()).appendChild(temp_node);
          ReactDOM.render(<Event {...props}></Event>, temp_node);
        });
      } else {
        //render event
        if (event.start_time.month() != this.state.current.month() || event.start_time.year() != this.state.current.year()) {
          return;
        }
        let node = document.createElement('div');
        document.getElementById("day-" + event.start_time.date()).appendChild(node);
        ReactDOM.render(<Event {...event}></Event>, node);
      }
    });
  }

  render() {
    return (
      <div className="calendar">
        <div className="calendar-header">
          <div
            className="calendar-navigate unselectable"
            onClick={this.lastMonth}
          >
            &#10094;
          </div>
          <div>
            <h2>
              {this.state.monthNames[this.state.current.month()]}{" "}
              {this.state.current.year()}
            </h2>
          </div>
          <div
            className="calendar-navigate unselectable"
            onClick={this.nextMonth}
          >
            &#10095;
          </div>
        </div>
        <div className="calendar-body">
          {this.renderDays()}
          {this.renderDates()}
        </div>
      </div>
    );
  }
}

Calendar.propTypes = {
  calendarId: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,
}