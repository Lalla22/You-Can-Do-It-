const { google } = require('googleapis')

const { OAuth2 } = google.auth

const oAuth2Client = new OAuth2('725875135322-ntvidf9jg41l9onofhqo593poaj22p6m.apps.googleusercontent.com', '8Xk0mAg8cyEXQIIPa-JNBIo8'
)

oAuth2Client.setCredentials({
  refresh_token: '1//04tbg88IcQwP6CgYIARAAGAQSNwF-L9IrfiSiGsVX1dECNHuA1QJcJ0vachpvhjPrhHyrameHpQJbly001jWyY3OZVN7Z5mmuVuA',
})

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

// Create a new event start date instance for temp uses in our calendar.
const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2)

// Create a new event end date instance for temp uses in our calendar.
const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 4)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

//dummy test event
const event = {
  summary: 'Task to be done',
  location: '515 Malcolm X Boulevard (135th St and, Malcolm X Blvd, New York, NY 10037',
  description: 'Daily Reminder to do task.',
  colorId: 1,
  start: {
    dateTime: eventStartTime,
    timeZone: 'America/New York',
  },
  end: {
    dateTime: eventEndTime,
    timeZone: 'America/New York',

  },

}


calendar.freebusy.query(
  {
    resource: {
      timeMin: eventStartTime,
      timeMax: eventEndTime,
      timeZone: 'America/New York',
      items: [{ id: 'primary' }],
    },
  },
  (err, res) => {
    if (err) return console.error('Free Busy Query Error: ', err)

    const eventArr = res.data.calendars.primary.busy

    // Check if event array is empty which means we are not busy
    if (eventArr.length === 0)
      // If we are not busy create a new calendar event.
      return calendar.events.insert(
        { calendarId: 'primary', resource: event },
        err => {
          // Check for errors and log them if they exist.
          if (err) return console.error('Error Creating Calender Event:', err)
          // Else log that the event was created.
          return console.log('Calendar event successfully created.')
        }
      )

    // If event array is not empty log that we are busy.
    return console.log(`Sorry I'm busy...`)

  }
)


