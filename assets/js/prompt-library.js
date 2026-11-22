/* Principal's Prompt Library. Generated from one source; edit there, not here. */
window.AISL_PROMPTS = {
"cats": [
{
"id": "office",
"en": "Office & circulars",
"hi": "कार्यालय और परिपत्र"
},
{
"id": "staff",
"en": "Teachers, CPD & observation",
"hi": "शिक्षक, CPD और अवलोकन"
},
{
"id": "curriculum",
"en": "Timetable & CT/AI curriculum",
"hi": "समय-सारणी और CT/AI पाठ्यक्रम"
},
{
"id": "assessment",
"en": "Teaching & assessment",
"hi": "शिक्षण और मूल्यांकन"
},
{
"id": "parents",
"en": "Parents & reports",
"hi": "अभिभावक और रिपोर्ट"
},
{
"id": "branding",
"en": "Admissions & school image",
"hi": "प्रवेश और विद्यालय की छवि"
},
{
"id": "sheets",
"en": "Spreadsheet helper",
"hi": "स्प्रेडशीट सहायक"
},
{
"id": "policy",
"en": "Policy, compliance & safety",
"hi": "नीति, अनुपालन और सुरक्षा"
},
{
"id": "leader",
"en": "Leadership & planning",
"hi": "नेतृत्व और योजना"
}
],
"prompts": [
{
"id": "OF-01",
"cat": "office",
"title_en": "Handwritten note to a bilingual circular",
"title_hi": "हस्तलिखित नोट से द्विभाषी परिपत्र",
"use": "You have a rough note, a WhatsApp message or a photo of a notice and need a proper circular.",
"prompt": "Turn my rough note below into a formal CBSE-style circular for [parents of Classes ___ / all staff].\nInclude: reference number [___], date [___], subject line, body, and signature block for the Principal.\nKeep it under 180 words, in simple language. Give English first, then Hindi, with the same meaning.\nMy note: [paste or type the note here, or attach the photo]\nEnd with \"Please verify\": every date, time, fee and venue I must check.",
"tab": "",
"ref": "Session 1 · Mission 2"
},
{
"id": "OF-02",
"cat": "office",
"title_en": "Summarise a CBSE circular for staff",
"title_hi": "CBSE परिपत्र का स्टाफ के लिए सारांश",
"use": "A new CBSE circular has arrived and you need staff to understand it in five minutes.",
"prompt": "I am pasting a CBSE circular below. Summarise it for my teachers:\n1. What it is about, in 2 lines.\n2. What changes for our school, as bullet points.\n3. Who must do what, by when, as a table: Action | Responsible role | Deadline.\n4. Questions we should ask CBSE or our Sahodaya.\nUse only what the circular says. If something is unclear, say \"not stated in the circular\".\nCircular text: [paste the text, or upload the PDF]",
"tab": "",
"ref": ""
},
{
"id": "OF-03",
"cat": "office",
"title_en": "Staff meeting agenda and minutes",
"title_hi": "स्टाफ बैठक का एजेंडा और कार्यवृत्त",
"use": "Before and after any staff, SMC or PTM meeting.",
"prompt": "Prepare an agenda for a [45]-minute [staff / SMC / department] meeting on [date].\nTopics: [topic 1], [topic 2], [topic 3]. Add time for each item and who leads it.\nAfter the meeting I will paste my rough points. Then turn them into minutes with:\nDecisions taken | Action | Owner (role) | Deadline. Keep it to one page.",
"tab": "",
"ref": ""
},
{
"id": "OF-04",
"cat": "office",
"title_en": "Reply to an official letter or email",
"title_hi": "आधिकारिक पत्र या ईमेल का उत्तर",
"use": "A letter from the DIOS office, CBSE regional office, Sahodaya or a vendor needs a polite, clear reply.",
"prompt": "Draft a formal reply to the letter below on behalf of the Principal of [school name].\nOur position: [what we agree to / what we need / what we cannot do and why].\nTone: respectful, clear, short (under 150 words). Include subject line and reference to their letter number and date.\nLetter: [paste here]",
"tab": "",
"ref": ""
},
{
"id": "OF-05",
"cat": "office",
"title_en": "Notice in simple Hindi for support staff",
"title_hi": "सहायक कर्मचारियों के लिए सरल हिंदी सूचना",
"use": "Instructions for drivers, peons, guards or helpers who prefer Hindi.",
"prompt": "Write a short notice in very simple Hindi (Devanagari) for our [drivers / support staff] about [topic, e.g. new bus timings, safety drill, uniform].\nUse short sentences and numbered points. No more than 8 points. Add a line at the end: \"कोई प्रश्न हो तो कार्यालय में [name/role] से मिलें।\"",
"tab": "",
"ref": ""
},
{
"id": "ST-01",
"cat": "staff",
"title_en": "Find CPD gaps and plan training",
"title_hi": "CPD की कमी पहचानें और प्रशिक्षण योजना बनाएँ",
"use": "Every month, after updating the CPD Tracker.",
"prompt": "Below is my CPD Tracker (teacher codes only). The target is [50] hours per teacher per year, with at least [25] through CBSE or government institutes.\n1. List teachers who are \"Critical\" or \"Behind\", with hours still needed.\n2. Group them by subject and suggest a school-based workshop plan for the next [8] weeks to close the gap.\n3. Suggest free CBSE/government options they could take (I will verify each one).\nData: [copy the CPD Tracker table from Teacher code to Status and paste here]",
"tab": "CPD Tracker",
"ref": "Session 1 · Mission 3"
},
{
"id": "ST-02",
"cat": "staff",
"title_en": "Fair observation rubric",
"title_hi": "निष्पक्ष कक्षा-अवलोकन रूब्रिक",
"use": "Before a round of classroom observations.",
"prompt": "Create a classroom observation rubric with 5 criteria: Planning & materials, Engagement, Questioning & checking, Inclusion, Link to computational thinking.\nFor each criterion describe levels 1 Beginning, 2 Developing, 3 Proficient, 4 Exemplary in one line each, as a table.\nMake it observable in a [35]-minute visit, suitable for Classes [___], and usable without any device in the classroom.",
"tab": "Observation Log",
"ref": "Session 1 · Mission 4"
},
{
"id": "ST-03",
"cat": "staff",
"title_en": "Kind, specific observation feedback",
"title_hi": "दयालु और विशिष्ट अवलोकन प्रतिक्रिया",
"use": "After you have filled a row in the Observation Log.",
"prompt": "Here is one row from my Observation Log (teacher code only). Write feedback for the teacher that:\n- starts with two specific strengths I saw,\n- gives no more than two next steps, each with one practical classroom idea,\n- offers the support I will provide,\n- is warm and respectful, under 150 words, in [English / Hindi / both].\nRow: [paste the row with headers]",
"tab": "Observation Log",
"ref": "Session 1 · Mission 4"
},
{
"id": "ST-04",
"cat": "staff",
"title_en": "Spot patterns across many observations",
"title_hi": "कई अवलोकनों में पैटर्न पहचानें",
"use": "At the end of a month or term, to plan whole-staff training.",
"prompt": "Below is my Observation Log for [month/term] (teacher codes only).\n1. Which criterion has the lowest average across the school? Which has the highest?\n2. Name 3 patterns you see, with evidence from the rows.\n3. Suggest one 30-minute staff workshop for the weakest area, with an agenda.\nDo not rank or label individual teachers. Data: [paste the table]",
"tab": "Observation Log",
"ref": ""
},
{
"id": "ST-05",
"cat": "staff",
"title_en": "Substitution and duty roster",
"title_hi": "प्रतिस्थापन और ड्यूटी रोस्टर",
"use": "When several teachers are absent or for exam/assembly duties.",
"prompt": "Make a substitution plan for today. Absent: [teacher codes and their periods]. Free teachers by period: [list].\nRules: no teacher gets more than [2] extra periods, prefer same-subject substitutes, keep Class X and XII covered first.\nGive a table: Period | Class | Absent teacher | Substitute | Suggested activity.",
"tab": "",
"ref": ""
},
{
"id": "ST-06",
"cat": "staff",
"title_en": "Teacher appreciation note",
"title_hi": "शिक्षक प्रशंसा पत्र",
"use": "To recognise good work at an assembly, in a staff group or a letter.",
"prompt": "Write a short appreciation note (under 90 words) for a teacher who [what they did, e.g. ran the science fair, improved Class 8 results]. Make it specific and sincere, not flowery. Give [English / Hindi / both].",
"tab": "",
"ref": ""
},
{
"id": "CU-01",
"cat": "curriculum",
"title_en": "Fit CT & AI hours into the timetable",
"title_hi": "CT और AI घंटों को समय-सारणी में फिट करें",
"use": "When planning the CT & AI curriculum for Classes III–VIII.",
"prompt": "Below is my CT & AI Plan (classes, sections, hours, periods per week). Our timetable has [8] periods a day, [6] days a week.\nSuggest where these periods can come from without dropping any board subject: which existing periods to integrate CT into, and which to use as dedicated CT & AI periods.\nGive a table per class: Day | Period | Subject period used | CT & AI activity type. Flag any class where the plan is not realistic.\nPlan: [copy the CT & AI Plan table and paste here]",
"tab": "CT & AI Plan",
"ref": "Session 3 · Mission 1"
},
{
"id": "CU-02",
"cat": "curriculum",
"title_en": "Unplugged CT lesson (no lab)",
"title_hi": "बिना कंप्यूटर CT पाठ",
"use": "A teacher needs a CT lesson that works with chalk, cards or objects.",
"prompt": "Design a [35]-minute unplugged computational-thinking lesson for Class [___] on [pattern recognition / algorithms / decomposition / abstraction].\nUse only things a village classroom has: chalk, paper, bottle caps, bangles, the children themselves.\nInclude: learning objective, a 5-minute hook, the main activity in steps, 3 check questions, and a 2-line homework task. Link it to the CBSE CT & AI handbook for that class where possible (I will verify).",
"tab": "",
"ref": "Session 3 · Mission 2"
},
{
"id": "CU-03",
"cat": "curriculum",
"title_en": "Integrate CT into a subject chapter",
"title_hi": "विषय के अध्याय में CT जोड़ें",
"use": "To show teachers that CT is not an extra subject.",
"prompt": "For Class [___] [subject], chapter \"[chapter name]\", suggest 3 short activities (5–10 minutes each) that teach computational thinking while teaching the chapter.\nFor each: CT skill used, steps, materials, and one question to check understanding. Keep it within the NCERT textbook content.",
"tab": "",
"ref": ""
},
{
"id": "CU-04",
"cat": "curriculum",
"title_en": "Student AI project on a local problem",
"title_hi": "स्थानीय समस्या पर छात्र AI परियोजना",
"use": "For a Class VI–IX project, science fair or ATL activity.",
"prompt": "Suggest 5 low-cost student AI project ideas for Classes [___] in a [rural / small-town] school in [district], UP, that solve a local problem (water, farming, traffic, waste, health, attendance).\nFor each: the problem, what the students build (e.g. a Teachable Machine model), data they can collect safely without personal information, materials, and a 4-week plan.",
"tab": "",
"ref": "Session 3 · Mission 5"
},
{
"id": "CU-05",
"cat": "curriculum",
"title_en": "Annual academic calendar draft",
"title_hi": "वार्षिक शैक्षणिक कैलेंडर का मसौदा",
"use": "At the start of the session or before the second term.",
"prompt": "Draft an academic calendar for [April 2027–March 2028] for a CBSE school in Uttar Pradesh.\nInclude: term dates, periodic tests, half-yearly and annual exams, PTMs, CT & AI project weeks, sports day, annual day, and UP public holidays (mark these \"verify against the official list\").\nGive a month-by-month table. Leave the two Class X board exam windows marked \"as per CBSE date sheet\".",
"tab": "",
"ref": ""
},
{
"id": "AS-01",
"cat": "assessment",
"title_en": "Competency-based questions, board pattern",
"title_hi": "बोर्ड पैटर्न की योग्यता-आधारित प्रश्न",
"use": "Building a question bank or a periodic test.",
"prompt": "Create [5] competency-based questions for Class [___] [subject], chapter \"[chapter]\":\n[2] assertion-reason, [2] case-based, [1] source-based. Follow the latest CBSE sample-paper style.\nGive the output as a table with exactly these columns so I can paste it into my sheet:\nID | Class | Subject | Chapter | Question type | Question | Answer | Marks | Competency tested\nUse only content from the NCERT textbook.",
"tab": "Question Bank",
"ref": "Session 3 · Mission 3"
},
{
"id": "AS-02",
"cat": "assessment",
"title_en": "Make AI check its own questions",
"title_hi": "AI से अपने प्रश्न स्वयं जँचवाएँ",
"use": "Right after AS-01, before any teacher review.",
"prompt": "Now act as a strict CBSE paper-setter and check each question you just wrote:\n- Is the answer correct and complete? Is the question within the NCERT chapter?\n- Is there more than one correct option or any ambiguity?\n- Does it test application, not just recall?\nGive a table: ID | Problem found | Corrected version. If a question is fine, write \"No change\".",
"tab": "Question Bank",
"ref": "Session 3 · Mission 3"
},
{
"id": "AS-03",
"cat": "assessment",
"title_en": "Keep answers inside the textbook (NotebookLM)",
"title_hi": "उत्तर पाठ्यपुस्तक के भीतर रखें (NotebookLM)",
"use": "Use in NotebookLM after uploading the NCERT chapter PDF.",
"prompt": "Using only the uploaded chapter, create a one-page revision note for Class [___] students with: 8 key ideas, 5 important terms with meanings, and 5 practice questions with page references.\nIf something is not in the chapter, do not add it.",
"tab": "",
"ref": "Session 3 · Mission 4"
},
{
"id": "AS-04",
"cat": "assessment",
"title_en": "Remedial plan from performance bands",
"title_hi": "प्रदर्शन बैंड से उपचारात्मक योजना",
"use": "After a test, using bands (Strong / Developing / Needs support), not marks or names.",
"prompt": "In Class [___] [subject], after the [test name]: [number] students are Strong, [number] Developing, [number] Need support. The weakest topics were [topics].\nPlan 4 weeks of remedial support that fits inside normal periods: weekly focus, a 10-minute daily routine, peer-learning ideas, and a short check at the end of each week.",
"tab": "",
"ref": ""
},
{
"id": "AS-05",
"cat": "assessment",
"title_en": "Lesson plan with differentiation",
"title_hi": "विविधता के साथ पाठ योजना",
"use": "For a teacher who wants a ready lesson plan that reaches every learner.",
"prompt": "Write a [40]-minute lesson plan for Class [___] [subject] on \"[topic]\".\nInclude objectives, a hook, main activity, three levels of tasks (support / core / challenge), a quick exit check, and homework. Mention one way to include a child with [reading difficulty / low vision / hearing difficulty].",
"tab": "",
"ref": ""
},
{
"id": "PA-01",
"cat": "parents",
"title_en": "Report-card remarks that sound human",
"title_hi": "रिपोर्ट कार्ड टिप्पणियाँ जो मानवीय लगें",
"use": "Report card time. Use student codes and bands only.",
"prompt": "Below are rows from my Report Remarks tab (student codes and performance bands only, no names or marks).\nFor each student write one remark in English (35–45 words) and the same remark in Hindi. Each remark must mention one real strength, one specific next step, and end on encouragement. No two remarks should start the same way.\nGive a table: Student code | Remark (English) | Remark (Hindi).\nRows: [copy the table from Student code to Teacher observation 2]",
"tab": "Report Remarks",
"ref": "Session 2 · Mission 7"
},
{
"id": "PA-02",
"cat": "parents",
"title_en": "Answer parents' questions about AI",
"title_hi": "AI के बारे में अभिभावकों के प्रश्नों का उत्तर",
"use": "Before a PTM, orientation or when parents worry about AI and homework.",
"prompt": "Parents of Classes [___] are asking: \"[paste the questions, e.g. Will AI make my child lazy? Is it safe? Will you use my child's data?]\"\nWrite a calm FAQ in simple Hindi with English below each answer. Explain what our school allows, what it does not, and how we protect data. Under 300 words. Our AI policy says: [paste 3–5 key lines of your AI policy].",
"tab": "",
"ref": "Session 2 · Mission 8"
},
{
"id": "PA-03",
"cat": "parents",
"title_en": "Theme and sentiment for PTM feedback",
"title_hi": "PTM प्रतिक्रिया के विषय और भाव",
"use": "After collecting anonymous parent comments.",
"prompt": "Below are anonymous parent comments. For each, suggest a Theme (Teaching, Homework, Transport, Fees, Safety, Communication, Facilities, Other) and a Sentiment (Positive, Neutral, Negative).\nGive a table: # | Theme | Sentiment, so I can paste it next to the comments.\nThen list the top 3 themes by number of negative comments.\nComments: [copy the # and Comment columns from Parent Feedback]",
"tab": "Parent Feedback",
"ref": "Session 2 · Mission 10"
},
{
"id": "PA-04",
"cat": "parents",
"title_en": "30-day action plan from feedback",
"title_hi": "प्रतिक्रिया से 30-दिवसीय कार्य योजना",
"use": "After PA-03, to show parents that their feedback was heard.",
"prompt": "Using the themes above, suggest a 30-day action plan with at most 5 actions.\nTable columns exactly: Action | Owner (role) | By when | How we tell parents.\nThen write a short WhatsApp message to parents (under 80 words, Hindi and English) telling them what we heard and what we will do.",
"tab": "Parent Feedback",
"ref": "Session 2 · Mission 10"
},
{
"id": "PA-05",
"cat": "parents",
"title_en": "Difficult conversation with a parent",
"title_hi": "अभिभावक के साथ कठिन बातचीत",
"use": "Preparing for a meeting about behaviour, attendance or fees.",
"prompt": "Help me prepare for a meeting with a parent about [attendance / behaviour / fees / a complaint]. Facts: [describe without names].\nGive: an opening line, 3 key points to make, 3 things the parent may say and calm responses, and a closing with an agreed next step. Respectful, firm, in [Hindi / English].",
"tab": "",
"ref": ""
},
{
"id": "PA-06",
"cat": "parents",
"title_en": "Monthly newsletter",
"title_hi": "मासिक समाचार पत्र",
"use": "Once a month for parents' WhatsApp group or notice board.",
"prompt": "Write a one-page monthly newsletter for parents for [month]. Highlights: [3–5 events or achievements]. Coming up: [dates]. One tip for parents: [topic].\nWarm, short sections with headings, English and Hindi. No student names or photos mentioned.",
"tab": "",
"ref": ""
},
{
"id": "BR-01",
"cat": "branding",
"title_en": "Honest admission campaign",
"title_hi": "ईमानदार प्रवेश अभियान",
"use": "Planning admissions for the next session.",
"prompt": "Plan a 6-week admission campaign for [2027-28] for our school. Our real strengths: [3–5 strengths]. Fees: [range]. Classes with seats: [classes].\nGive: weekly plan, 3 WhatsApp posts, 1 poster text, 1 short video script (30 seconds). Every claim must be true and checkable; no \"best school\" or \"100% results\" unless I give proof.",
"tab": "Admission Enquiries",
"ref": "Session 2 · Mission 6"
},
{
"id": "BR-02",
"cat": "branding",
"title_en": "Analyse admission enquiries",
"title_hi": "प्रवेश पूछताछ का विश्लेषण",
"use": "Every week during admission season.",
"prompt": "Below is my Admission Enquiries tab (enquiry codes only). Tell me:\n1. Which source brings the most enquiries and the most admissions?\n2. Which enquiries are overdue for follow-up, and a polite follow-up message for each status (Enquired, Visited, Form taken).\n3. Two things to change in next week's campaign.\nData: [copy the table from Date to Notes, plus the Summary]",
"tab": "Admission Enquiries",
"ref": ""
},
{
"id": "BR-03",
"cat": "branding",
"title_en": "Google Business Profile description",
"title_hi": "Google Business Profile विवरण",
"use": "Setting up or improving the school's Google listing.",
"prompt": "Write a Google Business Profile description for [school name], CBSE-affiliated, in [town, district], UP (max 750 characters). Include classes offered, 3 real strengths, facilities and a welcome line. No exaggeration. Then suggest 5 photo ideas that show real school life without children's faces.",
"tab": "",
"ref": "Session 2 · Mission 9"
},
{
"id": "BR-04",
"cat": "branding",
"title_en": "Calm reply to a bad review",
"title_hi": "खराब समीक्षा का शांत उत्तर",
"use": "When an unhappy review appears online.",
"prompt": "A review of our school says: \"[paste review]\".\nWrite a public reply under 80 words: thank them, acknowledge the concern without arguing, mention one concrete step, and invite them to meet [role] at the school. No personal details about the reviewer or any child.",
"tab": "",
"ref": "Session 2 · Mission 9"
},
{
"id": "BR-05",
"cat": "branding",
"title_en": "Event post and press note",
"title_hi": "कार्यक्रम पोस्ट और प्रेस नोट",
"use": "After annual day, a science fair or a visit.",
"prompt": "Write (a) a WhatsApp/Facebook post (under 60 words) and (b) a short press note (under 150 words, Hindi and English) about [event] held on [date]. Key facts: [chief guest, number of participants, highlights]. Mention no child by name.",
"tab": "",
"ref": ""
},
{
"id": "SH-01",
"cat": "sheets",
"title_en": "Explain a tab and what to do next",
"title_hi": "टैब समझाएँ और आगे क्या करें",
"use": "When you open a tab and are not sure what the numbers mean.",
"prompt": "I am pasting a table from my School Command Sheet tab \"[tab name]\". Explain in 5 simple points what it shows, what looks good, what needs my attention this week, and one action for me.\nTable: [paste]",
"tab": "Any tab",
"ref": ""
},
{
"id": "SH-02",
"cat": "sheets",
"title_en": "Write a formula for me",
"title_hi": "मेरे लिए फ़ॉर्मूला लिखें",
"use": "When you want the sheet to calculate something new.",
"prompt": "In Google Sheets, my data is in tab \"[tab]\" with headers in row [4] and data from row [5] to [100]. Column [B] is [___], column [F] is [___].\nWrite one formula to [what you want, e.g. count overdue follow-ups / average of ratings / total hours]. Tell me exactly which cell to put it in and explain it in one line. Use only functions that work in Google Sheets.",
"tab": "Any tab",
"ref": ""
},
{
"id": "SH-03",
"cat": "sheets",
"title_en": "Fix a formula error",
"title_hi": "फ़ॉर्मूला की त्रुटि ठीक करें",
"use": "When a cell shows #REF!, #VALUE!, #N/A or a wrong number.",
"prompt": "My Google Sheets formula in cell [cell] is: [paste formula]. It shows [error or wrong result]. The data it uses is: [describe columns].\nExplain the problem in plain words and give me the corrected formula.",
"tab": "Any tab",
"ref": ""
},
{
"id": "SH-04",
"cat": "sheets",
"title_en": "Table I can paste straight into the sheet",
"title_hi": "ऐसी तालिका जो सीधे शीट में पेस्ट हो",
"use": "Add this line to any prompt whose answer should go into a tab.",
"prompt": "Give the answer only as a table with exactly these columns, in this order, and no extra text above or below it:\n[copy the header row from the tab, e.g. Action | Owner (role) | By when | How we tell parents]",
"tab": "Any tab",
"ref": ""
},
{
"id": "SH-05",
"cat": "sheets",
"title_en": "Turn a tab into a one-page report",
"title_hi": "टैब से एक-पृष्ठ रिपोर्ट",
"use": "For a monthly report to management, SMC or the Sahodaya.",
"prompt": "Using the data below from my \"[tab]\" tab, write a one-page report for [management / SMC / Sahodaya] for [month]:\n3 headline numbers, what improved, what is behind, and 3 decisions I need from them. Simple language, no jargon.\nData: [paste]",
"tab": "Any tab",
"ref": ""
},
{
"id": "SH-06",
"cat": "sheets",
"title_en": "Suggest a chart",
"title_hi": "चार्ट सुझाएँ",
"use": "When you want a picture of the data for a meeting.",
"prompt": "For this data from my \"[tab]\" tab, which one chart would explain it best to [audience], and why? Then give step-by-step clicks to make it in Google Sheets (Insert → Chart …).\nData: [paste]",
"tab": "Any tab",
"ref": ""
},
{
"id": "PO-01",
"cat": "policy",
"title_en": "School AI policy, version 1",
"title_hi": "विद्यालय की AI नीति, संस्करण 1",
"use": "Writing or updating your school's AI policy.",
"prompt": "Draft a one-page AI use policy for [school name] for students (Classes [___]), teachers and office staff.\nSections: purpose, what is allowed, what is not allowed, data protection (no student personal data in AI tools, in line with India's DPDP Act 2023), academic honesty, who to ask, review date.\nSimple English with a Hindi version. Practical for a school with [limited devices].",
"tab": "",
"ref": "Session 1 · Mission 5"
},
{
"id": "PO-02",
"cat": "policy",
"title_en": "Check a draft for personal data",
"title_hi": "मसौदे में व्यक्तिगत डेटा की जाँच",
"use": "Before you paste anything into AI, or before sending a document out.",
"prompt": "Check the text below for any personal data: names, phone numbers, addresses, Aadhaar, APAAR IDs, roll numbers, marks linked to a person, photos or health details.\nList each item you find and suggest how to replace it with a code (S01, T01, E001). Do not repeat the personal data in your answer.\nText: [paste]",
"tab": "",
"ref": ""
},
{
"id": "PO-03",
"cat": "policy",
"title_en": "SQAAF self-assessment helper",
"title_hi": "SQAAF स्व-मूल्यांकन सहायक",
"use": "When preparing the school's SQAAF self-assessment.",
"prompt": "We are preparing our SQAAF self-assessment. For the domain \"[domain, e.g. Curriculum / Teaching-learning / Inclusive practices]\", here is what we currently do: [describe].\nSuggest the evidence we should collect, where our practice looks strong, what is missing, and 3 realistic improvements for this year.\nUse the official SQAAF document for the actual descriptors; tell me what to check there.",
"tab": "",
"ref": ""
},
{
"id": "PO-04",
"cat": "policy",
"title_en": "Safety drill and SOP",
"title_hi": "सुरक्षा अभ्यास और SOP",
"use": "Fire, earthquake, bus safety or child-protection procedures.",
"prompt": "Write a simple SOP for [fire drill / earthquake drill / bus safety / visitor entry] for a school with [number] students and [buildings/floors].\nInclude roles, step-by-step actions, a 1-page checklist, and a Hindi version for support staff. Mark anything that must match local authority rules as \"verify\".",
"tab": "",
"ref": ""
},
{
"id": "LE-01",
"cat": "leader",
"title_en": "Weekly priorities from the whole sheet",
"title_hi": "पूरी शीट से साप्ताहिक प्राथमिकताएँ",
"use": "Monday morning, 10 minutes.",
"prompt": "Here are the summary numbers from my School Command Sheet this week:\nCPD: [teachers behind/critical]. Observations done: [number]. CT & AI sections not started: [number]. Questions verified: [x of y]. Admissions: [enquiries, conversion, overdue]. Remarks reviewed: [x of y]. Parent actions open: [number].\nGive me the 3 most important things to do this week, who I should delegate each to (by role), and one thing I can stop doing.",
"tab": "All tabs",
"ref": ""
},
{
"id": "LE-02",
"cat": "leader",
"title_en": "School improvement plan",
"title_hi": "विद्यालय सुधार योजना",
"use": "Annual planning or before an inspection.",
"prompt": "Draft a one-year school improvement plan with 4 goals for [school name]. Our context: [students, teachers, strengths, main challenges].\nFor each goal: why it matters, 3 actions, owner (role), monthly milestones, and how we will measure it using our Command Sheet tabs where possible.",
"tab": "",
"ref": ""
},
{
"id": "LE-03",
"cat": "leader",
"title_en": "Speech for assembly or annual day",
"title_hi": "प्रार्थना सभा या वार्षिक उत्सव का भाषण",
"use": "A 2–5 minute speech by the Principal.",
"prompt": "Write a [3]-minute speech for the Principal for [occasion]. Audience: [students / parents / guests]. Message: [main idea]. Include one short story or example from school life and end with a clear call to action. Simple Hindi with English phrases where natural.",
"tab": "",
"ref": ""
},
{
"id": "LE-04",
"cat": "leader",
"title_en": "Think through a decision",
"title_hi": "किसी निर्णय पर सोच-विचार",
"use": "Before a big decision: a new section, a fee change, a new rule.",
"prompt": "I am deciding whether to [decision]. Context: [facts].\nGive me: options (at least 3), the benefits and risks of each for students, teachers, parents and finances, questions I should answer first, and who I should consult. Do not decide for me.",
"tab": "",
"ref": ""
}
],
"sheetCopy": "https://docs.google.com/spreadsheets/d/1B0SdmcTN7xaZUiuz5L8v6oDsIuy6PpFH0AeYSwS7kD0/copy"
};
