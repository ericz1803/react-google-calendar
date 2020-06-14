import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";

import { css } from '@emotion/core';

import Tooltip from "./tooltip";

import { isAllDay } from "./utils/helper";

const TooltipWrapper = React.forwardRef((props, ref) => {
  return (<Tooltip innerRef={ref} {...props} />);
});

export default class MultiEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: moment.parseZone(this.props.startTime),
      endTime: moment.parseZone(this.props.endTime),

      //event
      textColor: this.props.textColor,
      backgroundColor: this.props.backgroundColor,
      hoverColor: this.props.hoverColor,

      showTooltip: false,
      hover: false,
    }

    this.state.allDay = isAllDay(this.state.startTime, this.state.endTime);

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
        css={css`
          border-radius: 3px;
          width: ${'calc(' + this.props.length + '00% + ' + (this.props.length - 1 - 8 * (this.props.arrowLeft + this.props.arrowRight)) + 'px)'};
          color: ${this.state.textColor};
          background: ${((this.state.hover || this.state.showTooltip) ? this.state.hoverColor : this.state.backgroundColor)};
          ${this.props.arrowLeft && leftArrow}
          ${this.props.arrowRight && rightArrow}
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
          css={{
            padding: '3px 0px',
            marginLeft: this.props.arrowLeft ? '2px' : '5px',
            marginRight: this.props.arrowRight ? '0px' : '5px',
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
          {
            this.state.allDay ? "" : this.state.startTime.format("h:mma ")
          }
          <span css={{fontWeight: "500"}}>
            {this.props.name}
          </span>
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
        />
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
  tooltipStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
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