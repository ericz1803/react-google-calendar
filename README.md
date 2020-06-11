# React Google Calendar

![npm (scoped)](https://img.shields.io/npm/v/@ericz1803/react-google-calendar) [![Build Status](https://travis-ci.com/ericz1803/react-google-calendar.svg?token=kgRjisW2saVwCyBzYyN5&branch=master)](https://travis-ci.com/ericz1803/react-google-calendar)   
  
A react component that displays an event calendar using data from google's calendar api. It is intended to replace the embedded google calendar.

It handles reccuring events, deleted events, and changed events. It also handles and displays events of all lengths in a very similar way to google calendar.

See it in action [here](https://ericz1803.github.io/react-test-calendar/).

![picture of calendar](example.png)

Design inspired by [this calendar](https://codepen.io/knyttneve/pen/QVqyNg) and [google calendar](https://www.google.com/calendar).

## Installation

```
npm install --save @ericz1803/google-react-calendar
```

## Usage

First, get an api key from [here](https://developers.google.com/calendar/quickstart/js) by following step 1.

Alternately, you can go to https://console.developers.google.com/flows/enableapi?apiid=calendar.

Then, get the calendar id from the google calendar. It will look something like `09opmkrjova8h5k5k46fedmo88@group.calendar.google.com`.   
You can find it by going to a calendar's settings and scrolling down to the section that is labelled `Integrate calendar`.

### Properties
| Parameter             | Type   | Description                                                                                                                                 | Default |
|-----------------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `apiKey`              | string | google api key (required)                                                                                                                   |         |
| `calendarId`          | string | google calendar id (required)                                                                                                               |         |

### Customization

You can change the color of different aspects of the calendar by passing css colors (eg. `#51565d` or `rgba(166, 168, 179, 0.12)`) into the following props (as a string).

#### Calendar Colors
| Parameter              | Type   | Description                | Default                          |
|------------------------|--------|----------------------------|----------------------------------|
| `borderColor`          | string | color of calendar lines    | "LightGray"                      |
| `textColor`            | string | color of the calendar text | "#51565d"                        |
| `backgroundColor`      | string | color of the calendar      | null                             |
| `todayTextColor`       | string | text color of today        | null (same as `textColor`)       |
| `todayBackgroundColor` | string | color of today             | null (same as `backgroundColor`) |

#### Tooltip Colors
| Parameter            | Type   | Description                                                     | Default                 |
|----------------------|--------|-----------------------------------------------------------------|-------------------------|
| `tooltipBorderColor` | string | border color of tooltip that pops up when you click on an event | "rgba(81, 86, 93, 0.1)" |
| `tooltipTextColor`   | string | color of tooltip text                                           | "#51565d"               |

#### Single Event Colors 
Applies to events that are shorter than 24h.

| Parameter                | Type   | Description                                    | Default                 |
|--------------------------|--------|------------------------------------------------|-------------------------|
| `singleEventHoverColor`  | string | color of the event on hover                    | "rgba(81, 86, 93, 0.1)" |
| `singleEventTextColor`   | string | text color of event                            | "#51565d"               |
| `singleEventCircleColor` | string | color of the circle in front of the event text | "#4786ff"               |

#### Event Colors
Applies to events that are All Day Events or span multiple days.


| Parameter              | Type   | Description                 | Default   |
|------------------------|--------|-----------------------------|-----------|
| `eventTextColor`       | string | text color of event         | "white"   |
| `eventBackgroundColor` | string | background color of event   | "#4786ff" |
| `eventHoverColor`      | string | color of the event on hover | "#396DCC" |

### Example

```js
import Calendar from "@ericz1803/react-google-calendar";

const API_KEY = "YOUR_API_KEY";
const CALENDAR_ID = "YOUR_CALENDAR_ID";

class Example extends React.Component {
  render() {
    let props = {
      singleEventCircleColor: 'SpringGreen',
      borderColor: 'SlateGrey',
    }

    return (
      <div>
        <Calendar apiKey={API_KEY} calendarId={CALENDAR_ID} {...props} />
      </div>
    )
  }
}
```

## License
MIT License