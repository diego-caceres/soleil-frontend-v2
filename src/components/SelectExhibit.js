import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import { selectExhibit, loadExhibits } from "src/redux/exhibits";
import { loadBehaviors } from "src/redux/behaviors";

export const SelectExhibit = () => {
  const dispatch = useDispatch();
  const exhibitsStore = useSelector((state) => state.exhibits);
  const { list: exhibitsList, selectedExhibit } = exhibitsStore;

  const [exhibitOptions, setExhibitOptions] = useState([]);

  let currentExhibitOption = null;
  if (selectedExhibit) {
    currentExhibitOption = {
      value: selectedExhibit.id,
      label: selectedExhibit.name,
    };
  }

  // componentDidMount
  useEffect(() => {
    dispatch(loadExhibits());
    dispatch(loadBehaviors());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (exhibitsList && exhibitsList.length > 0) {
      const exhibits = exhibitsList.map((exhibit) => ({
        value: exhibit.id,
        label: exhibit.name,
      }));
      setExhibitOptions(exhibits);
    }
  }, [exhibitsList]);

  const handleExhibitChange = ({ value }) => {
    const exhibit = exhibitsList.find((e) => e.id === value);
    if (exhibit) {
      dispatch(selectExhibit({ exhibit }));
    }
  };

  return (
    <div className="selects-container">
      <Select
        placeholder="Select exhibit"
        options={exhibitOptions}
        value={currentExhibitOption}
        onChange={handleExhibitChange}
      />
    </div>
  );
};
