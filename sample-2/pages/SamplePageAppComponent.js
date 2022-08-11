import { useDispatch, useSelector } from 'react-redux';
import {
    openLabelsDialog,
    selectLabels,
    selectSelectedLabels,
    toggleSelectedLabels,
} from 'app/redux/calendar/labelsSlice';
import { selectUser, updateUserData } from 'app/redux/chat/userSlice';


function SamplePageAppComponent(props) {
    const dispatch = useDispatch();
    const labels = useSelector(selectLabels);
    const selectedLabels = useSelector(selectSelectedLabels);
    const user = useSelector(selectUser);

    //useEffect

    useEffect(() => {
        reset(user);
    }, [reset, user]);

    //funciones

    function onSubmit(data) {
        dispatch(updateUserData(data));
      };

    dispatch(toggleSelectedLabels(label.id));

    return (
        <></>
    );
}

export default SamplePageAppComponent;
