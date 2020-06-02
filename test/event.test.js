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

  test("correct event name",() => {
    let props = {
      name: "Test Event",
      startTime: moment(),
      endTime: moment(),
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".event-text").textContent).toEqual(expect.stringContaining("Test Event"));
  });

  test("correct event name and time (one day event)",() => {
    let props = {
      name: "Test Event",
      startTime: moment.utc("2020-04-20T04:30:00+00:00"),
      endTime: moment.utc("2020-04-20T15:30:00+00:00"),
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".event-text").textContent).toEqual("4:30am Test Event");
    expect(container.querySelector(".display-linebreak").textContent).toEqual("Monday, April 20th\n4:30am - 3:30pm");
  });

  test("correctly has no description",() => {
    let props = {
      name: "Test Event",
      startTime: moment(),
      endTime: moment(),
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".description")).toBeNull();
  });

  test("correct description",() => {
    let props = {
      name: "Test Event",
      startTime: moment(),
      endTime: moment(),
      description: "some description",
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".description").textContent).toEqual("some description");
  });

  test("correctly has no location",() => {
    let props = {
      name: "Test Event",
      startTime: moment(),
      endTime: moment(),
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".location")).toBeNull();
  });

  test("correct location",() => {
    let props = {
      name: "Test Event",
      startTime: moment(),
      endTime: moment(),
      location: "A location",
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".location").textContent).toEqual("A location");
  });

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

  test("correct event url", () => {
    const props = {
      startTime: moment("2020-05-02 16:30"),
      endTime: moment("2020-05-02 17:30"),
      name: "Event",
      description: "Some Description",
      location: "A Location",
    };

    const outputURL = Event.getCalendarURL(props.startTime, props.endTime, props.name, props.description, props.location);

    const expectedURL = "https://calendar.google.com/calendar/r/eventedit?text=Event&dates=20200502T163000%2F20200502T173000&details=Some+Description&location=A+Location";
    expect(outputURL).toBe(expectedURL);
  });

});