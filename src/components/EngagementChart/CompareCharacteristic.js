import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { ResponsiveBar } from "@nivo/bar";
import { db } from "../../config/firebase";

function GenericComparisonChart() {
  const [codings, setCodings] = useState([]);
  const [selectedCharacteristic, setSelectedCharacteristic] =
    useState("gender"); // Default selected characteristic

  useEffect(() => {
    async function fetchCodings() {
      const codingsCollection = collection(db, "codings");
      const codingsSnapshot = await getDocs(codingsCollection);
      const codingsData = codingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCodings(codingsData);
    }

    fetchCodings();
  }, []);

  // Get unique values of the selected characteristic
  const getCharacteristicValues = () => {
    const values = new Set();

    for (const coding of codings) {
      const characteristic = coding.visitor[selectedCharacteristic];
      values.add(characteristic);
    }

    return Array.from(values);
  };

  // Calculate the percentage of each gender group that reached each coding level
  const calculatePercentageData = (characteristicValues) => {
    const genderGroupData = {
      Initiation: {},
      Transition: {},
      Breakthrough: {},
    };

    for (const coding of codings) {
      const characteristic = coding.visitor[selectedCharacteristic];
      const codingLevel = calculateCodingLevel(coding.codingBehaviors);

      if (!characteristicValues.includes(characteristic)) {
        continue; // Skip if the characteristic value is not selected
      }

      if (!genderGroupData[codingLevel][characteristic]) {
        genderGroupData[codingLevel][characteristic] = 0;
      }

      genderGroupData[codingLevel][characteristic]++;
    }

    for (const value of characteristicValues) {
      // Calculate percentages within the gender group
      const total = Object.values(genderGroupData).reduce(
        (acc, val) => acc + val[value],
        0
      );
      for (const level of ["Initiation", "Transition", "Breakthrough"]) {
        if (genderGroupData[level] !== undefined) {
          genderGroupData[level][value] = (
            (genderGroupData[level][value] / total) *
            100
          ).toFixed(1);
        }
      }
    }

    return genderGroupData;
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

  const handleCharacteristicChange = (event) => {
    setSelectedCharacteristic(event.target.value);
  };

  const characteristicValues = getCharacteristicValues();
  const percentageData = calculatePercentageData(characteristicValues);

  const data = Object.keys(percentageData).map((key) => {
    return {
      category: key,
      ...percentageData[key],
    };
  });

  console.log("percentageData", percentageData);
  console.log("data", data);

  const format = (v) => `${v}%`;

  return (
    <div>
      <h1>Visitor Engagement Profile</h1>
      <label>Select Comparing Characteristic:</label>
      <select
        value={selectedCharacteristic}
        onChange={handleCharacteristicChange}
      >
        <option value="gender">Gender</option>
        <option value="ageRange">Age Range</option>
        <option value="typeOfGroup">Type of Group</option>
      </select>
      <div style={{ width: "100%", height: "800px" }}>
        <ResponsiveBar
          data={data}
          keys={characteristicValues}
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
    </div>
  );
}

// function CustomBar(props) {
//   const { x, y, width, height, color, label } = props;
//   const formattedLabel = `${label} %`;

//   return (
//     <g transform={`translate(${x},${y})`}>
//       <rect width={width} height={height} fill={color} />
//       <text
//         x={width / 2}
//         y={height / 2}
//         textAnchor="middle"
//         dominantBaseline="middle"
//         fill="white"
//         fontSize={12}
//       >
//         {formattedLabel}
//       </text>
//     </g>
//   );
// }

export default GenericComparisonChart;
