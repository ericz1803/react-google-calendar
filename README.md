# React Google Calendar
A react component that displays an event calendar using data from google calendar.

Design based on [this calendar](https://codepen.io/knyttneve/pen/QVqyNg).

## Installation

```
npm install --save @ericz1803/google-react-calendar
```

## Usage

First, get an api key from [here](https://developers.google.com/calendar/quickstart/js) by following step 1.

Alternately, you can go to https://console.developers.google.com/flows/enableapi?apiid=calendar.

Then, get the calendar id from the google calendar. It will look somehting like `s9ajkhr604dfrmvm7185lesou0@group.calendar.google.com`.   
You can find it by going to a calendar's settings and scrolling down to the section that is labelled `Integrate calendar`.

```
import Calendar from "@ericz1803/react-google-calendar";

const API_KEY = "YOUR_API_KEY";
const CALENDAR_ID = "YOUR_CALENDAR_ID";

class Example extends React.Component {
  render() {
    return (
      <div>
        <Calendar apiKey={API_KEY} calendarId={CALENDAR_ID} />
      </div>
    )
  }
}
```

### Properties


## License
MIT License