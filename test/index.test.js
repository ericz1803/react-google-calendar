import Calendar from "../src/index"

describe("Process Events", () => {
  test("Empty case", () => {
    expect(Calendar.processEvents([], true)).toEqual([[],[]]);
  })

  test("Basic Case w/ both single events and longer events", () => {
    let items = [
      {
        "id": "2lq0a9kuq8pvvldoqsa85lkbsp",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=MmxxMGE5a3VxOHB2dmxkb3FzYTg1bGtic3Agcmc0bTBrNjA3NjA5cjJqbWRyOTdzanZqdXNAZw",
        "summary": "Single Event",
        "start": { "dateTime": "2020-05-25T20:00:00-07:00" },
        "end": { "dateTime": "2020-05-25T21:00:00-07:00" },
      },
      {
        "id": "3lve0jmikubq9ui98nakv2rus7",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=M2x2ZTBqbWlrdWJxOXVpOThuYWt2MnJ1czcgcmc0bTBrNjA3NjA5cjJqbWRyOTdzanZqdXNAZw",
        "summary": "All Day Event",
        "start": { "date": "2020-05-27" },
        "end": { "date": "2020-05-28" },
      }
    ];
    
    let output = Calendar.processEvents(items, true);

    let expected = [
      [
        {
          id: "3lve0jmikubq9ui98nakv2rus7",
          name: "All Day Event",
          startTime: "2020-05-27T00:00:00.000Z",
          endTime: "2020-05-28T00:00:00.000Z",
          changedEvents: [],
          cancelledEvents: [],
        },
      ],
      [
        {
          id: "2lq0a9kuq8pvvldoqsa85lkbsp",
          name: "Single Event",
          startTime: "2020-05-26T03:00:00.000Z",
          endTime: "2020-05-26T04:00:00.000Z",
          changedEvents: [],
          cancelledEvents: [],
        },
      ],
    ];

    expect(JSON.stringify(output)).toEqual(JSON.stringify(expected));
  })

  test("Reoccurring Events with changed events", () => {
    
    let items = [
      {
        "id": "3d32n9p39gals8f6hdd9i7la0u",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=M2QzMm45cDM5Z2FsczhmNmhkZDlpN2xhMHVfMjAyMDA1MDVUMDMwMDAwWiByZzRtMGs2MDc2MDlyMmptZHI5N3Nqdmp1c0Bn",
        "summary": "Single Event",
        "start": {
          "dateTime": "2020-05-04T20:00:00-07:00",
          "timeZone": "America/Los_Angeles"
        },
        "end": {
          "dateTime": "2020-05-04T21:00:00-07:00",
          "timeZone": "America/Los_Angeles"
        },
        "recurrence": ["RRULE:FREQ=WEEKLY;WKST=SU;COUNT=3;BYDAY=MO"],
      },
      {
        "id": "3d32n9p39gals8f6hdd9i7la0u_20200512T030000Z",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=M2QzMm45cDM5Z2FsczhmNmhkZDlpN2xhMHVfMjAyMDA1MTJUMDMwMDAwWiByZzRtMGs2MDc2MDlyMmptZHI5N3Nqdmp1c0Bn",
        "summary": "Single Event",
        "start": {
          "dateTime": "2020-05-10T19:00:00-07:00",
          "timeZone": "America/Los_Angeles"
        },
        "end": {
          "dateTime": "2020-05-10T20:00:00-07:00",
          "timeZone": "America/Los_Angeles"
        },
        "recurringEventId": "3d32n9p39gals8f6hdd9i7la0u",
        "originalStartTime": {
          "dateTime": "2020-05-11T20:00:00-07:00",
          "timeZone": "America/Los_Angeles"
        },
      },
      {
        "id": "0uhol67ej05kdturjs7bpho0da",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=MHVob2w2N2VqMDVrZHR1cmpzN2JwaG8wZGFfMjAyMDA1MDYgcmc0bTBrNjA3NjA5cjJqbWRyOTdzanZqdXNAZw",
        "summary": "All Day Event",
        "start": { "date": "2020-05-06" },
        "end": { "date": "2020-05-07" },
        "recurrence": ["RRULE:FREQ=WEEKLY;WKST=SU;UNTIL=20200527;BYDAY=WE"],
      },
      {
        "id": "0uhol67ej05kdturjs7bpho0da_20200513",
        "status": "confirmed",
        "htmlLink": "https://www.google.com/calendar/event?eid=MHVob2w2N2VqMDVrZHR1cmpzN2JwaG8wZGFfMjAyMDA1MTMgcmc0bTBrNjA3NjA5cjJqbWRyOTdzanZqdXNAZw",
        "summary": "All Day Event",
        "start": { "date": "2020-05-19" },
        "end": { "date": "2020-05-20" },
        "recurringEventId": "0uhol67ej05kdturjs7bpho0da",
        "originalStartTime": { "date": "2020-05-13" },
      }
    ];

    let output = Calendar.processEvents(items, true);

    let expected = [
      [
        {
          "id": "0uhol67ej05kdturjs7bpho0da",
          "name": "All Day Event",
          "startTime": "2020-05-06T00:00:00.000Z",
          "endTime": "2020-05-07T00:00:00.000Z",
          "recurrence": ["RRULE:FREQ=WEEKLY;WKST=SU;UNTIL=20200527;BYDAY=WE"],
          "changedEvents": [
            {
              "recurringEventId": "0uhol67ej05kdturjs7bpho0da",
              "name": "All Day Event",
              "originalStartTime": "2020-05-13T00:00:00.000Z",
              "newStartTime": "2020-05-19T00:00:00.000Z",
              "newEndTime": "2020-05-20T00:00:00.000Z"
            }
          ],
          "cancelledEvents": []
        }
      ],
      [
        {
          "id": "3d32n9p39gals8f6hdd9i7la0u",
          "name": "Single Event",
          "startTime": "2020-05-05T03:00:00.000Z",
          "endTime": "2020-05-05T04:00:00.000Z",
          "recurrence": ["RRULE:FREQ=WEEKLY;WKST=SU;COUNT=3;BYDAY=MO"],
          "changedEvents": [
            {
              "recurringEventId": "3d32n9p39gals8f6hdd9i7la0u",
              "name": "Single Event",
              "originalStartTime": "2020-05-12T03:00:00.000Z",
              "newStartTime": "2020-05-11T02:00:00.000Z",
              "newEndTime": "2020-05-11T03:00:00.000Z"
            }
          ],
          "cancelledEvents": []
        }
      ]
    ];

    expect(JSON.stringify(output)).toEqual(JSON.stringify(expected));
  });

  test("Reoccurring Events with cancelled events", () => {
    let items = [
      {
        id: "2lq0a9kuq8pvvldoqsa85lkbsp",
        status: "confirmed",
        htmlLink: "https://www.google.com/calendar/event?eid=MmxxMGE5a3VxOHB2dmxkb3FzYTg1bGtic3BfMjAyMDA1MDVUMDMwMDAwWiByZzRtMGs2MDc2MDlyMmptZHI5N3Nqdmp1c0Bn",
        created: "2020-05-28T02:50:56.000Z",
        updated: "2020-05-28T03:09:26.832Z",
        summary: "Single Event",
        start: {
          dateTime: "2020-05-04T20:00:00-07:00",
          timeZone: "America/Los_Angeles",
        },
        end: {
          dateTime: "2020-05-04T21:00:00-07:00",
          timeZone: "America/Los_Angeles",
        },
        recurrence: ["RRULE:FREQ=WEEKLY;WKST=SU;COUNT=3;BYDAY=MO"],
      },
      {
        id: "3lve0jmikubq9ui98nakv2rus7",
        status: "confirmed",
        htmlLink: "https://www.google.com/calendar/event?eid=M2x2ZTBqbWlrdWJxOXVpOThuYWt2MnJ1czdfMjAyMDA1MDYgcmc0bTBrNjA3NjA5cjJqbWRyOTdzanZqdXNAZw",
        created: "2020-05-28T02:51:13.000Z",
        updated: "2020-05-28T03:09:43.600Z",
        summary: "All Day Event",
        start: { date: "2020-05-06" },
        end: { date: "2020-05-07" },
        recurrence: ["RRULE:FREQ=WEEKLY;WKST=SU;COUNT=4;BYDAY=WE"],
      },
      {
        id: "3lve0jmikubq9ui98nakv2rus7_20200513",
        status: "cancelled",
        recurringEventId: "3lve0jmikubq9ui98nakv2rus7",
        originalStartTime: { date: "2020-05-13" },
      },
      {
        id: "2lq0a9kuq8pvvldoqsa85lkbsp_20200512T030000Z",
        status: "cancelled",
        recurringEventId: "2lq0a9kuq8pvvldoqsa85lkbsp",
        originalStartTime: {
          dateTime: "2020-05-11T20:00:00-07:00",
          timeZone: "America/Los_Angeles",
        },
      },
      {
        id: "3lve0jmikubq9ui98nakv2rus7_20200527",
        status: "cancelled",
        recurringEventId: "3lve0jmikubq9ui98nakv2rus7",
        originalStartTime: { date: "2020-05-27" },
      },
    ];

    let output = Calendar.processEvents(items, true);

    let expected = [
      [
        {
          id: "3lve0jmikubq9ui98nakv2rus7",
          name: "All Day Event",
          startTime: "2020-05-06T00:00:00.000Z",
          endTime: "2020-05-07T00:00:00.000Z",
          recurrence: ["RRULE:FREQ=WEEKLY;WKST=SU;COUNT=4;BYDAY=WE"],
          changedEvents: [],
          cancelledEvents: [
            "2020-05-13T00:00:00.000Z",
            "2020-05-27T00:00:00.000Z",
          ],
        },
      ],
      [
        {
          id: "2lq0a9kuq8pvvldoqsa85lkbsp",
          name: "Single Event",
          startTime: "2020-05-05T03:00:00.000Z",
          endTime: "2020-05-05T04:00:00.000Z",
          recurrence: ["RRULE:FREQ=WEEKLY;WKST=SU;COUNT=3;BYDAY=MO"],
          changedEvents: [],
          cancelledEvents: ["2020-05-12T03:00:00.000Z"],
        },
      ],
    ];

    expect(JSON.stringify(output)).toEqual(JSON.stringify(expected));
  });

});