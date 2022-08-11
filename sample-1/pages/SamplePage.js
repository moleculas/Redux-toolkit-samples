import { useDispatch, useSelector } from '../../redux/store';
import { getProducts, filterProducts } from '../../redux/slices/product';
import { getProduct, addCart, onGotoStep } from '../../redux/slices/product';
import { getEvents, openModal, closeModal, updateEvent, selectEvent, selectRange } from '../../redux/slices/calendar';
import { getConversations, getContacts } from '../../redux/slices/chat';
import { getCart, createBilling } from '../../redux/slices/product';
import { getBoard, persistColumn, persistCard } from '../../redux/slices/kanban';
import { getLabels } from '../../redux/slices/mail';


export default function SamplePage() {
  const dispatch = useDispatch();
  const { products, sortBy, filters } = useSelector((state) => state.product);   
  const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);
  const { checkout } = useSelector((state) => state.product);
  const { cart, billing, activeStep } = checkout;
  const { board } = useSelector((state) => state.kanban);

  //useEffect

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts(values));
  }, [dispatch, values]);

  //funciones

  const selectedEventSelector = (state) => {
    const { events, selectedEventId } = state.calendar;
    if (selectedEventId) {
      return events.find((_event) => _event.id === selectedEventId);
    }
    return null;
  };
  const selectedEvent = useSelector(selectedEventSelector);

  dispatch(persistColumn(newColumnOrder));


  return (<></>);
}
