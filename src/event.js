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
      startTime: moment.parseZone(this.props.startTime),
      endTime: moment.parseZone(this.props.endTime),

      showTooltip: false,
    }

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
  }

  closeTooltip() {
    this.setState({showTooltip: false});
  }

  toggleTooltip() {
    this.setState({showTooltip: !this.state.showTooltip});
  }

  render() {
    return (
      <div 
        className="event"
        tabIndex="0"
        onBlur={this.closeTooltip}
        css={css`
          position: relative;
          &:focus {
            outline: none;
          }
        `}
      >
        <div css={[css`
          border-radius: 3px;
          width: 100%;
          &:hover {
            background: rgba(81, 86, 93, 0.1);
          }
        `, this.props.eventStyles]}>
          <div 
            className="event-text" 
            css={[{
              color: "#51565d",
              padding: "3px 0px 3px 20px",
              marginRight: "5px",
              overflowX: "hidden",
              whiteSpace: "nowrap",
              position: "relative",
              textAlign: "left",
              '&:hover': {
                cursor: "pointer",
              }
            }, this.props.eventTextStyles]}
            onClick={this.toggleTooltip}
          >
            <span css={[css`
              position: absolute;
              top: 5px;
              left: 2px;
              color: #4786ff;
            `, this.props.eventCircleStyles]}>
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
              {this.props.name}
            </span>
          </div>
        </div>
        <TooltipWrapper 
          ref={this.props.innerRef} 
          name={this.props.name}
          startTime={moment.parseZone(this.props.startTime)}
          endTime={moment.parseZone(this.props.endTime)}
          description={this.props.description}
          location={this.props.location}
          tooltipStyles={this.props.tooltipStyles}
          showTooltip={this.state.showTooltip}
          closeTooltip={this.closeTooltip}
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
  eventStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
  eventCircleStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
  eventTextStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
  tooltipStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
  circleColor: PropTypes.string,
  textColor: PropTypes.string,
  hoverColor: PropTypes.string,
}