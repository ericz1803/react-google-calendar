import moment from "moment-timezone";

/** determines whether event is an all day event
  * @param {moment} startTime start of event
  * @param {moment} endTime end of event
  * @return {bool} Whether or not it is an all day event
  */
export function isAllDay(startTime, endTime) {
  return startTime.isSame(moment.parseZone(startTime).startOf("day"), "second")
    && endTime.isSame(moment.parseZone(endTime).startOf("day"), "second");
}

/** get google calendar link to copy event
  * @param {moment} startTime start of event
  * @param {moment} endTime end of event
  * @param {string} name name of event
  * @param {string} description description of event
  * @param {string} location location of event
  * @param {bool} allDay whether or not it is an all day event
  * @return {string} url of the link
  */
export function getCalendarURL(startTime, endTime, name, description, location, allDay) {
  const url = new URL("https://calendar.google.com/calendar/r/eventedit");
  url.searchParams.append("text", name || "");
  
  if (allDay) {
    url.searchParams.append("dates", startTime.format("YYYYMMDD") + "/" + endTime.format("YYYYMMDD"));
  } else {
    url.searchParams.append("dates", startTime.format("YYYYMMDDTHHmmss") + "/" + endTime.format("YYYYMMDDTHHmmss"));
  }
  
  url.searchParams.append("details", description || "");
  url.searchParams.append("location", location || "");
  return url.href;
}