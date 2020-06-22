import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import moment from "moment-timezone";

import Event from "../src/event";

let container;

let basicProps = {
  borderColor: "black",
  hoverColor: "red",
  textColor: "blue",
  circleColor: "green",
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

describe("Event Component", () => {
  test("opens and closes properly on click",() => {
    let props = {
      name: "Test Event",
      startTime: moment(),
      endTime: moment(),
    };

    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(window.getComputedStyle(container.querySelector('.tooltip')).visibility).toEqual("hidden");
    
    act(() => {
      container.querySelector(".event-text").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(window.getComputedStyle(container.querySelector('.tooltip')).visibility).toEqual("visible");

    act(() => {
      container.querySelector(".event-text").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(window.getComputedStyle(container.querySelector('.tooltip')).visibility).toEqual("hidden");
  });
});
