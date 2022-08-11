import { useDispatch, useSelector } from 'react-redux';
import { selectFlatNavigation } from 'app/redux/fuse/navigationSlice';
import { selectUserShortcuts, updateUserShortcuts } from 'app/redux/userSlice';

function SamplePage(props) {
  const dispatch = useDispatch();
  const shortcuts = useSelector(selectUserShortcuts) || [];
  const navigation = useSelector(selectFlatNavigation);

  function handleShortcutsChange(newShortcuts) {
    dispatch(updateUserShortcuts(newShortcuts));
  }

  return (
    <FuseShortcuts
      className={className}
      variant={variant}
      navigation={navigation}
      shortcuts={shortcuts}
      onChange={handleShortcutsChange}
    />
  );
}

export default SamplePage;