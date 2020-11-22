/** @jsx jsx */

import React from "react";
import ReactDOM from "react-dom"
import PropTypes from "prop-types";

import moment from "moment-timezone";
import { RRule, RRuleSet } from "rrule";

import "./index.css";

import Event from "./event";
import MultiEvent from "./multiEvent";

import { isMultiEvent } from "./utils/helper";
import { loadCalendarAPI, getEventsList } from "./utils/googleCalendarAPI";

import { css, jsx } from '@emotion/react'

import _ from "lodash";

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
      current: moment().startOf("month").utc(true), //current position on calendar (first day of month)
      events: [],//all day or multi day events
      singleEvents: [], //single day events
      calendarTimezone: "",
    };
    
    this.lastMonth = this.lastMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
  }

  async componentDidMount() {
    //init and load google calendar api
    try {
      const res = await loadCalendarAPI(this.props.apiKey);
      console.log(res);
    } catch(err) {
      console.error("Error loading GAPI client for API", err);
    }

    //Get events
    try {
      //query api for events
      const res = await getEventsList(this.props.calendarId);

      //process events
      const events = Calendar.processEvents(res.result.items);
      
      //get timezone
      const timezone = res.result.timeZone;

      //set state with calculated values
      this.setState({"calendarTimezone": timezone, "events": events[0], "singleEvents": events[1]});

    } catch(err) {
      console.error("Error getting events", err);
    }
  }

  //add in events after rendering calendar
  componentDidUpdate() {
    this.clearEvents();
    this.renderEvents();
  }

  //get easy to work with events and singleEvents from response
  static processEvents(items) {
    let singleEvents = [];
    let events = [];
    let changed = [];
    let cancelled = [];

    items.forEach((event) => {
      if (event.originalStartTime) { //cancelled events
        if (event.status == "cancelled") {
          cancelled.push({
            recurringEventId: event.recurringEventId,
            originalStartTime: moment.parseZone(event.originalStartTime.dateTime || event.originalStartTime.date), 
          });
        } else if (event.status == "confirmed") { //changed events
          changed.push({
            recurringEventId: event.recurringEventId,
            name: event.summary,
            description: event.description,
            location: event.location,
            originalStartTime: moment.parseZone(event.originalStartTime.dateTime || event.originalStartTime.date),
            newStartTime: moment.parseZone(event.start.dateTime || event.start.date),
            newEndTime: moment.parseZone(event.end.dateTime || event.end.date),
          });
        } else {
          console.log("Not categorized: ", event);
        }
      } else if (event.status == "confirmed") { //normal events
        let newEvent = {
          id: event.id,
          name: event.summary,
          startTime: moment.parseZone(event.start.dateTime || event.start.date), //read date if datetime doesn"t exist
          endTime: moment.parseZone(event.end.dateTime || event.end.date),
          description: event.description,
          location: event.location,
          recurrence: event.recurrence,
          changedEvents: [],
          cancelledEvents: [],
        };

        if (isMultiEvent(newEvent.startTime, newEvent.endTime)) {
          events.push(newEvent);
        } else {
          singleEvents.push(newEvent);
        }
      } else {
        console.log("Not categorized: ", newEvent);
      }
    });

    //add changed events and cancelled events to corresponding event object
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

    singleEvents.forEach((event, idx, arr) => {
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

    return [events, singleEvents];
  }

  //sets current month to previous month
  lastMonth() {
    this.setState({ current: this.state.current.subtract(1, "months") });
  }

  //sets current month to following month
  nextMonth() {
    this.setState({ current: this.state.current.add(1, "months") });
  }

  clearEvents() {
    for (let i = 1; i <= this.state.current.daysInMonth(); i++) {
      const node = document.getElementById("day-" + i);
      while (node.lastElementChild) {
        node.removeChild(node.lastElementChild);
      }
    }
  }
  
  //renders the day of week names
  renderDays() {
    return this.state.days.map((x, i) => (
      <div
        className="day-name"
        key={"day-of-week-" + i}
        css={[{ borderColor: "LightGray" }, _.get(this.props.styles, 'day', {})]}
      >
        {x}
      </div>
    ));
  }

  //renders the blocks for the days of each month
  renderDates() {
    var days = [...Array(this.state.current.daysInMonth() + 1).keys()].slice(1); // create array from 1 to number of days in month

    var dayOfWeek = this.state.current.day(); //get day of week of first day in the month

    var padDays = (((-this.state.current.daysInMonth() - this.state.current.day()) % 7) + 7) % 7; //number of days to fill out the last row    

    return [
      [...Array(dayOfWeek)].map((x, i) => (
        <div
          className="day"
          key={"empty-day-" + i}
          css={_.get(this.props.styles, 'day', {})}
        ></div>
      )),
      days.map(x => {
        if (x == this.state.today.date() && this.state.current.isSame(this.state.today, "month")) {
          return (
            <div
              className="day"
              key={"day-" + x}
              css={[_.get(this.props.styles, 'day', {}), _.get(this.props.styles, 'today', {})]}
            >
              <span
                css={{
                  paddingRight: '6px',
                }}
              >
                {x}
              </span>
              <div className="innerDay" id={"day-" + x}></div>
            </div>
          );
        } else {
          return (
            <div
              className="day"
              key={"day-" + x}
              css={_.get(this.props.styles, 'day', {})}
            >
              <span
                css={{
                  paddingRight: '6px',
                }}
              >
                {x}
              </span>
              <div className="innerDay" id={"day-" + x}></div>
            </div>
          );
        }
      }),
      [...Array(padDays)].map((x, i) => (
        <div
          className="day"
          key={"empty-day-2-" + i}
          css={_.get(this.props.styles, 'day', {})}
        ></div>
      ))
    ];
  }

  //TODO: refactor
  //decides how to render events
  drawMultiEvent(props) { 
    let startDrawDate;
    let blockLength = 1;
    let curDate;
    let endDate;

    let arrowLeft = false;
    let arrowRight = false;

    if (props.endTime.isSame(moment(props.endTime).startOf("day"), "second")) {
      endDate = moment(props.endTime).utc(true).subtract(1, "day");
    } else {
      endDate = moment(props.endTime).utc(true);
    }

    if (moment(props.startTime).utc(true).isBefore(this.state.current)) {
      if (this.props.showArrow) {
        arrowLeft = true;
      }
      
      startDrawDate = 1;
      curDate = moment(this.state.current).utc(true);
    } else {
      startDrawDate = props.startTime.date();
      curDate = moment(props.startTime).utc(true);
    }


    while (curDate.isSameOrBefore(endDate, "day")) {
      if (curDate.date() == this.state.current.daysInMonth() && !endDate.isSame(this.state.current, 'month')) {
        if (this.props.showArrow) {
          arrowRight = true;
        }
        
        //draw then quit
        this.renderMultiEventBlock(startDrawDate, blockLength, props, arrowLeft, arrowRight);
        break;
      }
      if (curDate.date() == this.state.current.daysInMonth() || curDate.isSame(endDate, "day")) {
        //draw then quit
        this.renderMultiEventBlock(startDrawDate, blockLength, props, arrowLeft, arrowRight);
        break;
      }
      if (curDate.day() == 6) {
        //draw then reset
        this.renderMultiEventBlock(startDrawDate, blockLength, props, arrowLeft, arrowRight);
        startDrawDate = moment(curDate).add(1, "day").date();
        blockLength = 0;
        arrowLeft = false;
        arrowRight = false;
      }

      blockLength++;
      curDate.add(1, "day");
    }
  }

  //TODO: refactor this too?
  //handles rendering and proper stacking of individual blocks 
  renderMultiEventBlock(startDate, length, props, arrowLeft, arrowRight) { 
    let multiEventProps = {
      tooltipStyles: _.get(this.props.styles, 'tooltip', {}), //gets this.props.styles.tooltip if exists, else empty object
      multiEventStyles: _.get(this.props.styles, 'multiEvent', {}),
    }

    let maxBlocks = 0;
    let closedSlots = []; //keep track of rows that the event can't be inserted into

    for (let i = 0; i < length; i++) {
      let dayEvents = document.getElementById("day-" + (startDate + i)).children;
      if (dayEvents.length > maxBlocks) {
        maxBlocks = dayEvents.length;
      }

      //address rows that are not the last element in closedSlots
      for (let j = 0; j < maxBlocks; j++) {
        if (j > dayEvents.length) {
          break;
        } else if (closedSlots.includes(j)) {
          continue;
        } 
        if (dayEvents[j].classList.contains("isEvent")) {
          closedSlots.push(j);
        }
      }
    }

    let chosenRow;
    for (let i = 0; i <= maxBlocks; i++) {
      if (!closedSlots.includes(i)) {
        chosenRow = i;
        break;
      }
    }

    //fill in placeholders
    for (let i = 0; i < length; i++) {
      //placeholders
      while (document.getElementById("day-" + (startDate + i)).children.length <= chosenRow) {
        let tempNode = document.createElement("div");
        tempNode.className = "event below";
        document.getElementById("day-" + (startDate + i)).appendChild(tempNode);
      }

      //rest of event that is under the main banner
      document.getElementById("day-" + (startDate + i)).children[chosenRow].className = "isEvent event below";
    }
  
    //render event
    let node = document.getElementById("day-" + startDate).children[chosenRow];
    node.className = "isEvent";
    ReactDOM.render(<MultiEvent {...props} {...multiEventProps} length={length} arrowLeft={arrowLeft} arrowRight={arrowRight} />, node);
  }

  //attempts to render in a placeholder then at the end
  renderSingleEvent(date, props) {
    let foundEmpty = false;
    let nodes = document.getElementById("day-" + date).children;
    for (let node of nodes) {
      if (node.classList.contains("event") && !node.classList.contains("isEvent")) { //target only placeholders
        ReactDOM.render(<Event {...props} />, node);
        node.className = "";
        foundEmpty = true;
        break;
      }
    }
    if (!foundEmpty) {
      let tempNode = document.createElement("div");
      document.getElementById("day-" + date).appendChild(tempNode);
      ReactDOM.render(<Event {...props} />, tempNode);
    }
  }

  //get dates based on rrule string between dates
  static getDatesFromRRule(str, eventStart, betweenStart, betweenEnd) {    
    //get recurrences using RRule
    let options = RRule.parseString(str);
    options.dtstart = moment.parseZone(eventStart).utc(true).toDate();
    let rule = new RRule(options);
    let rruleSet = new RRuleSet();
    rruleSet.rrule(rule);
    
    //get dates
    let begin = moment(betweenStart).utc(true).toDate();
    let end = moment(betweenEnd).utc(true).toDate();
    let dates = rruleSet.between(begin, end);
    return dates;
  }

  renderEvents() {
    this.state.events.forEach((event) => {
      if (event.recurrence) {
        let duration = moment.duration(event.endTime.diff(event.startTime));
        let dates = Calendar.getDatesFromRRule(event.recurrence[0], event.startTime, moment(this.state.current).subtract(duration), moment(this.state.current).add(1, "month"));

        //render recurrences
        dates.forEach((date) => {
          //don't render if it is cancelled
          if (event.cancelledEvents.some((cancelledMoment) => (cancelledMoment.isSame(date, "day")))) {
            return;
          }

          let props;

          //update information if event has changed
          const changedEvent = event.changedEvents.find((changedEvent) => (changedEvent.originalStartTime.isSame(date, "day")));
          if (changedEvent) {
            props = {
              name: changedEvent.name,
              startTime: changedEvent.newStartTime,
              endTime: changedEvent.newEndTime,
              description: changedEvent.description,
              location: changedEvent.location,
            }
          } else {
            let eventStart = moment.utc(date); //since rrule works with utc times
            let eventEnd = moment(eventStart).add(duration);
            props = {
              name: event.name,
              startTime: eventStart,
              endTime: eventEnd,
              description: event.description,
              location: event.location,
            };
          }
          
          this.drawMultiEvent(props);   
        });
      } else {
        //render event
        //check if event is in range
        if ((event.startTime.month() != this.state.current.month() || event.startTime.year() != this.state.current.year()) &&
        event.endTime.month() != this.state.current.month() || event.endTime.year() != this.state.current.year()
        ) {
          return;
        }

        this.drawMultiEvent(event);
      }
    });

    let eventProps = {
      tooltipStyles: _.get(this.props.styles, 'tooltip', {}), //gets this.props.styles.tooltip if exists, else empty object
      eventStyles: _.get(this.props.styles, 'event', {}),
      eventCircleStyles: _.get(this.props.styles, 'eventCircle', {}),
      eventTextStyles: _.get(this.props.styles, 'eventText', {}),
    }

    this.state.singleEvents.forEach((event) => {
      if (event.recurrence) {
        let duration = moment.duration(event.endTime.diff(event.startTime));
        
        //get recurrences using RRule
        let dates = Calendar.getDatesFromRRule(event.recurrence[0], event.startTime, moment(this.state.current), moment(this.state.current).add(1, "month"));

        //render recurrences
        dates.forEach((date) => {
          //check if it is in cancelled
          if (event.cancelledEvents.some((cancelledMoment) => (cancelledMoment.isSame(date, "day")))) {
            return;
          }

          //if event has changed
          const changedEvent = event.changedEvents.find((changedEvent) => (changedEvent.originalStartTime.isSame(date, "day")));
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
          
          this.renderSingleEvent(moment(props.startTime).date(), {...props, ...eventProps});
        });
      } else {
        //check if event is in current month
        if (event.startTime.month() != this.state.current.month() || event.startTime.year() != this.state.current.year()) {
          return;
        }

        this.renderSingleEvent(moment(event.startTime).date(), {...event, ...eventProps});
      }
    });
  }

  render() {
    return (
      <div
        className="calendar"
        css={[{
          fontSize: "18px",
          border: "1px solid",
          minWidth: "300px",
          position: "relative",
          borderColor: "LightGray",
          color: "#51565d",
        }, _.get(this.props.styles, 'calendar', {})]}
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
              {this.state.monthNames[this.state.current.month()] + " " + this.state.current.year()}
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
          <div css={css`
            font-size: 14px;
            padding-left: 5px;
            text-align: left;
          `}>
            All times shown in timezone: {this.state.calendarTimezone.replace("_", " ")}
          </div>
          <div css={css`
            vertical-align: top;
            margin-left: 3px;
            margin-right: 3px;
          `}>
            <a href={"https://calendar.google.com/calendar/r?cid=" + this.props.calendarId} target="_blank" css={css`
              font-size: 14px;
              text-decoration: none;
              color: inherit;
              &:hover {
                text-decoration: underline;
              }
            `}>
              &#43; Add Calendar
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

  showArrow: PropTypes.bool,

  styles: PropTypes.object,
}

Calendar.defaultProps = {
  showArrow: true,
}
