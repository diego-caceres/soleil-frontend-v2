export const toHHMMSS = (secondsValue) => {
  var sec_num = parseInt(secondsValue, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
};

export const getDateStringFromTimestamp = (timestamp) => {
  const date = new Date(timestamp.seconds * 1000);

  return `${date.toDateString()} ${date.toLocaleTimeString()}`;
};

export const calculateSimilarity = (
  behaviorA,
  behaviorB,
  deltaTime,
  ignoreTimeEnded
) => {
  if (
    behaviorA.name === behaviorB.name &&
    behaviorA.type === behaviorB.type &&
    Math.abs(behaviorA.timeMarked - behaviorB.timeMarked) <= deltaTime &&
    (ignoreTimeEnded ||
      behaviorA.timeEnded === null ||
      behaviorB.timeEnded === null ||
      Math.abs(behaviorA.timeEnded - behaviorB.timeEnded) <= deltaTime)
  ) {
    return 1; // Behaviors are similar
  }
  return 0; // Behaviors are not similar
};

export const calculateIntercoderSimilarity = (codingA, codingB) => {
  debugger;

  let behaviorANames = [];
  let codingABehaviorsFiltered = codingA.codingBehaviors.map((behavior) => {
    if (!behaviorANames.includes(behavior.name)) {
      behaviorANames.push(behavior.name);
      return true;
    }
    return false;
  });

  let behaviorBNames = [];
  let codingBBehaviorsFiltered = codingB.codingBehaviors.map((behavior) => {
    if (!behaviorBNames.includes(behavior.name)) {
      behaviorBNames.push(behavior.name);
      return true;
    }
    return false;
  });

  const totalBehaviorsA = codingABehaviorsFiltered.length;
  const totalBehaviorsB = codingBBehaviorsFiltered.length;
  let totalSimilarity = 0;

  for (const behaviorA of codingABehaviorsFiltered) {
    if (codingBBehaviorsFiltered.some((cb) => cb.name === behaviorA.name)) {
      totalSimilarity += 1;
    }
  }

  const intercoderSimilarity =
    (totalSimilarity * 100) / Math.max(totalBehaviorsA, totalBehaviorsB);

  return parseFloat(intercoderSimilarity.toFixed(2));
};

// export const calculateIntercoderSimilarity = (
//   codingA,
//   codingB,
//   deltaTime,
//   ignoreTimeEnded = false
// ) => {
//   debugger;
//   const totalBehaviorsA = codingA.codingBehaviors.length;
//   const totalBehaviorsB = codingB.codingBehaviors.length;
//   let totalSimilarity = 0;

//   for (const behaviorA of codingA.codingBehaviors) {
//     for (const behaviorB of codingB.codingBehaviors) {
//       totalSimilarity += calculateSimilarity(
//         behaviorA,
//         behaviorB,
//         deltaTime,
//         ignoreTimeEnded
//       );
//     }
//   }

//   const intercoderSimilarity =
//     (totalSimilarity * 100) / Math.max(totalBehaviorsA, totalBehaviorsB);

//   return parseFloat(intercoderSimilarity.toFixed(2));
// };

export const isSimilar = (behavior, behaviorList, deltaTime) => {
  for (const otherBehavior of behaviorList) {
    if (calculateSimilarity(behavior, otherBehavior, deltaTime) === 1) {
      return true;
    }
  }
  return false;
};

export const findSimilarBehavior = (behavior, behaviorList, deltaTime) => {
  for (const otherBehavior of behaviorList) {
    if (calculateSimilarity(behavior, otherBehavior, deltaTime) === 1) {
      return `${otherBehavior.name} - ${otherBehavior.type} - [${otherBehavior.timeMarked} to ${otherBehavior.timeEnded}]`;
    }
  }
  return "No similar behavior found";
};
