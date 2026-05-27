// ─────────────────────────────────────────────────────────────────────────────
// services/gemini.js
//
// IMPORTANT: This file requires the NEW Google GenAI SDK.
// Run in your server folder:
//   npm uninstall @google/generative-ai
//   npm install @google/genai
//
// The old @google/generative-ai package uses the deprecated v1beta API which
// no longer serves any current Gemini models for new projects.
// ─────────────────────────────────────────────────────────────────────────────

const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// Model fallback list (ordered from best free-tier option to last resort)
//
// As of May 2026:
//   gemini-1.5-flash     → SHUT DOWN for new projects (returns 404)
//   gemini-2.0-flash-lite → SHUT DOWN for new projects (returns 404)
//   gemini-2.5-flash-lite → Recommended for new projects, has free tier
//   gemini-2.5-flash      → Also available, higher capability
// ─────────────────────────────────────────────────────────────────────────────
const MODEL_FALLBACK_LIST = [
  'gemini-2.5-flash-lite',   // Best free-tier option for new projects
  'gemini-2.5-flash',        // Higher capability fallback
];

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads the API-suggested retry delay from a 429 error.
 * Falls back to exponential backoff if no delay hint is present.
 * @param {Error} error
 * @param {number} attempt - zero-indexed attempt number
 * @returns {number} milliseconds to wait
 */
function getDelayMs(error, attempt) {
  try {
    // The new SDK surfaces error details in error.errorDetails or error.message
    const errorDetails = error.errorDetails || [];
    const retryInfo = errorDetails.find(
      (detail) => detail['@type'] && detail['@type'].includes('RetryInfo')
    );
    if (retryInfo && retryInfo.retryDelay) {
      const seconds = parseFloat(retryInfo.retryDelay.replace('s', ''));
      if (!isNaN(seconds)) {
        return Math.ceil(seconds * 1000) + attempt * 500;
      }
    }

    // Also try to extract "retry in Xs" from the error message string
    if (error.message) {
      const match = error.message.match(/retry[^0-9]*(\d+(?:\.\d+)?)s/i);
      if (match) {
        return Math.ceil(parseFloat(match[1]) * 1000) + attempt * 500;
      }
    }
  } catch {
    // Parsing failed; fall through to exponential backoff
  }

  // Exponential backoff: 1s, 2s, 4s
  return INITIAL_DELAY_MS * Math.pow(2, attempt);
}

/**
 * Returns true if the error is a rate-limit or quota error.
 * @param {Error} error
 * @returns {boolean}
 */
function isQuotaError(error) {
  return (
    error.status === 429 ||
    (typeof error.message === 'string' &&
      (error.message.includes('429') || error.message.toLowerCase().includes('quota')))
  );
}

/**
 * Returns true if the error means this model is simply unavailable (404).
 * In this case we should try the next model immediately, not retry.
 * @param {Error} error
 * @returns {boolean}
 */
function isModelNotFoundError(error) {
  return (
    error.status === 404 ||
    (typeof error.message === 'string' && error.message.includes('404'))
  );
}

/**
 * Calls an async function with retry logic on 429 quota errors.
 * Model-not-found (404) errors are re-thrown immediately so the caller
 * can fall through to the next model.
 * @param {Function} fn - async function that takes no arguments
 * @param {string} modelName - used only for log messages
 * @returns {Promise<*>}
 */
async function callWithRetry(fn, modelName) {
  let lastError;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (isModelNotFoundError(error)) {
        // No point retrying the same model; bubble up to the fallback loop
        throw error;
      }

      if (isQuotaError(error)) {
        const delayMs = getDelayMs(error, attempt);
        console.log(
          `[Gemini] Rate limited on "${modelName}". ` +
          `Retry ${attempt + 1}/${MAX_RETRIES} in ${Math.round(delayMs / 1000)}s...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      } else {
        // Any other error (bad API key, malformed prompt, network) — stop immediately
        console.error(`[Gemini] Hard error on "${modelName}":`, error.message);
        throw error;
      }
    }
  }

  throw lastError;
}

/**
 * Strips markdown code fences that the model sometimes wraps JSON in.
 * @param {string} text
 * @returns {string}
 */
function stripCodeFences(text) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
}

/**
 * Sends a prompt to Gemini using the new @google/genai SDK.
 * Automatically tries each model in MODEL_FALLBACK_LIST until one succeeds.
 * @param {string} prompt
 * @returns {Promise<string>} raw text response from the model
 */
async function generateWithFallback(prompt) {
  let lastError;

  for (const modelName of MODEL_FALLBACK_LIST) {
    try {
      console.log(`[Gemini] Trying model: ${modelName}`);

      const rawText = await callWithRetry(async () => {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        return response.text;
      }, modelName);

      console.log(`[Gemini] Success with model: ${modelName}`);
      return rawText;
    } catch (error) {
      lastError = error;

      if (isQuotaError(error) || isModelNotFoundError(error)) {
        const reason = isModelNotFoundError(error) ? 'not available' : 'quota exhausted';
        console.warn(
          `[Gemini] "${modelName}" ${reason} after ${MAX_RETRIES} retries. ` +
          `Trying next model...`
        );
        continue;
      }

      // Hard non-recoverable error
      throw error;
    }
  }

  throw new Error(
    'All Gemini models are unavailable. ' +
    'Please check your GEMINI_API_KEY in your .env file, ' +
    'verify your Google AI Studio project at https://aistudio.google.com, ' +
    'and confirm your API key has access to gemini-2.5-flash-lite. ' +
    `Last error: ${lastError ? lastError.message : 'unknown'}`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API — same function signatures as before, drop-in replacement
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyzes a resume text and returns structured feedback.
 * @param {string} resumeText - Extracted text from the PDF
 * @returns {Promise<object>} Structured analysis result
 */
async function analyzeResume(resumeText) {
  const prompt = `
You are an expert resume analyst and career coach with 15+ years of experience in HR and technical recruitment.

Analyze the following resume and return a JSON object with EXACTLY this structure (no markdown, no explanation, pure JSON only):

{
  "score": <overall resume quality score 0-100>,
  "atsScore": <ATS compatibility score 0-100>,
  "experienceLevel": "<Junior|Mid-Level|Senior|Executive>",
  "summary": "<2-3 sentence professional summary of the candidate>",
  "topSkills": ["<skill1>", "<skill2>", "<skill3>", "<skill4>", "<skill5>"],
  "strengths": [
    "<specific strength 1>",
    "<specific strength 2>",
    "<specific strength 3>",
    "<specific strength 4>"
  ],
  "weaknesses": [
    "<specific weakness 1>",
    "<specific weakness 2>",
    "<specific weakness 3>"
  ],
  "skillGaps": [
    "<missing skill or area 1>",
    "<missing skill or area 2>",
    "<missing skill or area 3>",
    "<missing skill or area 4>"
  ],
  "suggestions": [
    "<actionable improvement suggestion 1>",
    "<actionable improvement suggestion 2>",
    "<actionable improvement suggestion 3>",
    "<actionable improvement suggestion 4>",
    "<actionable improvement suggestion 5>"
  ],
  "keywords": ["<ats-keyword1>", "<ats-keyword2>", "<ats-keyword3>", "<ats-keyword4>", "<ats-keyword5>", "<ats-keyword6>", "<ats-keyword7>", "<ats-keyword8>"]
}

Score criteria:
- score: Evaluate formatting, content quality, achievements, quantified results, clarity (0-100)
- atsScore: Check for keywords, standard section headers, readable formatting, no tables/graphics issues (0-100)

Resume to analyze:
---
${resumeText}
---

Return ONLY the JSON object, no markdown code blocks, no explanation.
`;

  const rawText = await generateWithFallback(prompt);
  const cleaned = stripCodeFences(rawText);

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('[Gemini] JSON parse failed. Raw response snippet:', rawText.slice(0, 300));
    return {
      score: 60,
      atsScore: 55,
      experienceLevel: 'Mid-Level',
      summary: 'Resume analysis completed. Please review the detailed feedback below.',
      topSkills: ['Communication', 'Problem Solving', 'Teamwork'],
      strengths: ['Professional experience present', 'Educational background included'],
      weaknesses: [
        'Could not fully parse the resume',
        'Consider reformatting for better ATS compatibility',
      ],
      skillGaps: ['Quantified achievements', 'Technical certifications'],
      suggestions: [
        'Add measurable achievements',
        'Include relevant keywords',
        'Use standard section headings',
      ],
      keywords: ['Professional', 'Experience', 'Skills'],
    };
  }
}

/**
 * Generates tailored interview questions based on resume and target job role.
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobRole - Target job role
 * @returns {Promise<Array>} Array of question objects
 */
async function generateInterviewQuestions(resumeText, jobRole) {
  const prompt = `
You are a senior technical interviewer and career coach preparing a candidate for a "${jobRole}" interview.

Based on the resume below, generate 12 highly targeted interview questions that assess this specific candidate's fit for the "${jobRole}" role. Return ONLY a JSON array with no markdown, no explanation:

[
  {
    "question": "<specific interview question>",
    "difficulty": "<Easy|Medium|Hard>",
    "category": "<Technical|Behavioral|Situational|General>",
    "modelAnswer": "<detailed 3-5 sentence model answer that references the candidate's background>"
  }
]

Rules:
- Mix: 4 Technical, 4 Behavioral, 2 Situational, 2 General questions
- Mix difficulties: 3 Easy, 5 Medium, 4 Hard
- Make questions SPECIFIC to both the resume content AND the "${jobRole}" role
- Model answers should be tailored to the candidate's actual experience shown in the resume
- Behavioral questions should follow STAR format (Situation, Task, Action, Result)

Resume:
---
${resumeText}
---

Return ONLY the JSON array, no markdown code blocks.
`;

  const rawText = await generateWithFallback(prompt);
  const cleaned = stripCodeFences(rawText);

  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (parseError) {
    console.error(
      '[Gemini] JSON parse failed for interview questions. Raw snippet:',
      rawText.slice(0, 300)
    );
    return [
      {
        question: `Tell me about your experience relevant to the ${jobRole} position.`,
        difficulty: 'Easy',
        category: 'General',
        modelAnswer:
          'Describe your most relevant experience, highlighting key achievements and skills that directly align with the role.',
      },
      {
        question: 'Describe a challenging project you worked on and how you overcame obstacles.',
        difficulty: 'Medium',
        category: 'Behavioral',
        modelAnswer:
          'Use the STAR method: describe the Situation, your Task, the Actions you took, and the Results you achieved.',
      },
    ];
  }
}

module.exports = { analyzeResume, generateInterviewQuestions };