import React from "react";
import "./index.css";
import Place from '@material-ui/icons/Place';
import Subject from '@material-ui/icons/Subject';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import PropTypes from 'prop-types';
import moment from "moment";

export default class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      start_time: this.props.start_time,
      end_time: this.props.end_time,
      description: this.props.description,
      location: this.props.location,
      showTooltip: false,
      hover: false,
      circleColor: "#4786ff",
      color: "#4786ff",
      background_color: "rgba(217, 230, 255, 0.7)",
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
      description = <div className="details">
      <div style={{paddingRight: "10px"}}><Subject fontSize="small" /></div>
      <div dangerouslySetInnerHTML={{__html: this.state.description}} />
      </div>;
    } else {
      description = <div></div>;
    }

    let location;
    if (this.state.location) {
      location = <div className="details">
        <div style={{paddingRight: "10px"}}><Place fontSize="small" /></div>
        <div>{this.state.location}</div>
      </div>;
    } else {
      location = <div></div>;
    }

    return (
      <div className="event" tabIndex="0" onBlur={this.closeTooltip} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} style={{
        color: this.state.color,
        background: (this.state.hover ? this.state.background_color : "#fff"),
      }}>
        <div className="event-text" onClick={this.toggleTooltip}>
          <span style={{position: "absolute", top: "7px", left: "2px", color: this.props.circleColor }}>
            <FiberManualRecordIcon fontSize="inherit" />
          </span>
          {this.state.name}
        </div>
        <div className="tooltip" style={{
          visibility: this.state.showTooltip ? 'visible' : 'hidden',
          color: this.state.color,
          border: "2px solid " + this.state.background_color,
        }}>
          <h2>{this.state.name}</h2>
          <p className="display-linebreak">
            {
              this.state.start_time.isSame(this.state.end_time, 'day') ? 
              this.state.start_time.format("dddd, MMMM Do") + " \n" +  this.state.start_time.format("h:mma") + " - " + this.state.end_time.format("h:mma") :
              this.state.start_time.format("MMM Do, YYYY, h:mma") + " - \n" + this.state.end_time.format("MMM Do, YYYY, h:mma")
            }
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
  start_time: PropTypes.instanceOf(moment).isRequired,
  end_time: PropTypes.instanceOf(moment).isRequired,
  description: PropTypes.string,
  location: PropTypes.string,
}
