import { db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";

export const createExibits = async () => {
  const exhibitsCollectionRef = collection(db, "exhibits");
  /*Science North exhibits */
  /*Arctic voices*/
  await addDoc(exhibitsCollectionRef, {
    name: "Arctic map",
    center: "Science North",
    exhibition: "Arctic voices",
    contextualized: true,
    type: "type3",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Bear challenge",
    center: "Science North",
    exhibition: "Arctic voices",
    contextualized: true,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Global connections",
    center: "Science North",
    exhibition: "Arctic voices",
    contextualized: true,
    type: "type3",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Hare challenge",
    center: "Science North",
    exhibition: "Arctic voices",
    contextualized: true,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Newcomers quiz",
    center: "Science North",
    exhibition: "Arctic voices",
    contextualized: true,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  /*Science or Ripley's Believe it or Not*/
  await addDoc(exhibitsCollectionRef, {
    name: "Age yourself",
    center: "Science North",
    exhibition: "SRBION",
    contextualized: false,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Chair",
    center: "Science North",
    exhibition: "SRBION",
    contextualized: false,
    type: "type1",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Dino marvels",
    center: "Science North",
    exhibition: "SRBION",
    contextualized: false,
    type: "type1",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Gate",
    center: "Science North",
    exhibition: "SRBION",
    contextualized: false,
    type: "type1",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Make your skin crawl",
    center: "Science North",
    exhibition: "SRBION",
    contextualized: false,
    type: "type1",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Scavenger hunt",
    center: "Science North",
    exhibition: "SRBION",
    contextualized: false,
    type: "type1",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Small challenge",
    center: "Science North",
    exhibition: "SRBION",
    contextualized: false,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Vase",
    center: "Science North",
    exhibition: "SRBION",
    contextualized: false,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  /*Wild weather*/
  await addDoc(exhibitsCollectionRef, {
    name: "Body heat alert",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type2",
    stemArea: "physics",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Cloud wheel",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type1",
    stemArea: "physics",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Drought",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type3",
    stemArea: "physics",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Forecasting tornadoes",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type2",
    stemArea: "physics",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Researcher hot zone",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type1",
    stemArea: "physics",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Slow motion lightning",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type1",
    stemArea: "physics",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Study your sweat",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Thundergames",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Thunderstorm",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Tornado chasers",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type1",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Tornado damage",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type2",
    stemArea: "other",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Tornado sculpture",
    center: "Science North",
    exhibition: "Wild weather",
    contextualized: true,
    type: "type3",
    stemArea: "other",
    deleted: false,
  });
  /*Wild life rescue*/
  await addDoc(exhibitsCollectionRef, {
    name: "Amazing trunk",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type2",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Beetle",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type1",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Big globe",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Elephant quiz",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Face recognition",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type1",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Feed the chick",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Giant panda",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Grip strength",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type2",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Heartbeat",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Iberian lynx",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type1",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Panamanian frog",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type1",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Panda scale",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type1",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Puzzle",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type1",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Robin",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type2",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Seabird rescue",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Sturgeon",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Turtle crawl",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type2",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Turtle rehab",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type3",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "X-ray",
    center: "Science North",
    exhibition: "Wildlife rescue",
    contextualized: true,
    type: "type2",
    stemArea: "bio",
    deleted: false,
  });
  /*SN floors*/
  await addDoc(exhibitsCollectionRef, {
    name: "IR camera",
    center: "Science North",
    exhibition: "Level 3",
    contextualized: true,
    type: "type2",
    stemArea: "bio",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "CanadARM",
    center: "Science North",
    exhibition: "Level 4",
    contextualized: true,
    type: "type2",
    stemArea: "engineeering",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Gravity well",
    center: "Science North",
    exhibition: "Level 4",
    contextualized: true,
    type: "type3",
    stemArea: "physics",
    deleted: false,
  });
  /*Moleculario*/
  await addDoc(exhibitsCollectionRef, {
    name: "Átomo",
    center: "Moleculario",
    exhibition: "Moleculario",
    contextualized: true,
    type: "N/A",
    stemArea: "chemistry",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Armar moléculas",
    center: "Moleculario",
    exhibition: "Moleculario",
    contextualized: true,
    type: "N/A",
    stemArea: "chemistry",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Cambios de estado",
    center: "Moleculario",
    exhibition: "Moleculario",
    contextualized: true,
    type: "N/A",
    stemArea: "chemistry",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Conductividad",
    center: "Moleculario",
    exhibition: "Moleculario",
    contextualized: true,
    type: "N/A",
    stemArea: "chemistry",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Olores",
    center: "Moleculario",
    exhibition: "Moleculario",
    contextualized: true,
    type: "N/A",
    stemArea: "chemistry",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Puzzle redes",
    center: "Moleculario",
    exhibition: "Moleculario",
    contextualized: true,
    type: "N/A",
    stemArea: "chemistry",
    deleted: false,
  });
  /*C3*/
  await addDoc(exhibitsCollectionRef, {
    name: "Código ensamble",
    center: "Lugar a dudas Piso 1",
    exhibition: "C3",
    contextualized: true,
    type: "N/A",
    stemArea: "computer science",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Cuestión de peso",
    center: "Lugar a dudas Piso 2",
    exhibition: "C3",
    contextualized: true,
    type: "N/A",
    stemArea: "math",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "El color del calor (IR)",
    center: "Lugar a dudas Piso 1",
    exhibition: "C3",
    contextualized: true,
    type: "N/A",
    stemArea: "N/A",
    deleted: false,
  });
  await addDoc(exhibitsCollectionRef, {
    name: "Mesa caótica",
    center: "Lugar a dudas Piso 2",
    exhibition: "C3",
    contextualized: true,
    type: "N/A",
    stemArea: "physics",
    deleted: false,
  });
};
