import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// In-memory cache for profile summaries
const memoryCache = new Map<string, any>();

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Authentication endpoint for UppSeekers corporate accounts
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, error: 'Email address is required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailParts = cleanEmail.split('@');

    // Ensure email is valid and belongs to the @uppseekers.com domain
    if (emailParts.length !== 2 || emailParts[0].length === 0 || !cleanEmail.endsWith('@uppseekers.com')) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.',
      });
      return;
    }

    // Check designated password
    if (password !== 'Admits@131') {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.',
      });
      return;
    }

    res.json({
      success: true,
      user: {
        email: cleanEmail,
        loginAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal authentication error' });
  }
});

// Profile Summary Endpoint using Gemini 3.8 Flash
app.post('/api/profile-summary', async (req, res) => {
  try {
    const { student } = req.body;
    if (!student || !student.name) {
      res.status(400).json({ error: 'Student data is required' });
      return;
    }

    // Check if the student has sufficient documented activity
    const totalActivityText = [
      student.internshipWork || '',
      student.research || '',
      student.competitionsAwards || '',
      student.projects || '',
      student.otherActivities || '',
    ].join(' ').trim();

    // Check individual core fields
    const hasInternship = !!(student.internshipWork && student.internshipWork.trim().length > 5);
    const hasResearch = !!(student.research && student.research.trim().length > 5);
    const hasAwards = !!(student.competitionsAwards && student.competitionsAwards.trim().length > 5);
    const hasProjects = !!(student.projects && student.projects.trim().length > 5);

    const missingFields: string[] = [];
    if (!hasInternship) missingFields.push('Internships & Professional Work');
    if (!hasResearch) missingFields.push('Academic & Laboratory Research');
    if (!hasAwards) missingFields.push('Competitions & Honors');
    if (!hasProjects) missingFields.push('Technical or Portfolio Projects');

    // If student has very little information (e.g. less than 2 distinct categories and short text)
    const activeCount = [hasInternship, hasResearch, hasAwards, hasProjects].filter(Boolean).length;
    if (activeCount === 0 || (activeCount === 1 && totalActivityText.length < 80)) {
      res.json({
        hasEnoughInfo: false,
        studentName: student.name,
        missingFields,
        reason: 'The profile currently lacks sufficient activity records, research inquiries, or project documentation to compile a personalized advisor evaluation.',
      });
      return;
    }

    // Check if we have an active in-memory cache for this student
    if (!req.query.force && memoryCache.has(student.id || student.name)) {
      res.json(memoryCache.get(student.id || student.name));
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return structured fallback response if Gemini API key is not yet set
      const result = {
        hasEnoughInfo: true,
        source: 'counselor_synthesizer',
        ...buildIntelligentMentorSummary(student, missingFields),
      };
      memoryCache.set(student.id || student.name, result);
      res.json(result);
      return;
    }

    const prompt = `You are the senior admissions counselor and academic mentor who personally guided and handled this high school student (${student.name}, Class of ${student.classOf}, admitted/attending ${student.university} for ${student.course || 'Computer Science'}).

Student Profile Data:
- University: ${student.university}
- Course: ${student.course}
- Class Cohort: ${student.classOf}
- Academics / GPA: ${student.academicsPerformance || 'Not specified'}
- Standardized Tests: ${student.actSat || 'Not specified'}
- AP Courses: ${student.apTaken || 'Not specified'}
- Internships & Work: ${student.internshipWork || 'None documented'}
- Research Experience: ${student.research || 'None documented'}
- Competitions & Awards: ${student.competitionsAwards || 'None documented'}
- Technical Projects: ${student.projects || 'None documented'}
- Summer Programs: ${student.summerPrograms || 'None documented'}
- Extracurriculars & Other: ${student.otherActivities || 'None documented'}

Write a comprehensive counselor dossier evaluation.
CRITICAL INSTRUCTIONS:
1. VOICE: Write as a real human mentor who personally handled this student during their journey (e.g., "When we first mapped out ${student.name.split(' ')[0]}'s strategic trajectory...", "In our advising sessions, our primary objective was...", "We deliberately guided them toward..."). It must sound authentic, insightful, caring, and authoritative.
2. WIDTH OF KNOWLEDGE: Evaluate their breadth of knowledge across disciplines (e.g., interdisciplinary connections, versatility).
3. DEPTH OF KNOWLEDGE: Evaluate their technical rigor and depth of mastery in their primary domain (e.g., graduate-level theoretical stamina, lab instrumentation, algorithmic complexity).
4. % OF STUDENTS DOING THE ACTIVITY: Explicitly estimate the benchmark rarity / percentage of competitive applicants nationwide or globally who achieve or participate in their key activities (e.g., "<0.2% of high school applicants", "Top 1-2% of STEM students", etc.).
5. WHY WAS THAT SUGGESTED: For each highlighted activity, explain the strategic advising rationale — why you and your advising team recommended that specific pursuit early on (e.g., why this research topic was chosen to establish academic authenticity beyond test scores, or why this corporate internship was targeted to convert classroom coding into production infrastructure).

Return ONLY a valid JSON object matching this schema.`;

    // Attempt Gemini call with automatic fallback if rate-limited (429) or high-demand (503)
    let parsedJson: any = null;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hasEnoughInfo: { type: Type.BOOLEAN },
              counselorVoiceSummary: {
                type: Type.STRING,
                description: 'Authentic 2-3 paragraph human counselor narrative reflecting on mentoring the student.',
              },
              knowledgeAssessment: {
                type: Type.OBJECT,
                properties: {
                  breadthAnalysis: {
                    type: Type.STRING,
                    description: 'Evaluation of the breadth/width of knowledge across disciplines and applications.',
                  },
                  depthAnalysis: {
                    type: Type.STRING,
                    description: 'Evaluation of the depth of technical rigor and theoretical mastery.',
                  },
                  technicalLevel: {
                    type: Type.STRING,
                    description: 'Short tag, e.g., Graduate-Level Theoretical Rigor, Advanced Lab Inquiry, Pre-Collegiate Distinction.',
                  },
                },
                required: ['breadthAnalysis', 'depthAnalysis', 'technicalLevel'],
              },
              activityBenchmarking: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    activityName: { type: Type.STRING },
                    category: { type: Type.STRING },
                    rarityPercent: {
                      type: Type.STRING,
                      description: 'e.g. <0.2% of national applicants, Top 1.5% of STEM candidates',
                    },
                    whySuggested: {
                      type: Type.STRING,
                      description: 'Why the mentor suggested this specific activity in their advising roadmap.',
                    },
                    knowledgeContribution: {
                      type: Type.STRING,
                      description: 'How this activity solidified breadth or depth of knowledge.',
                    },
                  },
                  required: ['activityName', 'rarityPercent', 'whySuggested'],
                },
              },
              strategicAdmissionsVerdict: {
                type: Type.STRING,
                description: 'Summary of how this profile stood out to top-tier admissions committees.',
              },
            },
            required: [
              'hasEnoughInfo',
              'counselorVoiceSummary',
              'knowledgeAssessment',
              'activityBenchmarking',
              'strategicAdmissionsVerdict',
            ],
          },
        },
      });

      parsedJson = JSON.parse(response.text || '{}');
    } catch (apiErr: any) {
      // Log warning and seamlessly use intelligent counselor synthesizer
      const errMsg = apiErr?.message || String(apiErr);
      console.warn('Gemini API quota or service unavailable (429/503), activating advisor engine fallback:', errMsg);
      parsedJson = buildIntelligentMentorSummary(student, missingFields);
      parsedJson.source = 'counselor_synthesizer_fallback';
    }

    const finalResult = {
      ...parsedJson,
      source: parsedJson.source || 'gemini_3.8_flash',
      studentName: student.name,
    };

    memoryCache.set(student.id || student.name, finalResult);
    res.json(finalResult);
  } catch (err: any) {
    console.warn('Unhandled error in profile summary route, delivering fallback synthesis:', err);
    const { student } = req.body;
    if (student) {
      const fallbackResult = {
        hasEnoughInfo: true,
        source: 'counselor_synthesizer_fallback',
        ...buildIntelligentMentorSummary(student, []),
      };
      res.json(fallbackResult);
    } else {
      res.status(500).json({ error: 'Failed to process student summary' });
    }
  }
});

/**
 * Intelligent mentor assessment synthesizer used when Gemini is offline or as immediate response
 */
function buildIntelligentMentorSummary(student: any, missingFields: string[]) {
  const firstName = student.name ? student.name.split(' ')[0] : 'The student';
  const activities: any[] = [];

  // Inspect research
  if (student.research && student.research.trim().length > 10) {
    const isPrimes = student.research.toLowerCase().includes('primes');
    const isJournal = student.research.toLowerCase().includes('journal') || student.research.toLowerCase().includes('publication');
    activities.push({
      activityName: student.research.split('\n')[0].replace(/^[•\-\*]\s*/, ''),
      category: 'Research & Scholarly Inquiry',
      rarityPercent: isPrimes ? '<0.1% of national applicants' : isJournal ? '~0.8% of high school applicants' : 'Top ~2.5% of pre-college researchers',
      whySuggested: `We originally guided ${firstName} toward specialized research to bridge theoretical coursework with original scholarly inquiry, giving admissions committees undeniable proof of graduate-level intellectual endurance.`,
      knowledgeContribution: 'Demonstrates deep academic rigor, literature review comprehension, and empirical testing methodologies.',
    });
  }

  // Inspect internships
  if (student.internshipWork && student.internshipWork.trim().length > 10) {
    const isMajorCorp = /ibm|microsoft|schneider|de nora|intel|google|apple/i.test(student.internshipWork);
    activities.push({
      activityName: student.internshipWork.split('\n')[0].replace(/^[•\-\*]\s*/, ''),
      category: 'Industry & Technical Experience',
      rarityPercent: isMajorCorp ? 'Fewer than 1.5% of high school applicants' : 'Top ~4% of pre-college applicants',
      whySuggested: `We advised ${firstName} to secure production engineering experience early on to balance academic theory with collaborative software lifecycle delivery in enterprise ecosystems.`,
      knowledgeContribution: 'Cultivates breadth across distributed architecture, team version control, and real-world deployment.',
    });
  }

  // Inspect awards
  if (student.competitionsAwards && student.competitionsAwards.trim().length > 10) {
    const isOlympiad = /usamo|usaco|aime|isef|regeneron|olympiad/i.test(student.competitionsAwards);
    activities.push({
      activityName: student.competitionsAwards.split('\n')[0].replace(/^[•\-\*]\s*/, ''),
      category: 'Academic Competitions & Honors',
      rarityPercent: isOlympiad ? '<0.5% of competitive STEM students' : 'Top ~3% of academic achievers',
      whySuggested: `We recommended targeting national-level benchmarking competitions to independently validate ${firstName}'s problem-solving acumen against standard applicant pools.`,
      knowledgeContribution: 'Proves high-pressure cognitive agility and mastery over algorithmic problem-solving paradigms.',
    });
  }

  // Inspect projects
  if (student.projects && student.projects.trim().length > 10) {
    activities.push({
      activityName: student.projects.split('\n')[0].replace(/^[•\-\*]\s*/, ''),
      category: 'Independent Engineering & Projects',
      rarityPercent: 'Top ~5% of student builders',
      whySuggested: `We suggested architecting an independent end-to-end technical capstone so ${firstName} could demonstrate full-stack problem discovery, execution, and user impact.`,
      knowledgeContribution: 'Demonstrates self-directed prototyping breadth and practical technical synthesis.',
    });
  }

  const counselorVoiceSummary = `When our advisory team first began working with ${firstName}, our immediate strategic objective was translating their high academic aptitude into a cohesive, differentiated narrative. Rather than allowing ${firstName} to compile fragmented extracurriculars, we focused on anchoring their profile around deep technical authenticity and rigorous inquiry.

Throughout our advising sessions, ${firstName} consistently demonstrated genuine intellectual vitality. By coupling rigorous domain exploration with hands-on application, they distinguished themselves from typical high-scoring applicants. The resulting balance between conceptual depth and practical execution positioned them seamlessly for admission into ${student.university}.`;

  return {
    hasEnoughInfo: true,
    studentName: student.name,
    counselorVoiceSummary,
    knowledgeAssessment: {
      breadthAnalysis: `${firstName} demonstrates impressive intellectual breadth by synthesizing coursework with practical domains—bridging computational methods with real-world problem spaces across industry, robotics, and social systems.`,
      depthAnalysis: `In their focal areas, ${firstName} exhibits advanced conceptual depth, tackling problems with graduate-level analytical patience rather than surface-level tutorial implementations.`,
      technicalLevel: activities.length >= 3 ? 'Advanced Scholarly & Technical Distinction' : 'High Technical Proficiency',
    },
    activityBenchmarking: activities,
    strategicAdmissionsVerdict: `${firstName}'s profile succeeded because every strategic recommendation was executed with high craft—presenting an applicant with both verifiable institutional impact and exceptional intellectual stamina.`,
  };
}

// Endpoint to fetch public/shared Google Sheet data in CSV format
app.post('/api/sheets/fetch', async (req, res) => {
  try {
    const { sheetUrl } = req.body || {};
    if (!sheetUrl || typeof sheetUrl !== 'string') {
      res.status(400).json({ error: 'Google Sheet URL or CSV link is required' });
      return;
    }

    let csvUrl = sheetUrl.trim();

    // If standard Google Sheet URL, transform into direct CSV export link
    const sheetIdMatch = csvUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetIdMatch && sheetIdMatch[1]) {
      const sheetId = sheetIdMatch[1];
      const gidMatch = csvUrl.match(/[#&?]gid=([0-9]+)/);
      const gidParam = gidMatch ? `&gid=${gidMatch[1]}` : '';
      csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gidParam}`;
    }

    const response = await fetch(csvUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `Failed to fetch sheet (HTTP ${response.status}). Please make sure the Google Sheet permission is set to "Anyone with the link" (Viewer) or "Published to the web".`,
      });
      return;
    }

    const csvText = await response.text();
    if (!csvText || csvText.length < 20) {
      res.status(400).json({ error: 'Spreadsheet returned empty or insufficient CSV content.' });
      return;
    }

    res.json({ success: true, csvText });
  } catch (error) {
    console.error('Error fetching Google Sheet:', error);
    res.status(500).json({ error: 'Failed to retrieve spreadsheet. Please ensure the link is publicly accessible.' });
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
