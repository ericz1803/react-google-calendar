
import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";

import { css } from '@emotion/core';

import Place from "@material-ui/icons/Place";
import Subject from "@material-ui/icons/Subject";

export default class MultiEvent extends React.Component {
  constructor(props) {
    super(props);

    let dateOnly = this.isDateOnly(this.props.startTime, this.props.endTime);

    this.state = {
      name: this.props.name,
      startTime: this.props.startTime,
      endTime: dateOnly ? moment.parseZone(this.props.endTime).subtract(1, "day") : moment.parseZone(this.props.endTime),
      description: this.props.description,
      location: this.props.location,
      length: this.props.length,
      dateOnly: dateOnly,
      
      //arrows on either side
      arrowLeft: this.props.arrowLeft,
      arrowRight: this.props.arrowRight,

      //tooltip
      tooltipBorderColor: this.props.tooltipBorderColor,
      tooltipTextColor: this.props.tooltipTextColor,

      //event
      textColor: this.props.textColor,
      backgroundColor: this.props.backgroundColor,
      hoverColor: this.props.hoverColor,

      showTooltip: false,
      hover: false,
    }

    //get time display
    this.state.timeDisplay = this.getTimeDisplay(this.state.startTime, this.state.endTime, dateOnly);

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
  }

  // determines if an event is a date only event (times for both start and end are 12am)
  isDateOnly(startTime, endTime) {
    return startTime.isSame(moment.parseZone(startTime).startOf("day"), "second")
      && endTime.isSame(moment.parseZone(endTime).startOf("day"), "second");
  }

  getTimeDisplay(startTime, endTime, dateOnly) {
    if (dateOnly) {
      if (endTime.isSame(startTime, "day")) {
        return startTime.format("dddd, MMMM Do");
      } else {
        return startTime.format("MMM Do, YYYY") + " - " + endTime.format("MMM Do, YYYY");
      }

    } else {
      return startTime.format("MMM Do, YYYY, h:mma") + " -\n" + endTime.format("MMM Do, YYYY, h:mma");
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
    let description;
    if (this.state.description) {
      description = <div className="details description">
        <div css={{paddingRight: "10px"}}><Subject fontSize="small" /></div>
        <div dangerouslySetInnerHTML={{__html: this.state.description}} />
      </div>;
    } else {
      description = <div></div>;
    }

    let location;
    if (this.state.location) {
      location = <div className="details location">
        <div css={{paddingRight: "10px"}}><Place fontSize="small" /></div>
        <div>{this.state.location}</div>
      </div>;
    } else {
      location = <div></div>;
    }

    const leftArrow = css`
      margin-left: 8px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      &:before {
        content: "";
        position: absolute;
        left: -8px;
        bottom: 0; 
        width: 0;
        height: 0;
        border-right: 8px solid ${((this.state.hover || this.state.showTooltip) ? this.state.hoverColor : this.state.backgroundColor)};
        border-top: 13px solid transparent;
        border-bottom: 13px solid transparent;
      }
    `;

    const rightArrow = css`
      margin-right: 8px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      &:after {
        content: "";
        position: absolute;
        right: -8px;
        bottom: 0; 
        width: 0;
        height: 0;
        border-left: 8px solid ${((this.state.hover || this.state.showTooltip) ? this.state.hoverColor : this.state.backgroundColor)};
        border-top: 13px solid transparent;
        border-bottom: 13px solid transparent;
      }
    `;

    return (
      <div 
        className="event"
        tabIndex="0"
        onBlur={this.closeTooltip}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover}
        onClick={this.toggleTooltip}
        css={css`
          
          border-radius: 3px;
          width: ${'calc(' + this.state.length + '00% + ' + (this.state.length - 1 - 8 * (this.state.arrowLeft + this.state.arrowRight)) + 'px)'};
          color: ${this.state.textColor};
          background: ${((this.state.hover || this.state.showTooltip) ? this.state.hoverColor : this.state.backgroundColor)};
          ${this.state.arrowLeft && leftArrow}
          ${this.state.arrowRight && rightArrow}
          :focus {
            outline: none;
          }
        `}
      >
        <div 
          className="event-text" 
          css={{
            padding: '3px 0px',
            marginLeft: this.state.arrowLeft ? '2px' : '5px',
            marginRight: this.state.arrowRight ? '0px' : '5px',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            position: 'relative',
            textAlign: 'left',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
        >
          {
            this.state.dateOnly ? "" : this.state.startTime.format("h:mma ")
          }
          <span css={{fontWeight: "500"}}>
            {this.state.name}
          </span>
        </div>
        <div className="tooltip" css={{
          visibility: this.state.showTooltip ? "visible" : "hidden",
          color: this.state.tooltipTextColor,
          border: "2px solid " + this.state.tooltipBorderColor,
        }}>
          <h2>{this.state.name}</h2>
          <p className="display-linebreak">
            { this.state.timeDisplay }
          </p>
          {description}
          {location}
        </div>
      </div>
    )
  }
}

MultiEvent.propTypes = {
  name: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(moment).isRequired,
  endTime: PropTypes.instanceOf(moment).isRequired,
  length: PropTypes.number,
  description: PropTypes.string,
  location: PropTypes.string,
  tooltipBorderColor: PropTypes.string,
  tooltipTextColor: PropTypes.string,
  textColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  hoverColor: PropTypes.string,
  arrowLeft: PropTypes.bool,
  arrowRight: PropTypes.bool,
}

MultiEvent.defaultProps = {
  length: 1,
  arrowLeft: false,
  arrowRight: false,
}