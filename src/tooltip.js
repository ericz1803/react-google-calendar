import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";

import { css } from '@emotion/react';

import { isAllDay, getCalendarURL } from "./utils/helper";

import Place from "./svg/place";
import Subject from "./svg/subject";

export default class Tooltip extends React.PureComponent {
  constructor(props) {
    super(props);
    let allDay = isAllDay(this.props.startTime, this.props.endTime);

    this.state = {
      //tooltip positioning
      flipX: false,
      flipY: false,
      middleX: false,
      middleY: false,
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
        flipX: (tooltipRect.left < calendarRect.left),
        flipY: (tooltipRect.top < calendarRect.top),
      });
    }
  }

  //position tooltip in middle of event if it hangs off both sides of calendar
  componentDidUpdate() {
    if (this.props.innerRef) {
      let calendarRect = this.props.innerRef.current.getBoundingClientRect();
      let tooltipRect = this.tooltipRef.current.getBoundingClientRect();
      if (this.state.flipX && (tooltipRect.right > calendarRect.right)) {
        this.setState({
          middleX: true,
          flipX: false,
        });
      }

      if (this.state.flipY && (tooltipRect.bottom > calendarRect.bottom)) {
        this.setState({
          middleY: true,
          flipY: false,
        });
      } 
    }
  }

  render() {
    let description;
    if (this.props.description) {
      description = <div className="details description">
        <div css={{ paddingRight: "10px" }}><Subject fill="currentColor" /></div>
        <div dangerouslySetInnerHTML={{__html: this.props.description}} />
      </div>;
    } else {
      description = <div></div>;
    }

    let location;
    if (this.props.location) {
      location = <div className="details location">
        <div css={{ paddingRight: "10px", display: "flex", alignItems: "center" }}><Place fill="currentColor" /></div>
        <div>{this.props.location}</div>
      </div>;
    } else {
      location = <div></div>;
    }

    return (
      <div 
        className="tooltip" 
        ref={this.tooltipRef}
        css={[css`
          visibility: ${this.props.showTooltip ? "visible" : "hidden"};
          width: 225px;
          background: #fff;
          text-align: left;
          padding: 5px;
          border-radius: 6px;
          color: #51565d;
          border: 2px solid rgba(81, 86, 93, 0.1);
          position: absolute;
          z-index: 1;

          bottom: ${this.state.middleX ? (!this.state.flipY && "100%") : (!this.state.flipY && "0%")};
          top: ${this.state.middleX ? (this.state.flipY && "100%") : (this.state.flipY && "0%")};
          right: ${!this.state.flipX && "calc(100% + 3px)"};
          left: ${this.state.flipX && "calc(100% + 3px)"};
          left: ${this.state.middleX && "50%"};
          transform: ${"translate(" + (this.state.middleX ? "-50%" : "0%") + "," + (this.state.middleY ? "50%" : "0%") + ")"};
      `, this.props.tooltipStyles]}>
        <div css={{
          position: "relative",
        }}>
          <div css={css`
            position: absolute;
            right: 2px;
            top: -5px;
            opacity: 0.5;
            font-size: 24px;
            &:hover {
              cursor: pointer;
              opacity: 0.9;
            }
          `}
            onClick={this.props.closeTooltip}
          >
            &times;
          </div>
          <h2 className="tooltip-text" css={{marginTop: "0px", paddingTop: "18.675px"}}>{this.props.name}</h2>
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
            Copy to Calendar
          </a>
        </div>
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
  closeTooltip: PropTypes.func.isRequired,
}
