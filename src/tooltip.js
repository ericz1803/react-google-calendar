import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";

import { css } from '@emotion/core';

import { isAllDay, getCalendarURL } from "./utils/helper";

import Place from "@material-ui/icons/Place";
import Subject from "@material-ui/icons/Subject";

export default class Tooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    let allDay = isAllDay(this.props.startTime, this.props.endTime);

    this.state = {
      //tooltip positioning
      flipX: false,
      flipY: false,
      timeDisplay: Tooltip.getTimeDisplay(this.props.startTime, this.props.endTime, allDay),
      eventURL: getCalendarURL(this.props.startTime, this.props.endTime, this.props.name, this.props.description, this.props.location, allDay),
    }
    this.tooltipRef = React.createRef();
  }

  static getTimeDisplay(startTime, endTime, allDay) {
    if (allDay) {
      let endDate = moment(endTime).subtract(1, "day");

      if (endDate.isSame(startTime, "day")) {
        return startTime.format("dddd, MMMM Do");
      } else {
        return startTime.format("MMM Do, YYYY") + " - " + endDate.format("MMM Do, YYYY");
      }
    } else {
      if (endTime.isSame(startTime, "day")) {
        return startTime.format("dddd, MMMM Do") + "\n" 
          + startTime.format("h:mma") + " - " + endTime.format("h:mma");
      } else {
        return startTime.format("MMM Do, YYYY, h:mma") + " -\n" + endTime.format("MMM Do, YYYY, h:mma");
      }
    }
  }

  //if tooltip goes outside calendar flip it to keep it inside
  componentDidMount() {
    if (this.props.innerRef) {
      let calendarRect = this.props.innerRef.current.getBoundingClientRect();
      let tooltipRect = this.tooltipRef.current.getBoundingClientRect();
      this.setState({
        flipX: (tooltipRect.x < calendarRect.x),
        flipY: (tooltipRect.y < calendarRect.y),
      });
    }
  }

  render() {
    let description;
    if (this.props.description) {
      description = <div className="details description">
        <div css={{paddingRight: "10px"}}><Subject fontSize="small" /></div>
        <div dangerouslySetInnerHTML={{__html: this.props.description}} />
      </div>;
    } else {
      description = <div></div>;
    }

    let location;
    if (this.props.location) {
      location = <div className="details location">
        <div css={{paddingRight: "10px"}}><Place fontSize="small" /></div>
        <div>{this.props.location}</div>
      </div>;
    } else {
      location = <div></div>;
    }

    return (
      <div 
        className="tooltip" 
        ref={this.tooltipRef}
        css={css`
          visibility: ${this.props.showTooltip ? "visible" : "hidden"};
          width: 225px;
          background: #fff;
          text-align: left;
          padding: 5px;
          border-radius: 6px;
          color: ${this.props.tooltipTextColor};
          border: ${"2px solid " + this.props.tooltipBorderColor};
          position: absolute;
          z-index: 1;
          @media (max-width: 599px) {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          @media (min-width: 600px) {
            bottom: ${!this.state.flipY && "0%"};
            top: ${this.state.flipY && "0%"};
            right: ${!this.state.flipX && "101%"};
            left: ${this.state.flipX && "101%"};
          }
          
      `}>
        <h2 className="tooltip-text">{this.props.name}</h2>
        <p className="display-linebreak">
          { this.state.timeDisplay }
        </p>
        {description}
        {location}
        <a 
          href={this.state.eventURL}
          target="_blank"
          onMouseDown={e => e.preventDefault()}
          css={{
            fontSize: "13px",
          }}
        >
          Add to Calendar
        </a>
      </div>
    );
  }
}

Tooltip.propTypes = {
  showTooltip: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(moment),
  endTime: PropTypes.instanceOf(moment),
  description: PropTypes.string,
  location: PropTypes.string,
  tooltipBorderColor: PropTypes.string,
  tooltipTextColor: PropTypes.string,
}
