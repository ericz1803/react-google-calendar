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

  test("correct event name and time (one day all day event)",() => {
    let props = {
      name: "Test Event",
      startTime: moment.utc("2020-04-20").startOf("day"),
      endTime: moment.utc("2020-04-21").startOf("day"),
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".event-text").textContent).toEqual("Test Event");
    expect(container.querySelector(".display-linebreak").textContent).toEqual("Monday, April 20th");
  });

  test("correct event name and time (multiple day all day event)",() => {
    let props = {
      name: "Test Event",
      startTime: moment.utc("2020-03-20").startOf("day"),
      endTime: moment.utc("2020-03-25").startOf("day"),
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".event-text").textContent).toEqual("Test Event");
    expect(container.querySelector(".display-linebreak").textContent).toEqual("Mar 20th, 2020 - Mar 24th, 2020");
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

  test("correct event name and time (multiple day event)",() => {
    let props = {
      name: "Test Event",
      startTime: moment.utc("2020-03-20T04:30:00+00:00"),
      endTime: moment.utc("2020-03-25T15:30:00+00:00"),
    };
    act(() => {
      ReactDOM.render(<Event {...basicProps} {...props} />, container);
    });

    expect(container.querySelector(".event-text").textContent).toEqual("4:30am Test Event");
    expect(container.querySelector(".display-linebreak").textContent).toEqual("Mar 20th, 2020, 4:30am -\nMar 25th, 2020, 3:30pm");
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

});