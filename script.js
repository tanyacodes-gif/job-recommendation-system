document.addEventListener('DOMContentLoaded', () => {
  const $ = id => document.getElementById(id);
  const profileSection = document.querySelector('.profile-section');
  const inputSection = document.querySelector('.input-section');
  const resultsSection = $('results');
  const userNameSpan = $('user-name');
  const skillInput = $('skill-input');
  const skillTagsContainer = $('skill-tags');
  const jobList = $('job-list');
  const spinner = $('spinner');
  const quizModal = $('quiz-modal');
  const quizSkillName = $('quiz-skill-name');
  const quizQuestionsDiv = $('quiz-questions');
  const quizFeedback = $('quiz-feedback');
  let pendingSkill = '';
  let userData = { name:'', email:'', phone:'', photo:null, skills:[], verification:{} };

  // Four questions per supported skill. A user needs 3/4 correct to verify a skill.
  const questionBank = {
    'html': [
      ['Which element creates the largest standard heading?',['<h6>','<h1>','<head>','<title>'],1],
      ['Which attribute specifies a link destination?',['src','href','action','target'],1],
      ['Which element is used for an unordered list?',['<ol>','<li>','<ul>','<dl>'],2],
      ['Which semantic element represents a page footer?',['<bottom>','<footer>','<end>','<section>'],1]],
    'css': [
      ['Which property changes text colour?',['font-style','color','background','text-decoration'],1],
      ['Which selector targets an element with id="hero"?',['.hero','#hero','hero','*hero'],1],
      ['Which layout system is one-dimensional?',['Grid','Flexbox','Float','Table'],1],
      ['Which property adds space inside an element border?',['margin','gap','padding','outline'],2]],
    'javascript': [
      ['Which declarations are block-scoped?',['var only','let and const','function only','import only'],1],
      ['What does JSON.stringify() do?',['Parses JSON text','Converts a value to JSON text','Sorts an array','Fetches a URL'],1],
      ['Which method transforms each array item into a new array?',['filter()','find()','map()','push()'],2],
      ['What does === check?',['Value only','Type only','Value and type','Object length'],2]],
    'python': [
      ['Which keyword defines a function?',['func','def','function','lambda'],1],
      ['Which collection is immutable?',['list','set','dictionary','tuple'],3],
      ['What does len([3, 5, 7]) return?',['2','3','7','15'],1],
      ['Which block handles an exception?',['catch','except','error','final'],1]],
    'java': [
      ['Which keyword creates a subclass?',['implements','inherits','extends','superclass'],2],
      ['Which type stores true or false?',['int','boolean','char','String'],1],
      ['Which collection does not allow duplicate elements?',['ArrayList','HashSet','LinkedList','Vector'],1],
      ['What is the JVM responsible for?',['Writing source code','Executing Java bytecode','Designing databases','Compiling CSS'],1]],
    'c++': [
      ['Which operator accesses a member through a pointer?',['.','::','->','&'],2],
      ['Which container is a dynamic array?',['std::list','std::vector','std::map','std::set'],1],
      ['Which feature allows same function name with different parameters?',['Overloading','Overriding only','Encapsulation','Casting'],0],
      ['Which header provides std::sort?',['<iostream>','<string>','<algorithm>','<vector>'],2]],
    'sql': [
      ['Which clause filters rows before grouping?',['HAVING','WHERE','ORDER BY','GROUP BY'],1],
      ['Which command retrieves data?',['GET','OPEN','SELECT','FETCH TABLE'],2],
      ['Which join returns matching rows from both tables?',['INNER JOIN','CROSS JOIN','FULL JOIN','SELF JOIN'],0],
      ['Which function counts rows?',['SUM()','TOTAL()','COUNT()','NUMBER()'],2]],
    'react': [
      ['What is a React component commonly used for?',['Reusable UI','Database backup','Operating system tasks','DNS routing'],0],
      ['Which hook manages local component state?',['useRoute','useState','useFetchOnly','useClass'],1],
      ['Why are keys used when rendering lists?',['To encrypt values','To help React identify items','To style buttons','To call APIs'],1],
      ['Props are generally used to…',['Pass data to components','Change browser hardware','Create SQL tables','Install packages'],0]],
    'node.js': [
      ['Node.js primarily runs JavaScript where?',['Only in CSS','On a server/runtime outside the browser','Inside SQL','In HTML attributes'],1],
      ['Which package manager commonly comes with Node.js?',['pip','npm','apt only','gem'],1],
      ['What is Express commonly used for?',['Building web servers and APIs','Editing images','Training GPUs','Writing CSS'],0],
      ['Which object is commonly used to access environment variables?',['process.env','window.css','document.sql','node.configOnly'],0]],
    'mongodb': [
      ['MongoDB primarily stores records as…',['Rows only','BSON documents','CSV files only','Graph edges only'],1],
      ['Which field is commonly the default document identifier?',['_id','primary','rownum','key0'],0],
      ['Which operation adds a document?',['find()','insertOne()','aggregateOnly()','select()'],1],
      ['What is a collection most similar to in a relational database?',['A table, broadly speaking','A database server','A column value','A SQL join'],0]],
    'data structures': [
      ['Which structure follows FIFO?',['Stack','Queue','Tree','Heap'],1],
      ['Which traversal of a BST visits keys in sorted order?',['Preorder','Postorder','Inorder','Level only'],2],
      ['Which structure is commonly used for BFS?',['Queue','Stack only','Hash only','Array index'],0],
      ['Average-case lookup in a well-sized hash table is typically…',['O(n²)','O(1)','O(log n!)','O(2^n)'],1]],
    'machine learning': [
      ['Which task predicts a category label?',['Classification','Regression','Clustering only','Normalization'],0],
      ['What is overfitting?',['Model learns noise too closely','Model has no parameters','Dataset is always small','Training is skipped'],0],
      ['Which method is commonly used for classification and regression?',['Decision tree','HTML parser','DNS lookup','Merge sort'],0],
      ['Why use a test set?',['Tune every training step','Estimate performance on unseen data','Increase duplicate data','Remove all features'],1]],
    'excel': [
      ['Which formula adds cells A1 through A5?',['=ADD(A1:A5)','=SUM(A1:A5)','=PLUS(A1:A5)','=TOTAL(A1-A5)'],1],
      ['Which reference remains fixed when copied?',['A1','$A$1','A:A only','1A'],1],
      ['Which feature summarises and groups data interactively?',['PivotTable','WordArt','Mail Merge','Slide Master'],0],
      ['Which function counts non-empty cells?',['COUNTBLANK','COUNTA','SUM','LEFT'],1]],
    'figma': [
      ['What are components useful for?',['Reusable design elements','Running SQL queries','Hosting APIs','Compiling Java'],0],
      ['What does an auto layout help manage?',['Spacing and resizing of child elements','DNS records','Git branches','Database indexes'],0],
      ['A prototype is mainly used to…',['Demonstrate interaction flow','Store passwords','Train a model','Compress images'],0],
      ['Which is an accessibility-friendly design practice?',['Low contrast text','Rely on colour alone','Clear labels and sufficient contrast','Tiny tap targets'],2]],
    'aws': [
      ['Which AWS service provides virtual servers?',['Amazon EC2','Amazon S3','Amazon Route 53 only','Amazon SNS'],0],
      ['Which service is object storage?',['Amazon S3','Amazon EC2','AWS Lambda','Amazon VPC'],0],
      ['What does IAM help manage?',['Identities and permissions','Image dimensions','Machine learning labels only','Domain names only'],0],
      ['AWS Lambda is primarily…',['A serverless compute service','A relational database','A CSS framework','A physical router'],0]],
    'git': [
      ['Which command creates a new commit?',['git push','git commit','git clone','git status'],1],
      ['Which command copies a remote repository locally?',['git clone','git merge','git diff','git log'],0],
      ['What is a branch useful for?',['Isolating parallel development work','Deleting all history automatically','Hosting a website alone','Encrypting a database'],0],
      ['Which command shows working-tree status?',['git status','git init-only','git run','git start'],0]],
    'communication': [
      ['What is the best first step when requirements are unclear?',['Guess silently','Ask focused clarifying questions','Ignore the request','Immediately escalate every task'],1],
      ['A useful status update should include…',['Progress, blockers, next steps','Only emojis','Unrelated personal details','No dates or context'],0],
      ['What is active listening?',['Planning your reply only','Listening to understand and clarifying','Interrupting quickly','Avoiding questions'],1],
      ['How should you handle constructive feedback?',['Dismiss it','Consider it and agree on an action','Blame a teammate','Never ask for examples'],1]]
  };

  const skillAliases = {
    'html5':'html','css3':'css','js':'javascript','javascript es6':'javascript','py':'python',
    'c plus plus':'c++','cpp':'c++','dsa':'data structures','data structure':'data structures',
    'ml':'machine learning','ux/ui':'figma','ui/ux':'figma','amazon web services':'aws',
    'node':'node.js','mongodb database':'mongodb','communication skills':'communication'
  };
  const skillCatalog = Object.keys(questionBank);
  const jobs = [
    {title:'Frontend Developer',company:'Amazon',skills:['html','css','javascript','react'],link:'https://www.amazon.jobs/'},
    {title:'Software Development Engineer',company:'Flipkart',skills:['java','sql','data structures','git'],link:'https://www.flipkartcareers.com/'},
    {title:'Data Analyst',company:'Microsoft',skills:['python','excel','sql','machine learning'],link:'https://careers.microsoft.com/'},
    {title:'UX/UI Designer',company:'Google',skills:['figma','communication','html','css'],link:'https://careers.google.com/'},
    {title:'Backend Developer',company:'Meesho',skills:['node.js','mongodb','javascript','git'],link:'https://www.meesho.io/jobs'},
    {title:'Cloud / AWS Associate',company:'AWS',skills:['aws','python','git','communication'],link:'https://www.amazon.jobs/content/en/teams/amazon-web-services'},
    {title:'Business Intelligence Analyst',company:'Deloitte',skills:['excel','sql','python','communication'],link:'https://www.deloitte.com/global/en/careers.html'},
    {title:'Software Engineer',company:'Adobe',skills:['java','c++','data structures','git'],link:'https://careers.adobe.com/'},
    {title:'Associate Software Engineer',company:'IBM',skills:['python','java','sql','communication'],link:'https://www.ibm.com/careers'},
    {title:'Full Stack Developer',company:'Wipro',skills:['html','css','javascript','node.js'],link:'https://careers.wipro.com/'},
    {title:'Graduate Engineer Trainee',company:'Infosys',skills:['java','python','sql','data structures'],link:'https://www.infosys.com/careers/'},
    {title:'Technology Analyst',company:'TCS',skills:['java','sql','git','communication'],link:'https://www.tcs.com/careers'},
    {title:'Product / Data Analyst',company:'Swiggy',skills:['sql','excel','python','communication'],link:'https://careers.swiggy.com/'},
    {title:'Software Development Engineer',company:'Zomato',skills:['javascript','python','data structures','git'],link:'https://www.zomato.com/careers'},
    {title:'Data / AI Intern',company:'NVIDIA',skills:['python','machine learning','c++','data structures'],link:'https://www.nvidia.com/en-us/about-nvidia/careers/'},
    {title:'Cloud Support Associate',company:'Oracle',skills:['aws','sql','python','communication'],link:'https://www.oracle.com/careers/'},
    {title:'Software Engineer',company:'Accenture',skills:['java','python','sql','communication'],link:'https://www.accenture.com/in-en/careers'},
    {title:'Frontend Engineer',company:'Atlassian',skills:['html','css','javascript','react'],link:'https://www.atlassian.com/company/careers'},
    {title:'Software Engineer',company:'Paytm',skills:['java','sql','data structures','git'],link:'https://paytm.com/careers/'},
    {title:'Product Design Intern',company:'Canva',skills:['figma','communication','html','css'],link:'https://www.canva.com/careers/'},
    {title:'Data Analyst',company:'Uber',skills:['python','sql','excel','machine learning'],link:'https://www.uber.com/us/en/careers/'},
    {title:'Software Engineer',company:'Cisco',skills:['python','c++','data structures','communication'],link:'https://jobs.cisco.com/'},
    {title:'Application Developer',company:'Capgemini',skills:['java','sql','git','communication'],link:'https://www.capgemini.com/careers/'},
    {title:'Software Engineer',company:'Intuit',skills:['javascript','react','sql','git'],link:'https://careers.intuit.com/'}
  ];

  function canonicalSkill(value) {
    const raw = value.trim().toLowerCase().replace(/\s+/g,' ');
    return skillAliases[raw] || raw;
  }
  function save() { localStorage.setItem('workwise_user', JSON.stringify(userData)); }
  $('photo').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Please choose a photo smaller than 2 MB.'); e.target.value=''; return; }
    const reader = new FileReader();
    reader.onload = ev => { userData.photo=ev.target.result; $('photo-preview').innerHTML=''; const img=document.createElement('img'); img.src=ev.target.result; img.alt='Profile preview'; $('photo-preview').appendChild(img); };
    reader.readAsDataURL(file);
  });
  $('next-btn').addEventListener('click', () => {
    userData.name=$('name').value.trim(); userData.email=$('email').value.trim(); userData.phone=$('phone').value.trim();
    if (!userData.name || !$('email').checkValidity() || !userData.email) { alert('Please enter your name and a valid email.'); return; }
    save(); userNameSpan.textContent=userData.name; profileSection.style.display='none'; inputSection.style.display='block';
  });
  function renderSkills() {
    skillTagsContainer.innerHTML='';
    userData.skills.forEach(skill => {
      const tag=document.createElement('div'); tag.className='skill-tag';
      const label=document.createElement('span'); label.textContent=skill;
      const status=document.createElement('small'); status.textContent=`✓ ${userData.verification[skill] || 0}/4`; status.className='skill-score';
      const remove=document.createElement('button'); remove.type='button'; remove.className='remove-btn'; remove.setAttribute('aria-label',`Remove ${skill}`); remove.textContent='×';
      remove.addEventListener('click',()=>{userData.skills=userData.skills.filter(s=>s!==skill);delete userData.verification[skill];save();renderSkills();});
      tag.append(label,status,remove); skillTagsContainer.appendChild(tag);
    });
  }
  function showCatalog() {
    const box=$('skill-catalog'); if (!box) return;
    box.innerHTML='';
    skillCatalog.forEach(skill=>{
      const b=document.createElement('button'); b.type='button'; b.className='suggested-skill'; b.textContent=skill;
      b.disabled=userData.skills.includes(skill);
      b.addEventListener('click',()=>openQuiz(skill)); box.appendChild(b);
    });
  }
  function openQuiz(raw) {
    const skill=canonicalSkill(raw);
    if (!questionBank[skill]) { quizFeedback.textContent=`"${raw}" isn't in the quiz library yet. Choose a listed skill or try an alias such as JS, DSA, ML, or UI/UX.`; quizFeedback.style.color='#b42318'; quizModal.style.display='flex'; quizSkillName.textContent=raw; quizQuestionsDiv.innerHTML=''; pendingSkill=''; return; }
    if(userData.skills.includes(skill)){alert('This skill is already in your profile.');return;}
    pendingSkill=skill; quizFeedback.textContent=''; quizFeedback.style.color='#b42318'; quizSkillName.textContent=skill; quizQuestionsDiv.innerHTML='';
    questionBank[skill].forEach((q,i)=>{
      const wrap=document.createElement('fieldset'); wrap.className='quiz-question';
      const legend=document.createElement('legend'); legend.textContent=`Q${i+1}. ${q[0]}`; wrap.appendChild(legend);
      q[1].forEach((opt,j)=>{
        const label=document.createElement('label'); label.className='quiz-option';
        const radio=document.createElement('input'); radio.type='radio'; radio.name=`quiz-${i}`; radio.value=j;
        label.append(radio,document.createTextNode(' '+opt)); wrap.appendChild(label);
      });
      quizQuestionsDiv.appendChild(wrap);
    });
    quizModal.style.display='flex';
  }
  $('add-skill-btn').addEventListener('click',()=>{const value=skillInput.value.trim();if(value)openQuiz(value);});
  skillInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('add-skill-btn').click();}});
  $('quiz-cancel').addEventListener('click',()=>{quizModal.style.display='none';pendingSkill='';});
  $('quiz-submit').addEventListener('click',()=>{
    if(!pendingSkill)return;
    let score=0, unanswered=0;
    questionBank[pendingSkill].forEach((q,i)=>{const picked=document.querySelector(`input[name="quiz-${i}"]:checked`);if(!picked)unanswered++;else if(Number(picked.value)===q[2])score++;});
    if(unanswered){quizFeedback.textContent=`Please answer all four questions (${unanswered} remaining).`;return;}
    if(score>=3){
      userData.skills.push(pendingSkill);userData.verification[pendingSkill]=score;save();renderSkills();showCatalog();
      quizFeedback.style.color='#087443';quizFeedback.textContent=`Verified! ${score}/4 correct. Skill added to your profile.`;
      setTimeout(()=>{quizModal.style.display='none';pendingSkill='';},900);
    } else {quizFeedback.textContent=`${score}/4 correct. You need at least 3/4 to verify this skill. Review the topic and try again.`;}
  });
  function renderJobs(selectedSkills) {
    const matches=jobs.map(job=>{
      const matched=job.skills.filter(s=>selectedSkills.includes(s));
      const missing=job.skills.filter(s=>!selectedSkills.includes(s));
      const score=Math.round(matched.length/job.skills.length*100);
      const verificationAverage=matched.length ? Math.round(matched.reduce((sum,s)=>sum+(userData.verification[s]||0),0)/matched.length*25) : 0;
      return {...job,matched,missing,score,verificationAverage,rank:score*0.8+verificationAverage*0.2};
    }).filter(j=>j.score>0).sort((a,b)=>b.rank-a.rank || b.score-a.score);
    jobList.innerHTML='';
    if(!matches.length){jobList.textContent='No matching roles yet. Verify more skills to unlock recommendations.';return;}
    const intro=document.createElement('p'); intro.className='results-summary';intro.textContent=`Found ${matches.length} role matches across ${new Set(matches.map(j=>j.company)).size} companies. Scores reflect required-skill overlap; verified quiz results add confidence.`;jobList.appendChild(intro);
    matches.forEach(job=>{
      const card=document.createElement('article');card.className='job-card';
      const top=document.createElement('div');top.className='job-card-top';
      const title=document.createElement('h3');title.textContent=job.title;
      const score=document.createElement('span');score.className='match-badge';score.textContent=`${job.score}% match`;
      top.append(title,score);card.appendChild(top);
      const company=document.createElement('p');company.innerHTML='<strong>Company:</strong> ';company.appendChild(document.createTextNode(job.company));card.appendChild(company);
      const meter=document.createElement('div');meter.className='progress';const fill=document.createElement('span');fill.style.width=job.score+'%';meter.appendChild(fill);card.appendChild(meter);
      const req=document.createElement('p');req.innerHTML='<strong>Role skills:</strong> ';req.appendChild(document.createTextNode(job.skills.join(', ')));card.appendChild(req);
      const matched=document.createElement('p');matched.innerHTML='<strong>Your matching skills:</strong> ';matched.appendChild(document.createTextNode(job.matched.join(', ')));card.appendChild(matched);
      const missing=document.createElement('p');missing.innerHTML='<strong>Skills to build:</strong> ';missing.appendChild(document.createTextNode(job.missing.length?job.missing.join(', '):'You cover all listed skills!'));card.appendChild(missing);
      const verify=document.createElement('p');verify.innerHTML='<strong>Verification confidence:</strong> ';verify.appendChild(document.createTextNode(job.matched.length?`${job.verificationAverage}% average quiz score`:'Not available'));card.appendChild(verify);
      const link=document.createElement('a');link.className='company-link';link.href=job.link;link.target='_blank';link.rel='noopener noreferrer';link.textContent=`Explore ${job.company} careers ↗`;card.appendChild(link);
      jobList.appendChild(card);
    });
  }
  $('recommend-btn').addEventListener('click',()=>{
    if(!userData.skills.length){alert('Verify at least one skill first.');return;}
    spinner.style.display='block';resultsSection.style.display='block';jobList.innerHTML='';
    // Runs fully in the browser, so recommendations also work on GitHub Pages without a Node/C++ server.
    setTimeout(()=>{renderJobs(userData.skills);spinner.style.display='none';resultsSection.scrollIntoView({behavior:'smooth',block:'start'});},250);
  });
  $('logout-btn').addEventListener('click',()=>{if(confirm('Clear this saved profile from this browser?')){localStorage.removeItem('workwise_user');location.reload();}});
  const saved=localStorage.getItem('workwise_user');
  if(saved){try{const parsed=JSON.parse(saved);userData={...userData,...parsed,skills:Array.isArray(parsed.skills)?parsed.skills:[],verification:parsed.verification||{}};}catch(e){localStorage.removeItem('workwise_user');}}
  if(userData.name){$('name').value=userData.name;$('email').value=userData.email||'';$('phone').value=userData.phone||'';userNameSpan.textContent=userData.name;profileSection.style.display='none';inputSection.style.display='block';}
  if(userData.photo){const img=document.createElement('img');img.src=userData.photo;img.alt='Profile preview';$('photo-preview').appendChild(img);}
  renderSkills();showCatalog();
});