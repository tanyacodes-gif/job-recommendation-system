document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileSection = document.querySelector('.profile-section');
    const inputSection = document.querySelector('.input-section');
    const resultsSection = document.getElementById('results');
    const nextBtn = document.getElementById('next-btn');
    const userNameSpan = document.getElementById('user-name');
    const skillInput = document.getElementById('skill-input');
    const addSkillBtn = document.getElementById('add-skill-btn');
    const recommendBtn = document.getElementById('recommend-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const skillTagsContainer = document.getElementById('skill-tags');
    const jobList = document.getElementById('job-list');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');
    const spinner = document.getElementById('spinner');
    // Quiz modal elements
    const quizModal = document.getElementById('quiz-modal');
    const quizSkillName = document.getElementById('quiz-skill-name');
    const quizQuestionsDiv = document.getElementById('quiz-questions');
    const quizSubmit = document.getElementById('quiz-submit');
    const quizCancel = document.getElementById('quiz-cancel');
    const quizFeedback = document.getElementById('quiz-feedback');
    
    const questionBank = {
        "html": [
            { q: "What tag is used for the largest heading?", options: ["<h1>", "<head>", "<header>", "<title>"], a: 0 },
            { q: "Which attribute is used to create a link?", options: ["src", "href", "link", "ref"], a: 1 }
        ],
        "css": [
            { q: "Which property changes text color?", options: ["color", "font-color", "text-color", "fg"], a: 0 },
            { q: "Which rule selects an element by id?", options: ["#id", ".id", "id", "*id"], a: 0 }
        ],
        "javascript": [
            { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "const", "both let and const"], a: 3 },
            { q: "What does JSON stand for?", options: ["Java Standard Object Notation", "JavaScript Object Notation", "JavaScript On Node", "Just Simple Object Notation"], a: 1 }
        ],
        "python": [
            { q: "Which symbol is used for comments in Python?", options: ["//", "#", "/*", "<!--"], a: 1 },
            { q: "Which keyword starts a function in Python?", options: ["func", "def", "function", "declare"], a: 1 }
        ],
        "structure": [
            { q: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], a: 1 },
            { q: "Which is not a linear data structure?", options: ["Array", "Linked List", "Tree", "Queue"], a: 2 }
        ]
    };

    let userData = { name: '', email: '', phone: '', photo: null, skills: [] };
    
    photoInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                userData.photo = e.target.result;
                photoPreview.innerHTML = `<img src="${e.target.result}" alt="Profile Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    nextBtn.addEventListener('click', function() {
        userData.name = document.getElementById('name').value.trim();
        userData.email = document.getElementById('email').value.trim();
        userData.phone = document.getElementById('phone').value.trim();

        if (!userData.name || !userData.email) {
            alert('Please fill in at least your name and email.');
            return;
        }

        localStorage.setItem('workwise_user', JSON.stringify(userData));
        userNameSpan.textContent = userData.name;
        profileSection.style.display = 'none';
        inputSection.style.display = 'block';
    });
    function renderSkillTag(skill) {
        const tag = document.createElement('div');
        tag.className = 'skill-tag';
        tag.innerHTML = `<span>${skill}</span><span class="remove-btn">&times;</span>`;
        tag.querySelector('.remove-btn').addEventListener('click', () => {
            userData.skills = userData.skills.filter(s => s !== skill);
            skillTagsContainer.removeChild(tag);
        });
        skillTagsContainer.appendChild(tag);
    }
    let pendingSkill = null;
    function openQuiz(skill) {
        pendingSkill = skill.toLowerCase().trim();
        quizFeedback.textContent = '';
        quizSkillName.textContent = pendingSkill;
        quizQuestionsDiv.innerHTML = '';

        const bankKey = Object.keys(questionBank).find(k => k.toLowerCase() === pendingSkill);
        if (!bankKey) {
            addSkill(pendingSkill);
            return;
        }

        const questions = questionBank[bankKey];
        const picked = questions.slice(0, 2);
        picked.forEach((q, i) => {
            const div = document.createElement('div');
            div.className = 'quiz-question';
            div.innerHTML = `<p><strong>Q${i + 1}:</strong> ${q.q}</p>`;
            q.options.forEach((opt, idx) => {
                div.innerHTML += `<div><label><input type="radio" name="q${i}" value="${idx}"> ${opt}</label></div>`;
            });
            quizQuestionsDiv.appendChild(div);
        });

        quizModal.style.display = 'flex';
    }

    quizCancel.addEventListener('click', () => {
        quizModal.style.display = 'none';
        pendingSkill = null;
    });

    quizSubmit.addEventListener('click', () => {
        if (!pendingSkill) return;
        const bankKey = Object.keys(questionBank).find(k => k.toLowerCase() === pendingSkill);
        const questions = questionBank[bankKey];
        const selected1 = document.querySelector('input[name="q0"]:checked');
        const selected2 = document.querySelector('input[name="q1"]:checked');
        if (!selected1 || !selected2) {
            quizFeedback.textContent = 'Please answer both questions.';
            return;
        }
        const ans = [parseInt(selected1.value), parseInt(selected2.value)];
        let correct = 0;
        if (ans[0] === questions[0].a) correct++;
        if (ans[1] === questions[1].a) correct++;
        if (correct === 2) {
            quizFeedback.style.color = 'green';
            quizFeedback.textContent = 'Skill verified! Added to your profile.';
            setTimeout(() => {
                addSkill(pendingSkill);
                quizModal.style.display = 'none';
            }, 700);
        } else {
            quizFeedback.style.color = 'red';
            quizFeedback.textContent = 'Verification failed. Skill not added.';
        }
    });

    function addSkill(skill) {
        if (!skill || userData.skills.includes(skill)) return;
        userData.skills.push(skill);
        renderSkillTag(skill);
        skillInput.value = '';
        localStorage.setItem('workwise_user', JSON.stringify(userData));
    }
    addSkillBtn.addEventListener('click', () => {
        const s = skillInput.value.trim();
        if (s) openQuiz(s);
    });
    skillInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkillBtn.click();
        }
    });
    recommendBtn.addEventListener('click', async function() {
        if (userData.skills.length === 0) {
            alert('Please add at least one skill.');
            return;
        }

        spinner.style.display = 'block';
        jobList.innerHTML = '';
        resultsSection.style.display = 'block';
        recommendBtn.textContent = 'Analyzing Skills...';
        recommendBtn.disabled = true;

        try {
            const resp = await fetch('/api/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user: userData, skills: userData.skills })
            });
            const data = await resp.json();
            displayJobs(data.recommendations || []);
        } catch (err) {
            console.error(err);
            alert('Failed to get recommendations. Check server logs.');
        } finally {
            spinner.style.display = 'none';
            recommendBtn.textContent = 'Find Recommended Jobs';
            recommendBtn.disabled = false;
        }
    });
    function displayJobs(jobs) {
        jobList.innerHTML = '';
        if (!jobs || jobs.length === 0) {
            jobList.innerHTML = '<p>No matching jobs found. Try adding more skills.</p>';
            return;
        }
        jobs.forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <h3>${job.title}</h3>
                <p><strong>Company:</strong> ${job.company}</p>
                <p><strong>Required Skills:</strong> ${job.skills.join(', ')}</p>
                <p><strong>Match Score:</strong> ${job.matchScore}%</p>
                <p><strong>Skills to Learn:</strong> ${job.missingSkills?.length ? job.missingSkills.join(', ') : 'None'}</p>
                <a href="${job.link}" target="_blank" class="company-link">View Opportunities at ${job.company}</a>
            `;
            jobList.appendChild(card);
        });
    }
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('workwise_user');
            location.reload();
        }
    });
    const saved = localStorage.getItem('workwise_user');
    if (saved) {
        try {
            userData = JSON.parse(saved);
            if (userData.name) {
                userNameSpan.textContent = userData.name;
                profileSection.style.display = 'none';
                inputSection.style.display = 'block';
                if (userData.skills?.length) {
                    userData.skills.forEach(s => renderSkillTag(s));
                }
                if (userData.photo) {
                    photoPreview.innerHTML = `<img src="${userData.photo}" alt="Profile Preview">`;
                }
            }
        } catch (e) {
            console.error('Failed to parse saved user', e);
        }
    }
});