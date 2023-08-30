import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";
import { ResponsiveBar } from "@nivo/bar";

const engagementOrder = [
  "1- Doing the activity",
  "2- Observing the activity",
  "3- Repeating the activity",
  "4- Positive emotional response",
  "5- Past Experiences",
  "6- Seeking and sharing information",
  "7- Engaged and involved",
];

function EngagementChart() {
  const [codings, setCodings] = useState([]);

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

  const calculateEngagementLevel = (codingBehaviors) => {
    let maxEngagementLevel = -1;
    for (const behavior of codingBehaviors) {
      const behaviorIndex = engagementOrder.indexOf(behavior.name);
      if (behaviorIndex > maxEngagementLevel) {
        maxEngagementLevel = behaviorIndex;
      }
    }
    return maxEngagementLevel + 1;
  };

  // Calculate aggregated engagement data per visitor grouping
  const aggregateEngagementData = () => {
    const groupedEngagementData = {};
    const groupedEngagementData2 = {
      initiation: {
        group: "initiaton",
        value: 60,
      },
      transition: {
        group: "transition",
        value: 15,
      },
      breaktrough: {
        group: "breaktrough",
        value: 25,
      },
    };

    // let codingsFemale = codings.filter((c) => c.visitor.gender === "female");

    for (const coding of codings) {
      const { ageRange, gender, typeOfGroup } = coding.visitor;
      const engagementLevel = calculateEngagementLevel(coding.codingBehaviors);

      const visitorGroup = `${ageRange}-${gender}-${typeOfGroup}`;
      if (!groupedEngagementData[visitorGroup]) {
        groupedEngagementData[visitorGroup] = {
          group: visitorGroup,
          value: engagementLevel,
          // count: 1,
        };
      } else {
        if (groupedEngagementData[visitorGroup].value < engagementLevel) {
          groupedEngagementData[visitorGroup].value = engagementLevel;
        }
        // groupedEngagementData[visitorGroup].value += engagementLevel;
        // groupedEngagementData[visitorGroup].count += 1;
      }
    }

    const filteredEngagementData = Object.values(groupedEngagementData).filter(
      (group) => group.value > 0
    );

    console.log("engagementChartData 1", filteredEngagementData);
    console.log("engagementChartData 2 ", groupedEngagementData2);

    const filteredEngagementData2 = Object.values(groupedEngagementData2);

    return filteredEngagementData2;
    // return groupedEngagementData2;

    // Calculate average engagement level
    // for (const group of Object.keys(groupedEngagementData)) {
    //   if (groupedEngagementData[group].count > 0) {
    //     groupedEngagementData[group].value /=
    //       groupedEngagementData[group].count;
    //   } else {
    //     groupedEngagementData[group].value = 0;
    //   }
    // }

    // return Object.values(groupedEngagementData);
  };

  // Prepare the data for the bar chart
  // Example: { id: 'Male', group: 'Gender', value: 3 }
  // This indicates that visitors with 'Male' gender reached an engagement level of 3 on average
  const engagementChartData = aggregateEngagementData();

  return (
    <div>
      <h1>Engagement Chart</h1>
      <div style={{ width: "100%", height: "800px" }}>
        <ResponsiveBar
          data={engagementChartData}
          keys={["value"]}
          indexBy="group"
          margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
          // Configure other Nivo bar chart settings here
        />
      </div>
    </div>
  );
}

export default EngagementChart;
