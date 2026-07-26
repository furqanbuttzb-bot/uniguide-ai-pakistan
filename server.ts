import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Counselor endpoint
app.post('/api/counselor', async (req, res) => {
  try {
    const { message, history, studentProfile } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const systemInstruction = `You are the official UniGuide AI Admission Counselor for Pakistani students navigating higher education admissions.
You possess deep, accurate knowledge of the Pakistani university system including:
- Top institutions: NUST, FAST-NUCES, LUMS, King Edward Medical University (KEMU), GIKI, Aga Khan University (AKU), COMSATS, UET Lahore, IBA Karachi, ITU Lahore, Quaid-i-Azam University, NED Karachi, PIEAS, Air University, UVAS, BUITEMS, MUST, etc.
- Entry tests: NET (NUST), MDCAT (Medical), ECAT (Engineering), SAT, FAST Admission Test, NTS NAT/GAT, LCAT, etc.
- Merit formulas and aggregate calculation (e.g., NUST/ECAT: 50% Test + 40% FSC + 10% Matric; MDCAT/UHS: 50% MDCAT + 40% FSC + 10% Matric; FAST: 50% Test + 40% FSC + 10% Matric).
- Scholarships: HEC Ehsaas, PEEF, LUMS NOP, USAID, NTHP IBA, Need-based tuition waivers.
- Cities and campuses across Punjab, Sindh, KPK, Balochistan, ICT, and Azad Kashmir.

Greeting style: Warm, polite, professional, encouraging (use "Assalam-o-Alaikum" when starting or greeting).
Provide clean formatting with concise bullet points, bold university names, and clear action steps.
When student profile data (marks, city, budget, program) is provided, make sure to explicitly calculate their estimated merit aggregate, give personalized Safe, Target, and Reach university recommendations matching their city and budget constraints, and outline entry test prep tips.`;

    let profileContext = '';
    if (studentProfile) {
      profileContext = `\n[Student Profile & Preference Context]:
- Matric/O-Level Marks: ${studentProfile.matricPercentage || 'N/A'}%
- Intermediate/FSC Marks: ${studentProfile.interPercentage || 'N/A'}%
- Entrance Test Score: ${studentProfile.entryTestScore ? studentProfile.entryTestScore + '%' : 'Not taken yet'}
- Desired Degree Program: ${studentProfile.desiredProgram || 'General'}
- Preferred City/Region: ${studentProfile.preferredCity || 'Pakistan'} (${studentProfile.preferredProvince || 'All'})
- Maximum Annual Fee Budget: ${studentProfile.annualBudget ? studentProfile.annualBudget + ' PKR' : 'Flexible'}
`;
    }

    // Construct conversation or query Gemini
    let formattedPrompt = `${profileContext}${message}`;
    if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = history
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Student' : 'UniGuide AI'}: ${h.text}`)
        .join('\n');
      formattedPrompt = `Previous Conversation:\n${formattedHistory}\n\n${profileContext}Student's New Question: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: formattedPrompt,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    });

    const replyText = response.text || "I'm here to assist with your university search, merit calculations, and entry test prep. Could you rephrase your query?";

    res.json({ text: replyText });
  } catch (err: unknown) {
    console.error('Counselor API Error:', err);
    res.status(500).json({
      error: 'Failed to generate counseling response.',
      text: "Assalam-o-Alaikum! I had a temporary issue connecting to the AI engine. Please ask your question again or try one of the quick suggestions below.",
    });
  }
});

// AI Admission Predictor endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { matricPercentage, interPercentage, entryTestScore, preferredField, selectedDegreeProgram, annualBudget, province, city } = req.body;

    const prompt = `Analyze this Pakistani student's academic profile for university admissions:
- Target Degree Program: ${selectedDegreeProgram || preferredField}
- Preferred Field of Study: ${preferredField}
- Matric/O-Level Percentage: ${matricPercentage}%
- Intermediate/A-Level Percentage: ${interPercentage}%
- Entry Test Score (if taken): ${entryTestScore ? entryTestScore + '%' : 'Not specified'}
- Annual Budget (PKR): ${annualBudget ? annualBudget + ' PKR' : 'Flexible'}
- Province: ${province}
- City: ${city}

Provide a concise 3-paragraph strategic admission analysis specifically for degree program "${selectedDegreeProgram || preferredField}" in top Pakistani universities (such as NUST, FAST, LUMS, COMSATS, UET, KEMU, UVAS, GIKI, AKU, etc.):
1. **Degree Program Cutoff Evaluation**: Analyze their calculated aggregate score against historical closing merits for ${selectedDegreeProgram || preferredField}.
2. **Top Recommended Universities for ${selectedDegreeProgram || preferredField}**: Detail safe, target, and ambitious reach options, citing specific closing merit trends and seat capacities.
3. **Targeted Entry Test Strategy**: Key entrance test preparation guidance (e.g. MDCAT, NET, ECAT, FAST Test, SAT) and application roadmap for ${selectedDegreeProgram || preferredField}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert Pakistani academic merit evaluator and admissions counselor. Give encouraging, practical, and highly accurate program-specific guidance for Pakistani students.',
        temperature: 0.6,
      },
    });

    res.json({ analysis: response.text || '' });
  } catch (err) {
    console.error('Predictor API Error:', err);
    res.status(500).json({
      error: 'Failed to compute AI analysis',
      analysis: 'Based on historical closing merits in Pakistan, your scores put you in a competitive bracket for several top institutions. Ensure you prepare thoroughly for university entrance exams like NET, ECAT, or MDCAT.',
    });
  }
});

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
    console.log(`UniGuide AI server listening on http://localhost:${PORT}`);
  });
}

startServer();
