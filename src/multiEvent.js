/** @jsx jsx */

import React from "react";
import PropTypes from "prop-types";

import moment from "moment-timezone";

import "./index.css";

import { css, jsx } from '@emotion/react'

import Tooltip from "./tooltip";

import { isAllDay, pSBC } from "./utils/helper";

import { Manager, Reference } from 'react-popper';

export default class MultiEvent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      startTime: moment(this.props.startTime),
      endTime: moment(this.props.endTime),
      color: this.props.color,
      darkColor: pSBC(-0.35, this.props.color),

      showTooltip: false,
    }

    this.state.allDay = isAllDay(this.state.startTime, this.state.endTime);

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
    const leftArrow = css`
      margin-left: 8px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0; 
        width: 0;
        height: 0;
        border-right: 8px solid ${this.state.color};
        border-top: 13px solid transparent;
        border-bottom: 13px solid transparent;
      }
      &:hover::before {
        cursor: pointer;
        border-right-color: ${this.state.darkColor};
      }
    `;

    const rightArrow = css`
      margin-right: 8px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      &:after {
        content: "";
        position: absolute;
        right: 0;
        bottom: 0; 
        width: 0;
        height: 0;
        border-left: 8px solid ${this.state.color};
        border-top: 13px solid transparent;
        border-bottom: 13px solid transparent;
      }
      &:hover::after {
        cursor: pointer;
        border-left-color: ${this.state.darkColor};
      }
    `;

    return (
      <div 
        className="event"
        tabIndex="0"
        onBlur={this.closeTooltip}
        css={css`
          width: ${'calc(' + this.props.length + '00% + ' + (this.props.length - 1) + 'px)'};
          &:focus {
            outline: none;
          }
          position: relative;
        `}
      >
        <Manager>
          <Reference>
            {({ref}) => (
              <div css={[css`
                  width: ${'calc(100% - ' + 8 * (this.props.arrowLeft + this.props.arrowRight) + 'px)'};
                  border-radius: 3px;
                  background: ${this.state.color};
                  &:hover {
                    background: ${this.state.darkColor};
                  }
                  ${this.props.arrowLeft && leftArrow}
                  ${this.props.arrowRight && rightArrow}
                `, this.props.multiEventStyles]}

                onClick={this.toggleTooltip}
                ref={ref}
              >
                <div 
                  className="event-text" 
                  css={{
                    padding: '3px 0px',
                    color: 'white',
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
                >
                  {
                    this.state.allDay ? "" : this.state.startTime.format("h:mma ")
                  }
                  <span css={{fontWeight: "500"}}>
                    {this.props.name}
                  </span>
                </div>
              </div>
            )}
            
          </Reference>
          <Tooltip 
            name={this.props.name}
            startTime={moment(this.props.startTime)}
            endTime={moment(this.props.endTime)}
            description={this.props.description}
            location={this.props.location}
            tooltipStyles={this.props.tooltipStyles}
            showTooltip={this.state.showTooltip}
            closeTooltip={this.closeTooltip}
            calendarName={this.props.calendarName}
          />
        </Manager>
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
  calendarName: PropTypes.string,

  tooltipStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
  multiEventStyles: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.instanceOf(css),
  ]),
  color: PropTypes.string,
  arrowLeft: PropTypes.bool,
  arrowRight: PropTypes.bool,
}

MultiEvent.defaultProps = {
  color: '#4786ff',
  length: 1,
  arrowLeft: false,
  arrowRight: false,
}
