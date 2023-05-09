import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Inject,
  ViewsDirective,
  ViewDirective,
} from '@syncfusion/ej2-react-schedule';

function App() {
  let scheduleObj;

  const [scheduleData, setScheduleData] = React.useState([]);

  const eventSettings = {
    dataSource: scheduleData,
    fields: {
      id: 'Id',
      subject: { name: 'Subject', default: 'New Event' },
      startTime: 'StartTime',
      endTime: 'EndTime',
      isAllDay: 'IsAllDay'
    }
  };

  React.useEffect(() => {
    // Load events from JSON file on component mount
    async function loadEvents() {
      try {
        const response = await fetch('/events.json');
        const data = await response.json();
        setScheduleData(data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    loadEvents();
  }, []);

  async function onActionComplete(args) {
    if (args.requestType === 'eventCreated') {
      // Get the added event data
      const addedEvent = args.data[0];

      const startTime = new Date(addedEvent.StartTime);
      const endTime = new Date(addedEvent.EndTime);
      addedEvent.StartTime = startTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      addedEvent.EndTime = endTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });

      console.log('Added event data:', addedEvent);
  
      try {
        const response = await fetch('https://ac6ff820-29e8-4a1a-8f04-ff038d9ca7e0.mock.pstmn.io/event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addedEvent),
        });
        if (response.ok) {
          const data = await response.json();
          // // Convert the dates back to local timezone format

          const responseData = {
            ...data,
            StartTime: new Date(data.StartTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            EndTime: new Date(data.EndTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
          };

  
          console.log('Data sent successfully:', data);

          setScheduleData([...scheduleData, addedEvent]);
        } else {
          console.error('Error sending data:', response.status);
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
    } else if (args.requestType === 'eventEdited') {
      // Get the edited event data
      const editedEvent = args.data[0];
  
      const startTime = new Date(editedEvent.StartTime);
      const endTime = new Date(editedEvent.EndTime);
      editedEvent.StartTime = startTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
      editedEvent.EndTime = endTime.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
  
      console.log('Edited event data:', editedEvent);
  
      try {
        const response = await fetch('https://ac6ff820-29e8-4a1a-8f04-ff038d9ca7e0.mock.pstmn.io/event', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedEvent),
        });
        if (response.ok) {
          const data = await response.json();
  
          const responseData = {
            ...data,
            StartTime: new Date(data.StartTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
            EndTime: new Date(data.EndTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
          };
  
          console.log('Data sent successfully:', data);
  
          // Find the index of the edited event in the scheduleData array
          const editedIndex = scheduleData.findIndex((event) => event.Id === editedEvent.Id);
  
          // If the index is found, update the event object
          if (editedIndex !== -1) {
            const updatedScheduleData = [...scheduleData];
            updatedScheduleData[editedIndex] = editedEvent;
            setScheduleData(updatedScheduleData);
          }
        } else {
          console.error('Error sending data:', response.status);
        }
      } catch (error) {
        console.error('Error sending data:', error);
      }
    }
  }

  return (
    <div className="options">
      <ScheduleComponent
        ref={(t) => (scheduleObj = t)}
        width="100%"
        height="550px"
        selectedDate={new Date()}
        eventSettings={eventSettings}
        actionComplete={onActionComplete}
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month]} />
      </ScheduleComponent>
    </div>
  );
}

export default App;
