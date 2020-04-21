import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";


import Place from "@material-ui/icons/Place";
import Subject from "@material-ui/icons/Subject";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

export default class Event extends React.Component {
  constructor(props) {
    super(props);

    //consider it an all day event if both times are equivalent to the start of days
    let allDay = this.props.startTime.isSame(moment.parseZone(this.props.startTime).startOf("day"), "second") 
      && this.props.endTime.isSame(moment.parseZone(this.props.endTime).startOf("day"), "second");

    this.state = {
      name: this.props.name,
      startTime: this.props.startTime,
      endTime: allDay ? moment.parseZone(this.props.endTime).subtract(1, "day") : moment.parseZone(this.props.endTime),
      description: this.props.description,
      location: this.props.location,
      allDay: allDay,
      
      borderColor: this.props.borderColor,
      circleColor: this.props.circleColor,
      textColor: this.props.textColor,
      hoverColor: this.props.hoverColor,

      showTooltip: false,
      hover: false,
    }

    //calculate time display in tooltip
    if (allDay) {
      if (this.state.startTime.isSame(this.state.endTime, "day")) { //event spans 1 day
        this.state.timeDisplay = this.state.startTime.format("dddd, MMMM Do")
      } else { // more than 1 day
        this.state.timeDisplay = this.state.startTime.format("MMM Do, YYYY") + " - "
          + this.state.endTime.format("MMM Do, YYYY");
      }
    } else {
      if (this.state.startTime.isSame(this.state.endTime, "day")) { //event spans 1 day
        this.state.timeDisplay = this.state.startTime.format("dddd, MMMM Do") + "\n" 
          + this.state.startTime.format("h:mma") + " - " + this.state.endTime.format("h:mma");
      } else { // more than 1 day
        this.state.timeDisplay = this.state.startTime.format("MMM Do, YYYY, h:mma") + " -\n"
         + this.state.endTime.format("MMM Do, YYYY, h:mma");
      }
    }

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
    this.toggleHover = this.toggleHover.bind(this);
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
      <div style={{paddingRight: "10px"}}><Subject fontSize="small" /></div>
      <div dangerouslySetInnerHTML={{__html: this.state.description}} />
      </div>;
    } else {
      description = <div></div>;
    }

    let location;
    if (this.state.location) {
      location = <div className="details location">
        <div style={{paddingRight: "10px"}}><Place fontSize="small" /></div>
        <div>{this.state.location}</div>
      </div>;
    } else {
      location = <div></div>;
    }

    return (
      <div className="event" tabIndex="0" onBlur={this.closeTooltip} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} style={{
        color: this.state.textColor,
        background: (this.state.hover ? this.state.hoverColor : "inherit"),
      }}>
        <div className="event-text" onClick={this.toggleTooltip}>
          <span style={{position: "absolute", top: "7px", left: "2px", color: this.state.circleColor }}>
            <FiberManualRecordIcon fontSize="inherit" />
          </span>
          {
            this.state.allDay ? "" : this.state.startTime.format("h:mma ")
          }
          <span style={{fontWeight: "500"}}>
            {this.state.name}
          </span>
        </div>
        <div className="tooltip" style={{
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
