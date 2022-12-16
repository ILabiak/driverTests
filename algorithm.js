'use strict';

const questions = require('./db/seeders/seed-data/questions.json');

const structureArr = [
  [2, 4, 5, 6, 7, 20], // 1
  [3, 27, 32], // 2
  [35, 36, 37, 38, 39, 40, 41], // 3
  [42], // 4
  [10, 21], // 5
  [11, 12], // 6
  [13, 14, 15], // 7
  [16, 19], // 8
  [8, 18, 9, 17], // 9
  [45], // 10
  [22, 28, 29, 30, 31, 34], // 11
  [23, 24, 25, 26], // 12
  [45], // 13
  [44, 47, 50], // 14
  [35, 36, 37, 38, 39, 40, 41], // 15
  [46], // 16
  [1, 48], // 17
  [33, 49], // 18
  [43, 51], // 19
  [43], // 20
];

function getExamQuestions() {
  const testQuestions = [];
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
  for (const sectionId of sectionsIds) {
    arr.push(getSectionQuestions(sectionId));
  }
  arr = arr.flat();
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSectionQuestions(sectionId) {
  return questions.filter(
    (element) => element.section_id === sectionId.toString(),
  );
}

module.exports = {
  getExamQuestions,
  getSectionQuestions,
};
