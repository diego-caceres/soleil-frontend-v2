import React, { useState } from "react";
import { genderOptions, ageOptions, groupOptions } from "src/constants";

const SelectGroupCharacteristic = ({ group, setGroup }) => {
  const [gender, setGender] = useState("all");
  const [ageRange, setAgeRange] = useState("all");
  const [groupType, setGroupType] = useState("all");
  const [facilitator, setFacilitator] = useState("all");

  const genderOptionValues = [{ value: "all", label: "All" }, ...genderOptions];
  const ageOptionValues = [{ value: "all", label: "All" }, ...ageOptions];
  const groupOptionValues = [{ value: "all", label: "All" }, ...groupOptions];
  const facilitatorValues = [
    { value: "all", label: "All" },
    { value: true, label: "Yes" },
    { value: false, label: "No" },
  ];

  const handleGenderChange = (value) => {
    setGender(value);
    setGroup({
      gender: value,
      age: ageRange,
      group: groupType,
      facilitator: facilitator,
    });
  };

  const handleAgeRangeChange = (value) => {
    setAgeRange(value);
    setGroup({
      gender: gender,
      age: value,
      group: groupType,
      facilitator: facilitator,
    });
  };

  const handleGroupTypeChange = (value) => {
    setGroupType(value);
    setGroup({
      gender,
      age: ageRange,
      group: value,
      facilitator: facilitator,
    });
  };

  const handleFacilitatorChange = (value) => {
    setFacilitator(value);
    setGroup({
      gender,
      age: ageRange,
      group: groupType,
      facilitator: value,
    });
  };

  return (
    <div>
      <p>Group {group}</p>

      <div className="select-row">
        <span>Gender</span>
        <select
          onChange={(optionValue) =>
            handleGenderChange(optionValue.target.value)
          }
        >
          {genderOptionValues.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="select-row">
        <span>Age Range</span>
        <select
          onChange={(optionValue) =>
            handleAgeRangeChange(optionValue.target.value)
          }
        >
          {ageOptionValues.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="select-row">
        <span>Group Type</span>
        <select
          onChange={(optionValue) =>
            handleGroupTypeChange(optionValue.target.value)
          }
        >
          {groupOptionValues.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="select-row">
        <span>Facilitator</span>
        <select
          onChange={(optionValue) =>
            handleFacilitatorChange(optionValue.target.value)
          }
        >
          {facilitatorValues.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectGroupCharacteristic;
