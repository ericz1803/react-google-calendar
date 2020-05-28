
import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";

import { css } from '@emotion/core';

import Place from "@material-ui/icons/Place";
import Subject from "@material-ui/icons/Subject";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

export default class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      startTime: this.props.startTime,
      endTime: moment.parseZone(this.props.endTime),
      description: this.props.description,
      location: this.props.location,
      
      borderColor: this.props.borderColor,
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

    return (
      <div 
        className="event"
        tabIndex="0"
        onBlur={this.closeTooltip}
        onMouseEnter={this.toggleHover}
        onMouseLeave={this.toggleHover} 
        css={{
          width: '100%',
          color: this.state.textColor, 
          background: this.state.hover && this.state.hoverColor,
        }}
      >
        <div 
          className="event-text" 
          css={{
            padding: '5px 0px 5px 20px',
            marginRight: '5px',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            position: 'relative',
            textAlign: 'left',
            '&:hover': {
              cursor: 'pointer',
            },
          }}
          onClick={this.toggleTooltip}
        >
          <span css={{position: "absolute", top: "7px", left: "2px", color: this.state.circleColor }}>
            <FiberManualRecordIcon fontSize="inherit" />
          </span>

          { this.state.startTime.format("h:mma ") }
          <span css={{fontWeight: "500"}}>
            {this.state.name}
          </span>
        </div>
        <div className="tooltip" css={{
          visibility: this.state.showTooltip ? "visible" : "hidden",
          color: this.state.textColor,
          border: "2px solid " + this.state.borderColor,
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

Event.propTypes = {
  name: PropTypes.string.isRequired,
  startTime: PropTypes.instanceOf(moment).isRequired,
  endTime: PropTypes.instanceOf(moment).isRequired,
  description: PropTypes.string,
  location: PropTypes.string,
  borderColor: PropTypes.string,
  circleColor: PropTypes.string,
  textColor: PropTypes.string,
  hoverColor: PropTypes.string,
}
