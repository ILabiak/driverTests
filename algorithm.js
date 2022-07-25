"use strict";

const sections = require("./sections.json");
const questions = require("./questions.json");

const structureArr = [
  [102, 104, 105, 106, 107, 121], // 1
  [103, 128, 133], // 2
  [184, 185, 186, 187, 188, 189, 190], // 3
  [137], // 4
  [109, 122], // 5
  [110, 114], // 6
  [115, 116, 117], // 7
  [118, 120], // 8
  [108, 119, 174, 175], // 9
  [139], // 10
  [123, 129, 130, 131, 132, 135], // 11
  [124, 125, 126, 127], // 12
  [139], // 13
  [138, 141, 160], // 14
  [184, 185, 186, 187, 188, 189, 190], // 15
  [153], // 16
  [101, 158], // 17
  [134, 159], // 18
  [142, 161], // 19
  [142], // 20
];

function makeExamTest() {
  let testQuestions = [];
  for (let i = 0; i < 20; i++) {
    let question;
    do {
      question = getRandomQuestion(...structureArr[i]);
    } while (testQuestions.includes(question));
    testQuestions.push(question);
  }
  return testQuestions;
}

function getRandomQuestion(...sectionsIds) {
  let arr = [];
  for (let sectionId of sectionsIds) {
    arr.push(getSectionQuestions(sectionId));
  }
  arr = arr.flat();
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSectionQuestions(sectionId) {
  return questions.filter(
    (element) => element.section_id == sectionId.toString()
  );
}

console.log(JSON.stringify(makeExamTest()));

//console.log(getSectionQuestions(101))
