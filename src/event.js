import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";

import { css } from '@emotion/core';
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

import Tooltip from "./tooltip";

const TooltipWrapper = React.forwardRef((props, ref) => {
  return (<Tooltip innerRef={ref} {...props} />);
});

export default class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      startTime: moment.parseZone(this.props.startTime),
      endTime: moment.parseZone(this.props.endTime),
      description: this.props.description,
      location: this.props.location,
      
      //tooltip
      tooltipBorderColor: this.props.tooltipBorderColor,
      tooltipTextColor: this.props.tooltipTextColor,
      
      //event
      circleColor: this.props.circleColor,
      textColor: this.props.textColor,
      hoverColor: this.props.hoverColor,

      showTooltip: false,
      hover: false,
      timeDisplay: this.getTimeDisplay(this.props.startTime, moment.parseZone(this.props.endTime)),
    }

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
  }

  //get google calendar link
  static getCalendarURL(startTime, endTime, name, description, location) {
    const url = new URL("https://calendar.google.com/calendar/r/eventedit");
    url.searchParams.append("text", name || "");
    url.searchParams.append("dates", startTime.format("YYYYMMDDTHHmmss") + "/" + endTime.format("YYYYMMDDTHHmmss"));
    url.searchParams.append("details", description || "");
    url.searchParams.append("location", location || "");
    return url.href;
  }

  getTimeDisplay(startTime, endTime) {
    if (startTime.isSame(endTime, 'day')) {
      return startTime.format("dddd, MMMM Do") + "\n"
        + startTime.format("h:mma") + " - " + endTime.format("h:mma");
    } else {
      return startTime.format("MMM Do, YYYY, h:mma") + " -\n"
        + endTime.format("MMM Do, YYYY, h:mma");;
    }
  }

  closeTooltip() {
    this.setState({showTooltip: false});
  }

  toggleTooltip() {
    this.setState({showTooltip: !this.state.showTooltip});
  }

  toggleHover() {
    this.setState({hover: !this.state.hover});
  }

  render() {
    return (
      <div 
        className="event"
        tabIndex="0"
        onBlur={this.closeTooltip}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover} 
        css={css`
          border-radius: 3px;
          width: 100%;
          color: ${this.state.textColor}; 
          background: ${(this.state.hover || this.state.showTooltip) && this.state.hoverColor};
          :focus {
            outline: none;
          }
          @media (min-width: 600px) {
            position: relative;
          }
        `}
      >
        <div 
          className="event-text" 
          css={css`
            padding: 3px 0px 3px 20px;
            marginRight: 5px;
            overflow-x: hidden;
            white-space: nowrap;
            position: relative;
            text-align: left;
            &:hover: {
              cursor: pointer,
            }
          `}
          onClick={this.toggleTooltip}
        >
          <span css={css`
            position: absolute;
            top: 5px;
            left: 2px;
            color: ${this.state.circleColor};
          `}>
            <FiberManualRecordIcon fontSize="inherit" />
          </span>
          <span css={css`
            @media (max-width: 599px) {
              display: none;
            }
          `}>
            { this.state.startTime.format("h:mma ") }
          </span>
          <span css={{fontWeight: "500"}}>
            {this.state.name}
          </span>
        </div>
        <TooltipWrapper 
          ref={this.props.innerRef} 
          name={this.props.name}
          description={this.props.description}
          location={this.props.location}
          tooltipTextColor={this.props.tooltipTextColor}
          tooltipBorderColor={this.props.tooltipBorderColor}
          eventURL={Event.getCalendarURL(this.state.startTime, this.state.endTime, this.state.name, this.state.description, this.state.location)}
          showTooltip={this.state.showTooltip}
          timeDisplay={this.state.timeDisplay}
        />
      </div>
    )
  }
}

Event.propTypes = {
  name: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(moment).isRequired,
  endTime: PropTypes.instanceOf(moment).isRequired,
  description: PropTypes.string,
  location: PropTypes.string,
  tooltipBorderColor: PropTypes.string,
  tooltipTextColor: PropTypes.string,
  circleColor: PropTypes.string,
  textColor: PropTypes.string,
  hoverColor: PropTypes.string,
}
