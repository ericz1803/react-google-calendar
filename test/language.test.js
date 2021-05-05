import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import Calendar from "../src/index";

describe("check if the language change affects the component", () => {
  test("test valid language", () => {
    let container = document.createElement("div");
    document.body.appendChild(container);

    const calendars = [
      { calendarId: "09opmkrjova8h5k5k46fedmo88@group.calendar.google.com" },
    ];

    act(() => {
      ReactDOM.render(
        <Calendar
          apiKey={process.env.GOOGLE_API_KEY}
          language={"FR"}
          calendars={calendars}
        />,
        container
      );
    });

    const txt = container.innerHTML;

    expect(txt.search("Dim")).toBeGreaterThan(0);
  });
});

describe("check if invalid language affects component", () => {
  test("test invalid language", () => {
    let container = document.createElement("div");
    document.body.appendChild(container);

    const calendars = [
      { calendarId: "09opmkrjova8h5k5k46fedmo88@group.calendar.google.com" },
    ];

    act(() => {
      ReactDOM.render(
        <Calendar
          apiKey={process.env.GOOGLE_API_KEY}
          language={"ZZ"}
          calendars={calendars}
        />,
        container
      );
    });

    const txt = container.innerHTML;

    expect(txt.search("Mon")).toBeGreaterThan(0);
  });
});
