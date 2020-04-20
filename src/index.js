import React from "react";
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import moment from "moment-timezone";
import { RRule, RRuleSet } from 'rrule';

import "./index.css";

import Event from "./event";

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
      calendarTimezone: "",
      useCalendarTimezone: this.props.useCalendarTimezone,
      calendarId: this.props.calendarId,
      apiKey: this.props.apiKey,
      
      //calendar colors
      borderColor: this.props.borderColor,
      textColor: this.props.textColor,
      backgroundColor: this.props.backgroundColor,
      todayTextColor: this.props.todayTextColor,
      todayBackgroundColor: this.props.todayBackgroundColor,

      //event colors
      eventBorderColor: this.props.eventBorderColor,
      eventHoverColor: this.props.eventHoverColor,
      eventTextColor: this.props.eventTextColor,
      eventCircleColor: this.props.eventCircleColor,
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
          let events = [];
          let changed = [];
          let cancelled = [];
          let calendarTimezone = "";

          response.result.items.forEach((event) => {
            
            if (event.originalStartTime) { //cancelled/changed events
              if ((!calendarTimezone) && event.originalStartTime.timeZone && this.state.useCalendarTimezone) {
                calendarTimezone = event.originalStartTime.timeZone;
              }
              if (event.status == "cancelled") {
                cancelled.push({
                  recurringEventId: event.recurringEventId,
                  originalStartTime: this.state.useCalendarTimezone ? moment.parseZone(event.originalStartTime.dateTime || event.originalStartTime.date) : moment(event.originalStartTime.dateTime || event.originalStartTime.date), 
                });
              } else if (event.status == "confirmed") {
                changed.push({
                  recurringEventId: event.recurringEventId,
                  name: event.summary,
                  description: event.description,
                  location: event.location,
                  originalStartTime: this.state.useCalendarTimezone ? moment.parseZone(event.originalStartTime.dateTime || event.originalStartTime.date) : moment(event.originalStartTime.dateTime || event.originalStartTime.date),
                  newStartTime: this.state.useCalendarTimezone ? moment.parseZone(event.start.dateTime || event.start.date) : moment(event.start.dateTime || event.start.date),
                  newEndTime: this.state.useCalendarTimezone ? moment.parseZone(event.end.dateTime || event.end.date) : moment(event.end.dateTime || event.end.date),
                });
              } else {
                console.log("Not categorized: ", event);
              }
            } else if (event.status == "confirmed") {
              if ((!calendarTimezone) && event.start.timeZone && this.state.useCalendarTimezone) {
                calendarTimezone = event.start.timeZone;
              }
              events.push({
                id: event.id,
                name: event.summary,
                startTime: this.state.useCalendarTimezone ? moment.parseZone(event.start.dateTime || event.start.date) : moment(event.start.dateTime || event.start.date), //read date if datetime doesn't exist
                endTime: this.state.useCalendarTimezone ? moment.parseZone(event.end.dateTime || event.end.date) : moment(event.end.dateTime || event.end.date),
                description: event.description,
                location: event.location,
                recurrence: event.recurrence,
                changedEvents: [],
                cancelledEvents: [],
              });
            } else {
              console.log("Not categorized: ", event);
            }
          });

          events.forEach((event, idx, arr) => {
            if (event.recurrence) {
              //push changed events
              changed.filter(change => change.recurringEventId == event.id).forEach((change) => {
                arr[idx].changedEvents.push(change);
              });

              //push cancelled events
              cancelled.filter(cancel => cancel.recurringEventId == event.id).forEach((cancel) => {
                arr[idx].cancelledEvents.push(cancel.originalStartTime);
              });
            }
          });
          if (this.state.useCalendarTimezone) {
            this.setState({calendarTimezone: calendarTimezone});
          } else {
            this.setState({calendarTimezone: moment.tz.guess()});
          }
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

    var dayOfWeek = this.state.current.day(); //get day of week of first day in the month

    var padDays = (((-this.state.current.daysInMonth() - this.state.current.day()) % 7) + 7) % 7; //number of days to fill out the last row    


    return [
      [...Array(dayOfWeek)].map((x, i) => (
        <div
          className="day"
          key={"empty-day-" + i}
          style={{ borderColor: this.props.borderColor }}
        ></div>
      )),
      days.map(x => {
        if (x == this.state.today.date() && this.state.current.isSame(this.state.today, 'month')) {
          return (
            <div
              className="day"
              key={"day-" + x}
              style={{ 
                borderColor: this.props.borderColor,
                color: this.state.todayTextColor,
                background: this.state.todayBackgroundColor,
              }}
            >
              {x}
              <div className="innerDay" id={"day-" + x}></div>
            </div>
          );
        } else {
          return (
            <div
              className="day"
              key={"day-" + x}
              style={{ borderColor: this.props.borderColor }}
            >
              {x}
              <div className="innerDay" id={"day-" + x}></div>
            </div>
          );
        }
      }),
      [...Array(padDays)].map((x, i) => (
        <div
          className="day"
          key={"empty-day-2-" + i}
          style={{ borderColor: this.props.borderColor }}
        ></div>
      ))
    ];
  }

  renderEvents() {
    let eventProps = {
      borderColor: this.state.eventBorderColor,
      hoverColor: this.state.eventHoverColor,
      textColor: this.state.eventTextColor,
      circleColor: this.state.eventCircleColor,
    }

    this.state.events.forEach((event) => {
      if (event.recurrence) {
        let duration = moment.duration(event.endTime.diff(event.startTime));
        let rule = RRule.fromString('DTSTART:' + moment(event.startTime).format("YYYYMMDDTHHmmss") + "Z\n" + event.recurrence[0]);
        let rruleSet = new RRuleSet();
        rruleSet.rrule(rule);
        let dates = rruleSet.between(this.state.current.toDate(), moment(this.state.current).add(1, "month").toDate()); //get occurences this month
        
        //render recurrences
        dates.forEach((date) => {
          //check if it is in cancelled
          if (event.cancelledEvents.some((cancelledMoment) => (cancelledMoment.isSame(date, 'day')))) {
            return;
          }

          //if event has changed
          const changedEvent = event.changedEvents.find((changedEvent) => (changedEvent.originalStartTime.isSame(date, 'day')));
          if (changedEvent) {
            var props = {
              name: changedEvent.name,
              startTime: changedEvent.newStartTime,
              endTime: changedEvent.newEndTime,
              description: changedEvent.description,
              location: changedEvent.location,
            }
          } else {
            let eventStart = moment.utc(date); //avoid bad timezone conversions
            let eventEnd = moment(eventStart).add(duration);
            var props = {
              name: event.name,
              startTime: eventStart,
              endTime: eventEnd,
              description: event.description,
              location: event.location,
            };
          }
          
          let tempNode = document.createElement('div');
          document.getElementById("day-" + moment(props.startTime).date()).appendChild(tempNode);
          ReactDOM.render(<Event {...props} {...eventProps}></Event>, tempNode);
        });
      } else {
        //render event
        if (event.startTime.month() != this.state.current.month() || event.startTime.year() != this.state.current.year()) {
          return;
        }
        let node = document.createElement('div');
        document.getElementById("day-" + moment(event.startTime).date()).appendChild(node);
        ReactDOM.render(<Event {...event} {...eventProps}></Event>, node);
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
          background: this.props.backgroundColor,
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
            <h2 className="calendar-title">
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
        <div className="calendar-footer">
          <div className="footer-text">
            All times shown in timezone: {this.state.calendarTimezone.replace("_", " ")}
          </div>
          <div className="footer-button">
            <a href={"https://calendar.google.com/calendar/r?cid=" + this.state.calendarId} target="_blank" id="add-to-calendar">
              <div className="logo-plus-button">
                <div className="logo-plus-button-plus-icon"></div>
                <div className="logo-plus-button-lockup">
                  <span className="logo-plus-button-lockup-text">Calendar</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
  

Calendar.propTypes = {
  calendarId: PropTypes.string.isRequired,
  apiKey: PropTypes.string.isRequired,

  useCalendarTimezone: PropTypes.bool,
  
  //calendar colors
  borderColor: PropTypes.string,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  todayTextColor: PropTypes.string,
  todayBackgroundColor: PropTypes.string,

  //event colors
  eventBorderColor: PropTypes.string,
  eventHoverColor: PropTypes.string,
  eventTextColor: PropTypes.string,
  eventCircleColor: PropTypes.string,
}

Calendar.defaultProps = {
  useCalendarTimezone: false,

  //calendar colors
  textColor: "#51565d",
  borderColor: "LightGray",
  
  //event colors
  eventBorderColor: "rgba(81, 86, 93, 0.1)",
  eventHoverColor: "rgba(81, 86, 93, 0.1)",
  eventTextColor: "#51565d",
  eventCircleColor: "#4786ff",
}