import withReducer from 'app/redux/withReducer';
import { useDispatch, useSelector } from 'react-redux';
import reducer from 'app/redux/calendar';
import {
  getEvents,
  openEditEventDialog,
  openNewEventDialog,
  selectFilteredEvents,
  updateEvent,
} from 'app/redux/calendar/eventsSlice';
import { getLabels, selectLabels } from 'app/redux/calendar/labelsSlice';
import { getChats } from 'app/redux/chat/chatsSlice';
import {
  getItems,
  selectSelectedItem,
  selectSelectedButton,
  selectSelectedItemAEditar
} from 'app/redux/file-manager/itemsSlice';

function SamplePageApp(props) {
  const dispatch = useDispatch();
  const events = useSelector(selectFilteredEvents);
  const labels = useSelector(selectLabels);
  const selectedItem = useSelector(selectSelectedItem);
  const selectedButton = useSelector(selectSelectedButton);
  const selectedItemAEditar = useSelector(selectSelectedItemAEditar);

  //useEffect

  useEffect(() => {
    dispatch(getEvents());
    dispatch(getLabels());
  }, [dispatch]);

  //funciones

  const handleDateSelect = (selectInfo) => {
    const { start, end } = selectInfo;
    dispatch(openNewEventDialog(selectInfo));
  };

  const handleEventDrop = (eventDropInfo) => {
    const { id, title, allDay, start, end, extendedProps } = eventDropInfo.event;
    dispatch(
      updateEvent({
        id,
        title,
        allDay,
        start,
        end,
        extendedProps,
      })
    );
  };

  return (
    <></>
  );
}

export default withReducer('calendarApp', reducer)(SamplePageApp);
//export default withReducer('chatApp', reducer)(SamplePageApp);
//export default withReducer('fileManagerApp', reducer)(SamplePageApp);
