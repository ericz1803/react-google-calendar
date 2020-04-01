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
      borderColor: this.props.borderColor,
      textColor: this.props.textColor,
      backgroundColor: this.props.backgroundColor,
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
          let changed = [];
          let cancelled = [];

          response.result.items.forEach((event) => {
            if (event.originalStartTime) { //cancelled/changed events
              if (event.status == "cancelled") {
                cancelled.push({
                  recurringEventId: event.recurringEventId,
                  originalStartTime: moment(event.originalStartTime.dateTime || event.originalStartTime.date), 
                });
              } else if (event.status == "confirmed") {
                changed.push({
                  recurringEventId: event.recurringEventId,
                  name: event.summary,
                  description: event.description,
                  location: event.location,
                  originalStartTime: moment(event.originalStartTime.dateTime || event.originalStartTime.date),
                  newStartTime: moment(event.start.dateTime || event.start.date),
                  newEndTime: moment(event.end.dateTime || event.end.date),
                });
              } else {
                console.log("Not categorized: ", event);
              }
            } else if (event.status == "confirmed") {
              events.push({
                id: event.id,
                name: event.summary,
                start_time: moment(event.start.dateTime || event.start.date), //read date if datetime doesn't exist
                end_time: moment(event.end.dateTime || event.end.date),
                description: event.description,
                location: event.location,
                recurrence: event.recurrence,
                changed_events: [],
                cancelled_events: [],
              });
            } else {
              console.log("Not categorized: ", event);
            }
          });

          console.log(changed);
          events.forEach((event, idx, arr) => {
            if (event.recurrence) {
              //push changed events
              changed.filter(change => change.recurringEventId == event.id).forEach((change) => {
                arr[idx].changed_events.push(change);
              });

              //push cancelled events
              cancelled.filter(cancel => cancel.recurringEventId == event.id).forEach((cancel) => {
                arr[idx].cancelled_events.push(cancel.originalStartTime);
              });
            }
          });
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
    return this.state.days.map((x, i) => (
      <div
        className="day-name"
        key={"day-of-week-" + i}
        style={{ borderColor: this.props.borderColor }}
      >
        {x}
      </div>
    ));
  }

  renderDates() {
    var days = [...Array(this.state.current.daysInMonth() + 1).keys()].slice(1); // create array from 1 to number of days in month

    var day_of_week = this.state.current.day(); //get day of week of first day in the month

    var pad_days = (((-this.state.current.daysInMonth() - this.state.current.day()) % 7) + 7) % 7; //number of days to fill out the last row    


    return [
      [...Array(day_of_week)].map((x, i) => (
        <div
          className="day"
          key={"empty-day-" + i}
          style={{ borderColor: this.props.borderColor }}
        ></div>
      )),
      days.map(x => (
        <div
          className="day"
          key={"day-" + x}
          style={{ borderColor: this.props.borderColor }}
        >
          {x}
          <div className="innerDay" id={"day-" + x}></div>
        </div>
      )),
      [...Array(pad_days)].map((x, i) => (
        <div
          className="day"
          key={"empty-day-2-" + i}
          style={{ borderColor: this.props.borderColor }}
        ></div>
      ))
    ];
  }

  renderEvents() {
    console.log(this.state.events);
    this.state.events.forEach((event) => {
      if (event.recurrence) {
        let duration = moment.duration(event.end_time.diff(event.start_time));
        let rule = RRule.fromString('DTSTART:' + moment(event.start_time).format("YYYYMMDDTHHmmss") + "Z\n" + event.recurrence[0]);
        let rruleSet = new RRuleSet();
        rruleSet.rrule(rule);
        let dates = rruleSet.between(this.state.current.toDate(), moment(this.state.current).add(1, "month").toDate()); //get occurences this month
        
        //render recurrences
        dates.forEach((date) => {
          //check if it is in cancelled
          if (event.cancelled_events.some((cancelled_moment) => (cancelled_moment.isSame(date, 'day')))) {
            return;
          }

          

          //if event has changed
          const changed_event = event.changed_events.find((changed_event) => (changed_event.originalStartTime.isSame(date, 'day')));
          if (changed_event) {
            var props = {
              name: changed_event.name,
              start_time: changed_event.newStartTime,
              end_time: changed_event.newEndTime,
              description: changed_event.description,
              location: changed_event.location,
            }
          } else {
            let event_start = moment.utc(date); //avoid bad timezone conversions
            let event_end = moment(event_start).add(duration);
            var props = {
              name: event.name,
              start_time: event_start,
              end_time: event_end,
              description: event.description,
              location: event.location,
            };
          }
          

          let temp_node = document.createElement('div');
          document.getElementById("day-" + props.start_time.date()).appendChild(temp_node);
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
      <div
        className="calendar"
        style={{
          borderColor: this.props.borderColor,
          color: this.props.textColor,
          backgorund: this.props.backgroundColor,
        }}
      >
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

Calendar.defaultProps = {
  textColor: "#51565d", // #51565d
  borderColor: "rgba(166, 168, 179, 0.12)", // rgba(166, 168, 179, 0.12)
  circleColor: "#4786ff",
  color: "#4786ff",
  backgroundColor: "default",
}