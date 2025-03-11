import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase";

import Select from "react-select";

import { loadExhibits } from "src/redux/exhibits";
import { loadBehaviors } from "src/redux/behaviors";

import "./intercoder.css";

const behaviorTypesEnum = {
  confort: "Confort",
  exhibitUse: "Exhibit Use",
  reflection: "Reflection",
  information: "Information",
};

function InterCoder() {
  const dispatch = useDispatch();
  const [codings, setCodings] = useState([]);
  const [codingsA, setCodingsA] = useState([]);
  const [codingsB, setCodingsB] = useState([]);

  const [coderNames, setCoderNames] = useState([]);

  const [evaluatorNameA, setEvaluatorNameA] = useState("");
  const [evaluatorNameB, setEvaluatorNameB] = useState("");

  const [exhibitOptions, setExhibitOptions] = useState([]);
  const [selectedExhibits, setSelectedExhibits] = useState([]);

  const [uniqueVideoNamesDebug, setUniqueVideoNamesDebug] = useState([]);
  const [behaviorsWithKappa, setBehaviosWithKappa] = useState([]);
  const [confortRow, setConfortRow] = useState([]);
  const [exhibitUseRow, setExhibitUseRow] = useState([]);
  const [reflectionRow, setReflectionRow] = useState([]);
  const [informationRow, setInformationRow] = useState([]);

  const exhibitsStore = useSelector((state) => state.exhibits);
  const { list: exhibitsList } = exhibitsStore;
  const behaviorsStore = useSelector((state) => state.behaviors);
  const { facilitatorBehaviors } = behaviorsStore;

  // const [codingA, setCodingA] = useState("");
  // const [codingB, setCodingB] = useState("");

  useEffect(() => {
    async function fetchCodings() {
      const codingsCollection = collection(db, "codings");
      const codingsSnapshot = await getDocs(codingsCollection);
      const codingsData = codingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCodings(codingsData);

      const uniqueCoderNames = Array.from(
        new Set(codingsData.map((coding) => coding.evaluatorName))
      );
      setCoderNames(uniqueCoderNames);
    }

    fetchCodings();
    dispatch(loadExhibits());
    dispatch(loadBehaviors());
    //eslint-disable-next-line react-hooks/exhaustive-deps
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

  useEffect(() => {
    // Get all codings that have been coded by both coders
    if (evaluatorNameA) {
      let codingsAfiltered = codings.filter(
        (coding) => coding.evaluatorName === evaluatorNameA
      );

      setCodingsA(codingsAfiltered);
    }
    if (evaluatorNameB) {
      let codingsBfiltered = codings.filter(
        (coding) => coding.evaluatorName === evaluatorNameB
      );
      setCodingsB(codingsBfiltered);
    }
  }, [codings, evaluatorNameA, evaluatorNameB]);

  useEffect(() => {
    if (codingsA.length > 0 && codingsB.length > 0 && exhibitsList.length > 0) {
      // Filter exhibits that are in codingsA and codingsB
      const exhibitsA = codingsA.map((coding) => coding.exhibitId);
      const exhibitsB = codingsB.map((coding) => coding.exhibitId);
      const filteredExibitsList = exhibitsList.filter((exhibit) => {
        return exhibitsA.includes(exhibit.id) && exhibitsB.includes(exhibit.id);
      });
      const exhibits = filteredExibitsList.map((exhibit) => ({
        value: exhibit.id,
        label: exhibit.name,
      }));
      setExhibitOptions(exhibits);
    }
  }, [exhibitsList, codingsA, codingsB]);

  const handleCoderASelect = (event) => {
    const selectedCoderName = event.target.value;
    setEvaluatorNameA(selectedCoderName);
  };

  const handleCoderBSelect = (event) => {
    const selectedCoderName = event.target.value;
    setEvaluatorNameB(selectedCoderName);
  };

  const handleCalculateClick = () => {
    let auxCodingsA = [...codingsA];
    let auxCodingsB = [...codingsB];

    debugger;
    // If selected Exhibits, filter exhibits:
    if (selectedExhibits.length > 0) {
      auxCodingsA = auxCodingsA.filter((coding) =>
        selectedExhibits.some((e) => e.value === coding.exhibitId)
      );

      auxCodingsB = auxCodingsB.filter((coding) =>
        selectedExhibits.some((e) => e.value === coding.exhibitId)
      );
    }

    // Get the intersection of the two codings by video name
    let codingsByBoth = [
      ...auxCodingsA.filter((codingA) =>
        auxCodingsB.some((codingB) => codingA.videoName === codingB.videoName)
      ),
      ...auxCodingsB.filter((codingB) =>
        auxCodingsA.some((codingA) => codingB.videoName === codingA.videoName)
      ),
    ];

    const uniqueVideoNames = Array.from(
      new Set(codingsByBoth.map((coding) => coding.videoName))
    );

    console.log("Codings evaluated by both:", codingsByBoth);
    console.log("uniqueVideoNames:", uniqueVideoNames);
    setUniqueVideoNamesDebug(uniqueVideoNames);

    if (facilitatorBehaviors) {
      let behaviorsToValidate = [];

      facilitatorBehaviors.forEach((behavior) => {
        behaviorsToValidate.push({
          name: behavior.name,
          id: behavior.id,
          type: behavior.type,
          coder1: [],
          coder2: [],
          isCategory: false,
        });
      });

      // Now we add the categories
      behaviorsToValidate.push({
        name: "Comfort",
        type: "Confort",
        id: "confort",
        coder1: [],
        coder2: [],
        isCategory: true,
      });
      behaviorsToValidate.push({
        name: "Exhibit Use",
        type: "Exhibit Use",
        id: "exhibit-use",
        coder1: [],
        coder2: [],
        isCategory: true,
      });
      behaviorsToValidate.push({
        name: "Reflection",
        type: "Reflection",
        id: "reflection",
        coder1: [],
        coder2: [],
        isCategory: true,
      });
      behaviorsToValidate.push({
        name: "Information",
        type: "Information",
        id: "information",
        coder1: [],
        coder2: [],
        isCategory: true,
      });

      // We loop each video and check
      uniqueVideoNames.forEach((videoName) => {
        const codingCoder1 = codingsByBoth.find(
          (coding) =>
            coding.videoName === videoName &&
            coding.evaluatorName === evaluatorNameA
        );
        const codingCoder2 = codingsByBoth.find(
          (coding) =>
            coding.videoName === videoName &&
            coding.evaluatorName === evaluatorNameB
        );

        if (!codingCoder1 || !codingCoder2) {
          debugger;
        }

        let confortCoder1 = false;
        let exhibitUseCoder1 = false;
        let reflectionCoder1 = false;
        let informationCoder1 = false;

        let confortCoder2 = false;
        let exhibitUseCoder2 = false;
        let reflectionCoder2 = false;
        let informationCoder2 = false;

        behaviorsToValidate.forEach((behavior) => {
          if (!behavior.isCategory) {
            // Coding behaviors that are not categories
            const codingBehavior1 = codingCoder1.codingBehaviors.find(
              (codingBehavior) => codingBehavior.id === behavior.id
            );

            const codingBehavior2 = codingCoder2.codingBehaviors.find(
              (codingBehavior) => codingBehavior.id === behavior.id
            );

            behavior.coder1.push({
              videoName: videoName,
              found: codingBehavior1 ? true : false,
            });
            if (codingBehavior1) {
              if (
                codingBehavior1.type === behaviorTypesEnum.confort &&
                !confortCoder1
              ) {
                confortCoder1 = true;
              }
              if (
                codingBehavior1.type === behaviorTypesEnum.exhibitUse &&
                !exhibitUseCoder1
              ) {
                exhibitUseCoder1 = true;
              }
              if (
                codingBehavior1.type === behaviorTypesEnum.reflection &&
                !reflectionCoder1
              ) {
                reflectionCoder1 = true;
              }
              if (
                codingBehavior1.type === behaviorTypesEnum.information &&
                !informationCoder1
              ) {
                informationCoder1 = true;
              }
            }

            behavior.coder2.push({
              videoName: videoName,
              found: codingBehavior2 ? true : false,
            });
            if (codingBehavior2) {
              if (
                codingBehavior2.type === behaviorTypesEnum.confort &&
                !confortCoder2
              ) {
                confortCoder2 = true;
              }
              if (
                codingBehavior2.type === behaviorTypesEnum.exhibitUse &&
                !exhibitUseCoder2
              ) {
                exhibitUseCoder2 = true;
              }
              if (
                codingBehavior2.type === behaviorTypesEnum.reflection &&
                !reflectionCoder2
              ) {
                reflectionCoder2 = true;
              }
              if (
                codingBehavior2.type === behaviorTypesEnum.information &&
                !informationCoder2
              ) {
                informationCoder2 = true;
              }
            }
          }
        });

        // After all behaviors of this video have been checked, we review categories
        behaviorsToValidate.forEach((behavior) => {
          if (
            behavior.isCategory &&
            behavior.type === behaviorTypesEnum.confort
          ) {
            behavior.coder1.push({
              videoName: videoName,
              found: confortCoder1,
            });
            behavior.coder2.push({
              videoName: videoName,
              found: confortCoder2,
            });
          } else if (
            behavior.isCategory &&
            behavior.type === behaviorTypesEnum.exhibitUse
          ) {
            behavior.coder1.push({
              videoName: videoName,
              found: exhibitUseCoder1,
            });
            behavior.coder2.push({
              videoName: videoName,
              found: exhibitUseCoder2,
            });
          } else if (
            behavior.isCategory &&
            behavior.type === behaviorTypesEnum.reflection
          ) {
            behavior.coder1.push({
              videoName: videoName,
              found: reflectionCoder1,
            });
            behavior.coder2.push({
              videoName: videoName,
              found: reflectionCoder2,
            });
          } else if (
            behavior.isCategory &&
            behavior.type === behaviorTypesEnum.information
          ) {
            behavior.coder1.push({
              videoName: videoName,
              found: informationCoder1,
            });
            behavior.coder2.push({
              videoName: videoName,
              found: informationCoder2,
            });
          }
        });
      });

      console.log("behaviorsToValidate", behaviorsToValidate);
      debugger;
      calculateKappaCohen(behaviorsToValidate);
    }
  };

  const calculateKappaCohen = (behaviors) => {
    behaviors.forEach((behavior) => {
      const clipsCoder1 = behavior.coder1;
      const clipsCoder2 = behavior.coder2;

      let totalClips = clipsCoder1.length;
      let totalClipsYY = 0;
      let totalClipsYN = 0;
      let totalClipsNY = 0;
      let totalClipsNN = 0;

      for (let i = 0; i < totalClips; i++) {
        const clipCoder1 = clipsCoder1[i];
        const clipCoder2 = clipsCoder2[i];

        if (clipCoder1.found && clipCoder2.found) {
          totalClipsYY += 1;
        } else if (clipCoder1.found && !clipCoder2.found) {
          totalClipsYN += 1;
        } else if (!clipCoder1.found && clipCoder2.found) {
          totalClipsNY += 1;
        } else if (!clipCoder1.found && !clipCoder2.found) {
          totalClipsNN += 1;
        }
      }

      // const ty1 = totalClipsYY + totalClipsYN;
      // const ty2 = totalClipsYY + totalClipsNY;
      // const tn1 = totalClipsNY + totalClipsNN;
      // const tn2 = totalClipsYN + totalClipsNN;

      // const T = ty2 + tn2;
      // const T2 = ty1 + tn1;
      // // T and T2 should be as totalClips

      // const p0 = (totalClipsYY + totalClipsNN) / T;
      // const pe = (ty1 / T) * (ty2 / T) + (tn1 / T) * (tn2 / T);

      // // ((Ty1*Ty2) mas (Tn1*Tn2) ) / T cuadrado
      // const pe2 = (ty1 * ty2 + tn1 * tn2) / (T * T);

      // let kappa = (p0 - pe) / (1 - pe);
      // // Round to 3 decimals
      // kappa = Math.round(kappa * 1000) / 1000;
      // behavior.kappa = kappa;

      // Wikipedias way
      const a = totalClipsYY;
      const b = totalClipsYN;
      const c = totalClipsNY;
      const d = totalClipsNN;

      const p0_v2 = (a + d) / (a + b + c + d);
      const pYes = ((a + b) / (a + b + c + d)) * ((a + c) / (a + b + c + d));
      const pNo = ((c + d) / (a + b + c + d)) * ((b + d) / (a + b + c + d));
      const pe_v2 = pYes + pNo;

      const agreementPercentage = ((a + d) * 100) / (a + b + c + d);
      behavior.agreementPercentage = agreementPercentage;

      // console.log("agreementPercentage", agreementPercentage);
      // if (agreementPercentage === 87.5) {
      //   debugger;
      // }

      behavior.kappaInfo = `A: ${a} - B: ${b} - C: ${c} - D: ${d}`;
      if (a === 0 || d === 0) {
        // No se puede calcular Kappa de Cohen
        behavior.kappa = "N / A";
        behavior.kappaError = a === 0 ? "(YY is 0)" : "(NN is 0)";
      } else {
        let kappa_v2 = (p0_v2 - pe_v2) / (1 - pe_v2);
        // Round to 3 decimals
        kappa_v2 = Math.round(kappa_v2 * 1000) / 1000;
        // behavior.kappa2 = kappa_v2;
        behavior.kappa = kappa_v2;
      }
    });

    console.log("behaviors with Kappa", behaviors);
    setBehaviosWithKappa(behaviors);

    const auxConfort = behaviors.filter(
      (b) => b.type === behaviorTypesEnum.confort
    );
    const auxExhibitUse = behaviors.filter(
      (b) => b.type === behaviorTypesEnum.exhibitUse
    );
    const auxReflection = behaviors.filter(
      (b) => b.type === behaviorTypesEnum.reflection
    );
    const auxInformation = behaviors.filter(
      (b) => b.type === behaviorTypesEnum.information
    );

    setConfortRow(auxConfort);
    setExhibitUseRow(auxExhibitUse);
    setReflectionRow(auxReflection);
    setInformationRow(auxInformation);
  };

  const getKappaColor = (kappa) => {
    if (isNaN(kappa)) {
      return "#000000";
    }

    if (kappa >= 0.8) {
      return "#6fa8dc";
    } else if (kappa >= 0.6) {
      return "#00c68a";
    } else if (kappa >= 0.4) {
      return "#f9b726";
    } else if (kappa >= 0.2) {
      return "#f9911c";
    } else if (kappa >= 0) {
      return "#ea4335";
    } else {
      return "#762e2f";
    }
  };

  const isCalculateButtonEnabled = evaluatorNameA && evaluatorNameB;

  return (
    <div className="intercoder-wrapper">
      <div>
        <div className="intercoder-select">
          <label>Select Coder 1:</label>
          <select value={evaluatorNameA} onChange={handleCoderASelect}>
            <option value="">Select Coder A</option>
            {coderNames.map((coderName, index) => (
              <option key={index} value={coderName}>
                {coderName}
              </option>
            ))}
          </select>
        </div>
        <div className="intercoder-select">
          <label>Select Coder 2:</label>
          <select value={evaluatorNameB} onChange={handleCoderBSelect}>
            <option value="">Select Coder B</option>
            {coderNames.map((coderName, index) => (
              <option key={index} value={coderName}>
                {coderName}
              </option>
            ))}
          </select>
        </div>

        <div className="intercoder-select" style={{ marginTop: "20px" }}>
          <span className="option-title">Select exhibits</span>
          <div style={{ color: "black", width: "400px" }}>
            <Select
              isMulti
              name="exhibits"
              value={selectedExhibits}
              onChange={(selectedExhibits) =>
                setSelectedExhibits(selectedExhibits)
              }
              options={exhibitOptions}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
        </div>

        <div>
          <button
            onClick={handleCalculateClick}
            disabled={!isCalculateButtonEnabled}
          >
            Calculate
          </button>
        </div>

        {/* {behaviorsWithKappa.length > 0 &&
          behaviorsWithKappa.map((behavior, index) => (
            <div key={behavior.id}>
              <div>
                Behavior: {behavior.name} - Kappa: {behavior.kappa} - Kappa v2:{" "}
                {behavior.kappa2}
              </div>
            </div>
          ))} */}

        {behaviorsWithKappa.length > 0 && (
          <>
            <div className="behavior-row">
              {confortRow.map((behavior, index) => {
                const kappaColor = getKappaColor(behavior.kappa);
                return (
                  <div
                    key={`${index}-${behavior.name}`}
                    className="behavior-cell"
                  >
                    <div className="behavior-row-name">{behavior.name}</div>
                    <div className="behavior-row-data">
                      Agreement: {behavior.agreementPercentage.toFixed(2)}%
                    </div>
                    <div
                      className="behavior-row-data"
                      style={{ backgroundColor: kappaColor }}
                      title={behavior.kappaInfo}
                    >
                      Kappa: {behavior.kappa}
                      {behavior.kappaError && (
                        <span style={{ fontSize: "12px" }}>
                          {" "}
                          - {behavior.kappaError}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="behavior-row">
              {exhibitUseRow.map((behavior, index) => {
                const kappaColor = getKappaColor(behavior.kappa);
                return (
                  <div
                    key={`${index}-${behavior.name}`}
                    className="behavior-cell"
                  >
                    <div className="behavior-row-name">{behavior.name}</div>
                    <div className="behavior-row-data">
                      Agreement: {behavior.agreementPercentage.toFixed(2)}%
                    </div>
                    <div
                      className="behavior-row-data"
                      style={{ backgroundColor: kappaColor }}
                      title={behavior.kappaInfo}
                    >
                      Kappa: {behavior.kappa}
                      {behavior.kappaError && (
                        <span style={{ fontSize: "12px" }}>
                          {" "}
                          - {behavior.kappaError}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="behavior-row">
              {reflectionRow.map((behavior, index) => {
                const kappaColor = getKappaColor(behavior.kappa);
                return (
                  <div
                    key={`${index}-${behavior.name}`}
                    className="behavior-cell"
                  >
                    <div className="behavior-row-name">{behavior.name}</div>
                    <div className="behavior-row-data">
                      Agreement: {behavior.agreementPercentage.toFixed(2)}%
                    </div>
                    <div
                      className="behavior-row-data"
                      style={{ backgroundColor: kappaColor }}
                      title={behavior.kappaInfo}
                    >
                      Kappa: {behavior.kappa}
                      {behavior.kappaError && (
                        <span style={{ fontSize: "12px" }}>
                          {" "}
                          - {behavior.kappaError}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="behavior-row">
              {informationRow.map((behavior, index) => {
                const kappaColor = getKappaColor(behavior.kappa);
                return (
                  <div
                    key={`${index}-${behavior.name}`}
                    className="behavior-cell"
                  >
                    <div className="behavior-row-name">{behavior.name}</div>
                    <div className="behavior-row-data">
                      Agreement: {behavior.agreementPercentage.toFixed(2)}%
                    </div>
                    <div
                      className="behavior-row-data"
                      style={{ backgroundColor: kappaColor }}
                      title={behavior.kappaInfo}
                    >
                      Kappa: {behavior.kappa}
                      {behavior.kappaError && (
                        <span style={{ fontSize: "12px" }}>
                          {" "}
                          - {behavior.kappaError}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {behaviorsWithKappa.length > 0 && uniqueVideoNamesDebug.length > 0 && (
          <>
            List of Unique Videos:
            <div>
              {uniqueVideoNamesDebug.map((videoName, index) => {
                return (
                  <div key={index}>
                    <span>{videoName}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* {interCoderReliability && (
          <>
            <div>
              <h3>Intercoder Similarity: {interCoderReliability}%</h3>
            </div>
          </>
        )} */}
      </div>
    </div>
  );
}

export default InterCoder;
