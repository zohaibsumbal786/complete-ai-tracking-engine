import Groq from 'groq-sdk';
import axios from 'axios';

const AI_PROVIDER = process.env.AI_PROVIDER || 'groq';

class AIService {
  private groqClient?: Groq;
  
  constructor() {
    if (AI_PROVIDER === 'groq' && process.env.GROQ_API_KEY) {
      this.groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
  }
  
  async generateCompletion(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      if (AI_PROVIDER === 'groq' && this.groqClient) {
        return await this.groqCompletion(prompt, systemPrompt);
      } else if (AI_PROVIDER === 'ollama') {
        return await this.ollamaCompletion(prompt, systemPrompt);
      }
      throw new Error('No AI provider configured');
    } catch (error: any) {
      console.error('AI generation error:', error);
      throw new Error(`AI service error: ${error.message}`);
    }
  }
  
  private async groqCompletion(prompt: string, systemPrompt?: string): Promise<string> {
    const response = await this.groqClient!.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    return response.choices[0]?.message?.content || '';
  }
  
  private async ollamaCompletion(prompt: string, systemPrompt?: string): Promise<string> {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const response = await axios.post(`${baseUrl}/api/generate`, {
      model: 'llama3',
      prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
      stream: false
    });
    
    return response.data.response;
  }
  
  async parseCV(cvText: string): Promise<any> {
    const systemPrompt = `You are a CV parsing expert. Extract structured information from CVs and return ONLY valid JSON.`;
    
    const prompt = `Extract the following information from this CV and return as JSON:
{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "summary": "professional summary",
  "experience": [{"company": "", "role": "", "duration": "", "responsibilities": []}],
  "education": [{"degree": "", "institution": "", "year": ""}],
  "skills": ["skill1", "skill2"],
  "certifications": ["cert1"],
  "languages": ["language1"]
}

CV Text:
${cvText}

Return ONLY the JSON object, no additional text.`;
    
    const response = await this.generateCompletion(prompt, systemPrompt);
    
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch (error) {
      console.error('JSON parse error:', error);
      return { raw: response };
    }
  }
  
  async generateScreeningQuestions(jobTitle: string, requirements: any): Promise<any[]> {
    const systemPrompt = `You are a recruitment expert. Generate fair, unbiased screening questions.`;
    
    const prompt = `Generate 10 screening questions for a ${jobTitle} position with these requirements:
${JSON.stringify(requirements, null, 2)}

Return as JSON array:
[
  {
    "question": "question text",
    "type": "multiple_choice",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "points": 10
  }
]

Include mix of technical and behavioral questions. Return ONLY the JSON array.`;
    
    const response = await this.generateCompletion(prompt, systemPrompt);
    
    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(response);
    } catch (error) {
      console.error('JSON parse error:', error);
      return [];
    }
  }
  
  removeBias(candidateData: any): any {
    const biasFreeCopy = { ...candidateData };
    
    // Remove identifying information
    delete biasFreeCopy.name;
    delete biasFreeCopy.photo;
    delete biasFreeCopy.age;
    delete biasFreeCopy.gender;
    delete biasFreeCopy.address;
    delete biasFreeCopy.dateOfBirth;
    
    // Anonymize experience
    if (biasFreeCopy.experience) {
      biasFreeCopy.experience = biasFreeCopy.experience.map((exp: any) => ({
        role: exp.role,
        duration: exp.duration,
        responsibilities: exp.responsibilities,
        // Remove company names that might indicate bias
        company: 'Company'
      }));
    }
    
    return biasFreeCopy;
  }
}

export default new AIService();
