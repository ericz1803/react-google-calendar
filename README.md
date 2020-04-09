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

### Customization

You can change the color of different aspects of the calendar by passing css colors (eg. `#51565d` or `rgba(166, 168, 179, 0.12)`) into the following props (as a string).

#### Calendar Colors
`borderColor`: color of calendar lines (default: `LightGray`)  
`textColor`: color of the calendar text (default: `51565d`)  
`backgroundColor`: color of the calendar (default: none)  
`todayTextColor`:  text color of today (default: none (same as calendar text color))  
`todayBackgroundColor`:  color of today square (default: none (same as `backgroundColor`))

#### Event Colors 
`eventBorderColor`: border color of tooltip that pops up when you click on an event (default: `rgba(81, 86, 93, 0.1)`)  
`eventHoverColor`: color of the event on hover (default: `rgba(81, 86, 93, 0.1)`)  
`eventTextColor`: color of the event text (default: `#51565d`)  
`eventCircleColor`: color of the circle in front of the event text (default: `#4786ff`)  

### Example

```js
import Calendar from "@ericz1803/react-google-calendar";

const API_KEY = "YOUR_API_KEY";
const CALENDAR_ID = "YOUR_CALENDAR_ID";

class Example extends React.Component {
  render() {
    let props = {
      eventCircleColor: 'SpringGreen',
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