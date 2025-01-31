import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { ResponsiveBar } from "@nivo/bar";
import Statistics from "statistics.js";
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
  const [chartKeys, setChartKeys] = useState(["Group A", "Group B", "Group C"]);
  const [groupA, setGroupA] = useState(null);
  const [groupB, setGroupB] = useState(null);
  const [groupC, setGroupC] = useState(null);
  const [errorA, setErrorA] = useState("");
  const [errorB, setErrorB] = useState("");
  const [errorC, setErrorC] = useState("");
  const [data, setData] = useState(null);

  const [chiSquared, setChiSquared] = useState("");
  const [kendallsData, setKendallsData] = useState("");

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

  const calculateChiSquared = () => {
    let chiData = [];

    for (const coding of codings) {
      const codingLevel = calculateCodingLevel(coding.codingBehaviors);
      const isGroupA = isCodingInGroup(coding, groupA);
      const isGroupB = isCodingInGroup(coding, groupB);

      if (isGroupA) {
        chiData.push({
          codingLevel: codingLevel,
          group: "A",
        });
      } else if (isGroupB) {
        chiData.push({
          codingLevel: codingLevel,
          group: "B",
        });
      }
    }

    const testVars = {
      group: {
        scale: "nominal",
        valueMap: ["A", "B"],
      },
      codingLevel: {
        scale: "ordinal",
        valueMap: ["Initiation", "Transition", "Breakthrough"],
      },
    };

    const stats = new Statistics(chiData, testVars);
    const chiSquareAux = stats.chiSquaredTest("group", "codingLevel");
    setChiSquared(JSON.stringify(chiSquareAux));
    console.log("ChiSquared", chiSquareAux);
  };

  const calculateKendallsTau = () => {
    let kendallsData = [];
    for (const coding of codings) {
      const codingLevel = calculateCodingLevel(coding.codingBehaviors);
      const isGroupA = isCodingInGroup(coding, groupA);
      const isGroupB = isCodingInGroup(coding, groupB);

      const codingLevelNumber =
        codingLevel === "Initiation" ? 0 : codingLevel === "Transition" ? 1 : 2;
      const groupNumber = isGroupA ? 0 : 1;
      kendallsData.push({
        group: groupNumber,
        codingLevel: codingLevelNumber,
      });
    }

    const testVars = { group: "ordinal", codingLevel: "ordinal" };

    const stats = new Statistics(kendallsData, testVars);
    const kendall = stats.kendallsTau("group", "codingLevel");

    console.log("Kendall", kendall);
    setKendallsData(JSON.stringify(kendall.b));
  };

  // Calculate the percentage of each group that reached each coding level
  const calculatePercentageData = () => {
    const codingsGroupData = {
      Initiation: {
        ["Group A"]: 0,
        ["Group B"]: 0,
        ["Group C"]: 0,
      },
      Transition: {
        ["Group A"]: 0,
        ["Group B"]: 0,
        ["Group C"]: 0,
      },
      Breakthrough: {
        ["Group A"]: 0,
        ["Group B"]: 0,
        ["Group C"]: 0,
      },
    };

    for (const coding of codings) {
      const codingLevel = calculateCodingLevel(coding.codingBehaviors);
      // Group A
      if (groupA && isCodingInGroup(coding, groupA)) {
        codingsGroupData[codingLevel]["Group A"]++;
      }

      if (groupB && isCodingInGroup(coding, groupB)) {
        codingsGroupData[codingLevel]["Group B"]++;
      }

      if (groupC && isCodingInGroup(coding, groupC)) {
        codingsGroupData[codingLevel]["Group C"]++;
      }
    }

    // Calculate percentages within each group
    for (const group of ["Group A", "Group B", "Group C"]) {
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
          if (groupB && group === "Group B")
            setErrorB(`No matches for ${group}. `);
          if (groupC && group === "Group C")
            setErrorC(`No matches for ${group}. `);
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

  // Refresh chart when pressing Generate
  const onGenerateClicked = () => {
    // Tiene que haber al menos una Exhibit y un Grupo seleccionado
    if (selectedExhibit && groupA) {
      setErrorA("");
      setErrorB("");
      setErrorC("");
      updateChartBarKeys();

      if (groupB && !groupC) {
        calculateChiSquared();
        calculateKendallsTau();
      }

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
  };

  const updateChartBarKeys = () => {
    const keys = [];
    if (groupA) {
      keys.push("Group A");
    }
    if (groupB) {
      keys.push("Group B");
    }
    if (groupC) {
      keys.push("Group C");
    }

    setChartKeys(keys);
  };

  return (
    <div className="engagement-chart-container">
      <span className="page-title">Visitor Engagement Profile</span>

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
          <SelectGroupCharacteristic group="C" setGroup={setGroupC} />
        </div>

        <div>
          {errorA}
          {errorB}
          {errorC}
        </div>
      </div>
      <div className="btn-generate-container">
        <button
          onClick={onGenerateClicked}
          disabled={!selectedExhibit || !groupA}
        >
          Generate
        </button>
      </div>

      {data && (
        <>
          {codings.length > 0 ? (
            <>
              <div
                style={{
                  width: "90%",
                  height: "500px",
                  backgroundColor: "white",
                  margin: "auto",
                }}
              >
                <ResponsiveBar
                  data={data}
                  keys={chartKeys}
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
              {chiSquared && (
                <div>
                  VEP - ChiSquaredTest
                  <div>Result: {chiSquared}</div>
                </div>
              )}
              {kendallsData && (
                <div>
                  VEP - KendallsTau B<div>Result: {kendallsData}</div>
                </div>
              )}
            </>
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
