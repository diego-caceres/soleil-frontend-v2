import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getDocs, collection } from "firebase/firestore";

import { db } from "../../config/firebase";
import { SelectExhibit } from "../SelectExhibit";
import { CSVLink } from "react-csv";

import "./DownloadData.scss";
import { getDateStringFromTimestamp } from "src/utils";

const ALL_EVALUATORS_KEY = "All";

const csvHeaders = [
  "Coding Id",
  "Exhibit Name",
  "Evaluator Name",
  "Coded Date",
  "Coding Type",
  "Video Name",
  "Visitor Gender",
  "Visitor Type",
  "Visitor Age Range",
  "Visitor Type of Group",
  "Visitor Language",
  "Visitor Description",
  "Visitor Familiarity",
  "Visitor Education Level",
  "Facilitator Age Range",
  "Facilitator Gender",
  "Behavior Name",
  "Behavior Type",
  "Behavior Time Marked",
  "Behavior Time Ended",
  "Day Status",
  "Extra Observations",
];

const DownloadDataPage = () => {
  const [allCodings, setAllCodings] = useState([]);
  const [filteredCodings, setFilteredCodings] = useState([]);
  const [evaluatorNames, setEvaluatorNames] = useState([]);
  const [dataToDownload, setDataToDownload] = useState(null);
  const [selectedEvaluator, setSelectedEvaluator] =
    useState(ALL_EVALUATORS_KEY);

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selectedExhibit } = exhibitsStore;

  // Get all the codings
  useEffect(() => {
    async function fetchCodings() {
      const codingsCollection = collection(db, "codings");
      const codingsSnapshot = await getDocs(codingsCollection);
      const codingsData = codingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllCodings(codingsData);
    }

    fetchCodings();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedExhibit) {
      const filteredCodings = allCodings.filter(
        (coding) => coding.exhibitId === selectedExhibit.id
      );
      setFilteredCodings(filteredCodings);

      // Get a list of the evaluators name without duplicates
      const evaluatorNames = [];
      filteredCodings.forEach((coding) => {
        if (!evaluatorNames.includes(coding.evaluatorName)) {
          evaluatorNames.push(coding.evaluatorName);
        }
      });
      setEvaluatorNames([ALL_EVALUATORS_KEY, ...evaluatorNames]);
      setSelectedEvaluator(null);
    }
  }, [allCodings, selectedExhibit]);

  useEffect(() => {
    if (selectedExhibit) {
      const filterByExhibit = allCodings.filter(
        (coding) => coding.exhibitId === selectedExhibit.id
      );

      if (selectedEvaluator && selectedEvaluator !== ALL_EVALUATORS_KEY) {
        const filteredByName = filterByExhibit.filter(
          (coding) => coding.evaluatorName === selectedEvaluator
        );
        setFilteredCodings(filteredByName);
        setDataToDownload(null);
      } else if (selectedEvaluator === ALL_EVALUATORS_KEY) {
        setFilteredCodings(filterByExhibit);
        setDataToDownload(null);
      }
    }
  }, [allCodings, selectedExhibit, selectedEvaluator]);

  const handleCalculateData = () => {
    // We need to flatten the codings in an array
    const csvData = [];
    filteredCodings.forEach((coding) => {
      const {
        evaluatorName,
        codedDate,
        codingType,
        videoName,
        visitor,
        facilitator,
        dayStatus,
        extraObservations,
        codingBehaviors,
      } = coding;

      codingBehaviors.forEach((behavior) => {
        const { name, type, timeMarked, timeEnded } = behavior;

        csvData.push({
          "Coding Id": coding.id,
          "Exhibit Name": selectedExhibit.name,
          "Evaluator Name": evaluatorName,
          "Coded Date": getDateStringFromTimestamp(codedDate),
          "Coding Type": codingType,
          "Video Name": videoName,
          "Visitor Gender": visitor.gender,
          "Visitor Type": visitor.typeOfVisitor,
          "Visitor Age Range": visitor.ageRange,
          "Visitor Type of Group": visitor.typeOfGroup,
          "Visitor Language": visitor.language,
          "Visitor Description": visitor.description,
          "Visitor Familiarity": visitor.familiarity,
          "Visitor Education Level": visitor.educationLevel,
          "Facilitator Age Range": facilitator.ageRange,
          "Facilitator Gender": facilitator.gender,
          "Behavior Name": name,
          "Behavior Type": type,
          "Behavior Time Marked": timeMarked,
          "Behavior Time Ended": timeEnded,
          "Day Status": dayStatus,
          "Extra Observations": extraObservations,
        });
      });
    });

    setDataToDownload(csvData);
  };

  return (
    <div className="download-data-container">
      <span className="page-title">Download Data</span>
      <div className="initial-row">
        <>
          <div className="select-exhibit-row">
            <span className="option-title">Select exhibit</span>
            <SelectExhibit />
          </div>
        </>

        <div className="select-row">
          <span>Evaluator Name</span>
          {selectedExhibit && (
            <select
              value={selectedEvaluator}
              onChange={(optionValue) =>
                setSelectedEvaluator(optionValue.target.value)
              }
            >
              {evaluatorNames.map((name, index) => (
                <option key={`${name}_${index}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}
          {!selectedExhibit && <span>Select an exhibit first</span>}
        </div>
      </div>
      <div className="buttons-row">
        <span>Filtered Codings: {filteredCodings.length}</span>
        <button
          onClick={handleCalculateData}
          className="download-btn"
          disabled={dataToDownload !== null}
        >
          Calculate Download Data
        </button>
        {dataToDownload && (
          <CSVLink
            headers={csvHeaders}
            data={dataToDownload}
            filename={"soleil-export.csv"}
          >
            Download CSV
          </CSVLink>
        )}
      </div>
    </div>
  );
};

export default DownloadDataPage;
