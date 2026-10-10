# Work Wise — Job Recommendation System

Work Wise is a small web project I built to explore how someone's skills could connect to possible job roles. It lets a user pick skills, answer short quizzes, and see career suggestions based on their results.

## What it does
- Includes 17 skills, from HTML, JavaScript and Python to SQL, React, AWS and Communication.
- Has four multiple-choice questions for each supported skill. Three correct answers are enough to pass the demo check.
- Shows role suggestions, a simple match percentage, skills that match, and skills the user could work on next.
- Links to company career pages for further research.
- Uses a responsive layout and stores the profile in the current browser.

## Run it
Open `index.html` in a browser or use Live Server in VS Code. Create a profile, select a skill, finish the quiz, and click **Find my job matches**.

## A few limitations
This is a learning project, not a hiring or certification tool. Quiz results are basic checks, and a match percentage should be treated as a rough guide rather than a guarantee. Company links lead to career sites and do not mean a role is currently available.

The browser version calculates recommendations on the client side so it can run on GitHub Pages. `server.js` and `recommend.cpp` are included as optional project-side implementations, but GitHub Pages does not run a Node server or compile C++.
