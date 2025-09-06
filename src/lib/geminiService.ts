import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI instance
const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
console.log('Gemini API Key status:', apiKey ? 'Key present' : 'Key missing', apiKey ? `Length: ${apiKey.length}` : '');
console.log('Raw API Key (first 10 chars):', import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10) || 'undefined');

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

// Get the Gemini model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
console.log('Initialized Gemini model: gemini-1.5-flash');

/**
 * List available models for debugging
 */
export async function listAvailableModels(): Promise<{ success: boolean; models: string[]; message: string }> {
  try {
    if (!apiKey) {
      return { success: false, models: [], message: 'API key not configured' };
    }
    
    console.log('Fetching available models...');
    const models = await genAI.listModels();
    const modelNames = models.map(m => m.name);
    
    console.log('Available models:', modelNames);
    
    return { 
      success: true, 
      models: modelNames,
      message: `Found ${modelNames.length} available models` 
    };
  } catch (error) {
    console.error('Failed to list models:', error);
    return { 
      success: false, 
      models: [],
      message: error instanceof Error ? error.message : 'Failed to list models' 
    };
  }
}

/**
 * Test function to validate API key and connection
 */
export async function testGeminiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    if (!apiKey) {
      return { success: false, message: 'API key not configured' };
    }
    
    console.log('Testing Gemini API connection with model: gemini-1.5-flash');
    
    // Try a simple test prompt
    const testPrompt = 'Hello! Please respond with "Connection successful" to confirm the API is working.';
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Test response received:', text);
    
    return { 
      success: true, 
      message: `API connection successful! Response: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}` 
    };
  } catch (error) {
    console.error('Gemini API test failed:', error);
    
    // Provide specific error information
    let errorMessage = 'Unknown error during API test';
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types
      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        errorMessage = 'Model not found. The API might need a different model name or your API key might not have access to this model.';
      } else if (errorMessage.includes('403') || errorMessage.includes('permission')) {
        errorMessage = 'Permission denied. Please check if your API key is valid and has the necessary permissions.';
      } else if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
        errorMessage = 'API quota exceeded. Please check your Google AI usage limits.';
      }
    }
    
    return { 
      success: false, 
      message: errorMessage
    };
  }
}

export interface SymptomAnalysisRequest {
  symptoms: string;
  age?: string;
  gender?: string;
  duration?: string;
  severity?: string;
  previousMessages?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface SymptomAnalysisResponse {
  analysis: string;
  recommendations: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  suggestedActions: string[];
}

/**
 * Generate AI response for symptom chat
 */
export async function generateChatResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<string> {
  try {
    console.log('generateChatResponse called with:', { userMessage, apiKeyPresent: !!apiKey });
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please add your API key to the environment variables.');
    }

    // Build conversation context
    const context = conversationHistory
      .map(msg => `${msg.role === 'user' ? 'Patient' : 'AI Assistant'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a helpful medical AI assistant providing preliminary health guidance. You should:

1. Ask relevant follow-up questions to gather more information
2. Provide general health advice and recommendations
3. Always emphasize that you're not replacing professional medical care
4. Suggest consulting healthcare professionals when appropriate
5. Be empathetic and supportive
6. Keep responses concise but informative

Previous conversation:
${context}

Current patient message: ${userMessage}

Please respond as a caring medical AI assistant. Focus on gathering relevant information and providing helpful guidance while being clear about limitations.`;

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini API:', text.substring(0, 100) + '...');
    return text;
  } catch (error) {
    console.error('Error generating chat response:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!apiKey,
      userMessage: userMessage.substring(0, 50)
    });
    throw new Error('Failed to generate AI response. Please try again.');
  }
}

/**
 * Perform comprehensive symptom analysis
 */
export async function analyzeSymptoms(request: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
  try {
    console.log('analyzeSymptoms called with:', { request, apiKeyPresent: !!apiKey });
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please add your API key to the environment variables.');
    }

    const { symptoms, age, gender, duration, severity } = request;

    const prompt = `As a medical AI assistant, analyze the following patient information and provide a structured assessment:

Patient Information:
- Age: ${age || 'Not specified'}
- Gender: ${gender || 'Not specified'}
- Symptoms: ${symptoms}
- Duration: ${duration || 'Not specified'}
- Severity: ${severity || 'Not specified'}

Please provide a comprehensive analysis in the following format:

PRELIMINARY ASSESSMENT:
[Brief overview of the condition based on symptoms]

POSSIBLE CONDITIONS:
[List 2-3 most likely conditions with brief explanations]

RECOMMENDATIONS:
[General care recommendations]

URGENCY LEVEL:
[Classify as: LOW, MEDIUM, or HIGH]

WHEN TO SEEK CARE:
[Specific warning signs that require immediate medical attention]

IMPORTANT DISCLAIMER:
Always include that this is not a medical diagnosis and professional consultation is recommended.

Keep the response professional, empathetic, and medically sound while emphasizing the limitations of AI diagnosis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // Parse the response to extract structured data
    const urgencyLevel = extractUrgencyLevel(analysisText);
    const recommendations = extractRecommendations(analysisText);
    const suggestedActions = extractSuggestedActions(analysisText);

    return {
      analysis: analysisText,
      recommendations,
      urgencyLevel,
      suggestedActions
    };
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw new Error('Failed to analyze symptoms. Please try again.');
  }
}

/**
 * Generate mental wellness support response
 */
export async function generateWellnessResponse(userInput: string): Promise<string> {
  try {
    console.log('generateWellnessResponse called with:', { userInput, apiKeyPresent: !!apiKey });
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please add your API key to the environment variables.');
    }

    const prompt = `You are a compassionate mental wellness AI assistant. Respond to the user's mental health concern with:

1. Empathy and understanding
2. Practical coping strategies
3. Encouragement and support
4. Resources for professional help when appropriate
5. Mindfulness or relaxation techniques
6. Positive affirmations

User's concern: ${userInput}

Provide a supportive, caring response that acknowledges their feelings and offers practical help. Keep it warm, professional, and hopeful.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating wellness response:', error);
    throw new Error('Failed to generate wellness response. Please try again.');
  }
}

// Helper functions for parsing AI responses
function extractUrgencyLevel(text: string): 'low' | 'medium' | 'high' {
  const upperText = text.toUpperCase();
  if (upperText.includes('HIGH') && upperText.includes('URGENCY')) return 'high';
  if (upperText.includes('MEDIUM') && upperText.includes('URGENCY')) return 'medium';
  return 'low';
}

function extractRecommendations(text: string): string[] {
  const recommendations: string[] = [];
  const lines = text.split('\n');
  let inRecommendationsSection = false;

  for (const line of lines) {
    if (line.toUpperCase().includes('RECOMMENDATIONS:')) {
      inRecommendationsSection = true;
      continue;
    }
    if (inRecommendationsSection && line.toUpperCase().includes(':')) {
      inRecommendationsSection = false;
    }
    if (inRecommendationsSection && line.trim().startsWith('•') || line.trim().startsWith('-')) {
      recommendations.push(line.trim().substring(1).trim());
    }
  }

  return recommendations.length > 0 ? recommendations : ['Rest and monitor symptoms', 'Stay hydrated', 'Consult healthcare provider if symptoms persist'];
}

function extractSuggestedActions(text: string): string[] {
  const actions: string[] = [];
  const lines = text.split('\n');
  let inActionsSection = false;

  for (const line of lines) {
    if (line.toUpperCase().includes('WHEN TO SEEK') || line.toUpperCase().includes('SUGGESTED ACTIONS')) {
      inActionsSection = true;
      continue;
    }
    if (inActionsSection && line.toUpperCase().includes(':') && !line.toUpperCase().includes('SEEK')) {
      inActionsSection = false;
    }
    if (inActionsSection && (line.trim().startsWith('•') || line.trim().startsWith('-'))) {
      actions.push(line.trim().substring(1).trim());
    }
  }

  return actions.length > 0 ? actions : ['Monitor symptoms', 'Seek medical care if condition worsens'];
}

export default {
  generateChatResponse,
  analyzeSymptoms,
  generateWellnessResponse,
  testGeminiConnection,
  listAvailableModels
};