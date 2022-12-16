'use strict';

const db = require('./models');

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

/*

PostgreSQL models:

1. Users:
id: INTEGER, PRIMARY KEY, AUTO INCREMENT, NOT NULL
telegram_id: INTEGER, UNIQUE
username: STRING
(Maybe add passhash)

2. Sections:
id: INTEGER, PRIMARY KEY, AUTO INCREMENT, NOT NULL
(think about a way to save old sectionIds from json)
name: STRING
(maybe section_id)

3. Questions:
id: INTEGER, PRIMARY KEY, AUTO INCREMENT, NOT NULL
section_id: INTEGER
text: STRING, NOT NULL
answers: INTEGER (maybe string) ARRAY, NOT NULL
(or make another table for answers and store here INTEGER ARRAY)
right_answer_index: INTEGER, NOT NULL
image: STRING (link)

4.(MAYBE) Answers:
id: INTEGER, PRIMARY KEY, AUTO INCREMENT, NOT NULL
text: STRING, NOT NULL


*/
