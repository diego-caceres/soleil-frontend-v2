import { useState, useEffect } from "react";
import { db } from "../../config/firebase";
import { getDocs, collection } from "firebase/firestore";
import { getDateStringFromTimestamp } from "src/utils";
import "./CodingsList.scss";

const CodingsList = () => {
  const [codings, setCodings] = useState([]);
  const [selectedCoding, setSelectedCoding] = useState(null);

  useEffect(() => {
    const getCodings = async () => {
      const codingsCollectionRef = collection(db, "codings");
      const data = await getDocs(codingsCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCodings(filteredData);
    };

    getCodings();
  }, []);

  return (
    <div className="codings-section">
      <h1>CodingsList</h1>

      <div className="codings-container">
        <div className="sidebar">
          <ul>
            {codings.map((coding) => {
              const { codingType, codedDate } = coding;
              return (
                <li
                  key={coding.codedDate}
                  onClick={() => setSelectedCoding(coding)}
                >
                  {`Tipo: ${codingType} - Fecha ${getDateStringFromTimestamp(
                    codedDate
                  )}`}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="coding-content">
          {!selectedCoding && (
            <div>
              <h2>Selecciona un coding</h2>
            </div>
          )}

          {selectedCoding && <Coding coding={selectedCoding} />}
        </div>
      </div>
    </div>
  );
};

const Coding = ({ coding }) => {
  const {
    id: codingId,
    codingType,
    codedDate,
    dayStatus,
    codingBehaviors,
    evaluatorName,
    exhibitId,
    extraObservations,
    facilitator,
  } = coding;
  return (
    <>
      <h2>Tipo: {codingType}</h2>
      <h3>Fecha: {`${getDateStringFromTimestamp(codedDate)}`}</h3>
      <p>
        <b>Estado del día:</b> {dayStatus}
      </p>
      <p>
        <b>Nombre del evaluador:</b> {evaluatorName}
      </p>
      <p>
        <b>Id del exhibidor:</b> {exhibitId}
      </p>
      <p>
        <b>Observaciones:</b> {extraObservations}
      </p>
      <h3>Comportamientos:</h3>
      <ul>
        {codingBehaviors.map((behavior, index) => {
          const {
            id: behaviorId,
            forFacilitator,
            name,
            type,
            timeEnded,
            timeMarked,
          } = behavior;
          return (
            <li key={`${codingId}-${behaviorId}-${index}`}>
              <p>{forFacilitator ? "Facilitador:" : "Visitor"}</p>
              <p>Nombre: {name}</p>
              <p>Tipo: {type}</p>
              <p>Tiempo marcado: {timeMarked}</p>
              <p>Tiempo finalizado: {timeEnded}</p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default CodingsList;
