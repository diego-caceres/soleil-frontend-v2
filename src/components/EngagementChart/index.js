import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { ResponsiveBar } from "@nivo/bar";
import { useSelector } from "react-redux";

import { db } from "../../config/firebase";
import SelectGroupCharacteristic from "./SelectGroupCharacteristic";
import { SelectExhibit } from "../SelectExhibit";
import "./EngagementChart.scss";

// Determine if a Coding is included in a defined group
const isCodingInGroup = (coding, group) => {
  let isInGroup = true;

  if (group.gender !== "all" && coding.visitor.gender !== group.gender) {
    isInGroup = false;
  } else if (group.age !== "all" && coding.visitor.ageRange !== group.age) {
    isInGroup = false;
  } else if (
    group.group !== "all" &&
    coding.visitor.typeOfGroup !== group.group
  ) {
    isInGroup = false;
  } else if (
    group.facilitator !== "all" &&
    `${coding.showFacilitator}` !== `${group.facilitator}`
  ) {
    isInGroup = false;
  }

  return isInGroup;
};

function GenericComparisonChart() {
  const [codings, setCodings] = useState([]);
  const [groupA, setGroupA] = useState(null);
  const [groupB, setGroupB] = useState(null);
  const [errorA, setErrorA] = useState("");
  const [errorB, setErrorB] = useState("");
  const [data, setData] = useState(null);

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { selectedExhibit } = exhibitsStore;

  // Get all the codings as the component renders the first time
  useEffect(() => {
    async function fetchCodings() {
      const codingsCollection = collection(db, "codings");
      const codingsSnapshot = await getDocs(codingsCollection);
      const codingsData = codingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredCodings = codingsData.filter(
        (coding) => coding.exhibitId === selectedExhibit.id
      );
      setCodings(filteredCodings);
    }

    if (selectedExhibit) {
      fetchCodings();
    }
  }, [selectedExhibit]);

  // Refresh chart when selecting values
  useEffect(() => {
    if (selectedExhibit && groupA && groupB) {
      setErrorA("");
      setErrorB("");
      const percentageData = calculatePercentageData();
      console.log("percentageData", percentageData);

      const dataForChart = Object.keys(percentageData).map((key) => {
        return {
          category: key,
          ...percentageData[key],
        };
      });
      console.log("dataForChart", dataForChart);
      setData(dataForChart);
    }
  }, [selectedExhibit, groupA, groupB]);

  // Calculate the percentage of each group that reached each coding level
  const calculatePercentageData = () => {
    const codingsGroupData = {
      Initiation: {
        ["Group A"]: 0,
        ["Group B"]: 0,
      },
      Transition: {
        ["Group A"]: 0,
        ["Group B"]: 0,
      },
      Breakthrough: {
        ["Group A"]: 0,
        ["Group B"]: 0,
      },
    };

    for (const coding of codings) {
      const codingLevel = calculateCodingLevel(coding.codingBehaviors);
      // Group A
      if (isCodingInGroup(coding, groupA)) {
        codingsGroupData[codingLevel]["Group A"]++;
      }

      if (isCodingInGroup(coding, groupB)) {
        codingsGroupData[codingLevel]["Group B"]++;
      }
    }

    // Calculate percentages within each group
    for (const group of ["Group A", "Group B"]) {
      const total = Object.values(codingsGroupData).reduce(
        (acc, val) => acc + val[group],
        0
      );
      for (const level of ["Initiation", "Transition", "Breakthrough"]) {
        if (codingsGroupData[level] !== undefined && total !== 0) {
          codingsGroupData[level][group] = (
            (codingsGroupData[level][group] / total) *
            100
          ).toFixed(1);
        } else {
          codingsGroupData[level][group] = 0;
          if (group === "Group A") setErrorA(`No matches for ${group}. `);
          if (group === "Group B") setErrorB(`No matches for ${group}. `);
        }
      }
    }

    return codingsGroupData;
  };

  const calculateCodingLevel = (codingBehaviors) => {
    if (codingBehaviors.some((behavior) => behavior.type === "Breakthrough")) {
      return "Breakthrough";
    } else if (
      codingBehaviors.some((behavior) => behavior.type === "Transition")
    ) {
      return "Transition";
    } else {
      return "Initiation";
    }
  };

  const format = (v) => `${v}%`;

  return (
    <div className="engagement-chart-container">
      <span className="page-title">Generic Comparison Chart</span>

      <div className="initial-row">
        <>
          <div className="select-exhibit-row">
            <span className="option-title">Select exhibit</span>
            <SelectExhibit />
          </div>

          <span>Codings in the selected Exhibit: {codings.length}</span>
        </>

        <div className="select-groups-row">
          <SelectGroupCharacteristic group="A" setGroup={setGroupA} />
          <SelectGroupCharacteristic group="B" setGroup={setGroupB} />
        </div>

        <div>
          {errorA}
          {errorB}
        </div>
      </div>

      {data && (
        <>
          {codings.length > 0 ? (
            <div
              style={{
                width: "100%",
                height: "800px",
                backgroundColor: "white",
              }}
            >
              <ResponsiveBar
                data={data}
                keys={["Group A", "Group B"]}
                indexBy="category"
                margin={{ top: 20, right: 30, bottom: 150, left: 50 }}
                groupMode="grouped"
                // barComponent={CustomBar}
                // labelFormat={format}
                // tooltipFormat={format}
                label={(d) => `${d.value} %`}
                maxValue={100}
                legends={[
                  {
                    dataFrom: "keys",
                    anchor: "bottom",
                    direction: "row",
                    translateY: 80,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemsSpacing: 2,
                    symbolSize: 20,
                  },
                ]}
                // Configure other Nivo bar chart settings here
              />
            </div>
          ) : (
            <p>No codings in this exhibit</p>
          )}
        </>
      )}
    </div>
  );
}

function CustomBar(props) {
  const { x, y, width, height, color, label } = props;
  debugger;
  const formattedLabel = `${label} %`;

  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={width} height={height} fill={color} />
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={12}
      >
        {formattedLabel}
      </text>
    </g>
  );
}

export default GenericComparisonChart;
