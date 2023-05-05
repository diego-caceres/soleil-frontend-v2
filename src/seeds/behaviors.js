import { db } from "../config/firebase";
import { addDoc, collection } from "firebase/firestore";

export const createBehaviors = async () => {
  const behaviorsCollectionRef = collection(db, "behaviors");

  // CONFORT
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Encouraging language",
    type: "Confort",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Welcoming",
    type: "Confort",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Laughter/joy",
    type: "Confort",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Focus on visitor",
    type: "Confort",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Small talk",
    type: "Confort",
  });

  // Information
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Context and/or explanation",
    type: "Information",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "How the exhibit works",
    type: "Information",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Fun facts",
    type: "Information",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Tour guide/ambassador",
    type: "Information",
  });

  //Exhibit use:
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Showing how to use",
    type: "Exhibit Use",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Telling how to use",
    type: "Exhibit Use",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Using along",
    type: "Exhibit Use",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Technical assistance",
    type: "Exhibit Use",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Reading signage for visitor",
    type: "Exhibit Use",
  });

  // Reflection
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Making connections",
    type: "Reflection",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Attention to phenomena",
    type: "Reflection",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Challenge or experiment",
    type: "Reflection",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: false,
    forFacilitator: true,
    name: "Inviting reflection",
    type: "Reflection",
  });

  // Visitor Behaviors
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "1- Doing the activity",
    type: "Initiation",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "2- Observing the activity",
    type: "Initiation",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "3- Repeting the activity",
    type: "Transition",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "4- Positive emotional response",
    type: "Transition",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "5- Past Experiences",
    type: "Breakthrough",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "6- Seeking & sharing information",
    type: "Breakthrough",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "7- Engaged & involved",
    type: "Breakthrough",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "Visitor-visitor Interaction",
    type: "",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "Takes photo",
    type: "",
  });
  await addDoc(behaviorsCollectionRef, {
    forVisitor: true,
    forFacilitator: false,
    name: "Reads signage",
    type: "",
  });
};
