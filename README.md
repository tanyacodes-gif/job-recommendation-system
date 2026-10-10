# Work Wise — Skill-Verified Job Recommendations

Work Wise is a browser-based job recommendation project. Users create a local profile, verify skills through four-question quizzes, and explore role matches across 24+ companies.

## Features
- 17 skill quizzes: HTML, CSS, JavaScript, Python, Java, C++, SQL, React, Node.js, MongoDB, Data Structures, Machine Learning, Excel, Figma, AWS, Git, and Communication.
- Four multiple-choice questions per skill; at least 3/4 correct to verify.
- Skill score badges and a recommendation confidence indicator.
- 24 role pathways across Amazon, Flipkart, Microsoft, Google, Meesho, AWS, Deloitte, Adobe, IBM, Wipro, Infosys, TCS, Swiggy, Zomato, NVIDIA, Oracle, Accenture, Atlassian, Paytm, Canva, Uber, Cisco, Capgemini, and Intuit.
- Match percentage, matching skills, skills to build, and direct company careers links.
- Responsive design and local browser profile storage.
- Recommendation logic runs in the browser, so the frontend can work on GitHub Pages without a hosted Node/C++ backend.

## Run locally
1. Open `public/index.html` in a browser, or use VS Code Live Server.
2. Create a profile and choose a skill from the skill library.
3. Answer all four quiz questions. At least three correct answers adds the verified skill.
4. Select **Find my job matches** to view matching career paths.

Optional backend:
- `server.js` is the original Express API entry point.
- `recommend.cpp` contains a matching C++ recommendation implementation.
- The current frontend intentionally computes recommendations client-side for GitHub Pages compatibility; static GitHub Pages does not run Node.js or compile C++.

## Notes
- Profile data is stored in the browser's localStorage on that device/browser. The photo is kept locally and limited to 2 MB.
- Quiz results are learning checks, not official certifications.
- Company links point to career pages; they do not guarantee that a particular job is currently open.
- Never enter sensitive personal information into a demo project.
