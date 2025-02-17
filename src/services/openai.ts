// src/services/openai.ts
import OpenAI from 'openai';
import { Attack, AIAnalysisResponse } from '@/types/military';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeAttackWithAI = async (attack: Attack): Promise<AIAnalysisResponse | null> => {
  try {
    const prompt = `
      Analyze this cybersecurity attack and provide recommendations:
      
      Attack Details:
      - Type: ${attack.type}
      - Threat Level: ${attack.threatLevel}
      - Intensity: ${attack.intensity}/10
      - Status: ${attack.status}
      - Duration: ${attack.duration}ms
      
      Please provide a detailed analysis in the following format:
      ANALYSIS: <brief analysis of the attack pattern>
      CONFIDENCE: <confidence level as a number between 0-100>
      RECOMMENDATIONS:
      - <action item 1>
      - <action item 2>
      - <action item 3>
      IMPACT: <estimated impact assessment>
    `;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a military-grade cybersecurity AI analyst."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the response using regex for more reliable extraction
    const analysisMatch = responseText.match(/ANALYSIS:\s*(.*?)(?=\n|$)/i);
    const confidenceMatch = responseText.match(/CONFIDENCE:\s*(\d+)/i);
    const recommendationsMatch = responseText.match(/RECOMMENDATIONS:\n((?:- .*\n?)*)/i);
    const impactMatch = responseText.match(/IMPACT:\s*(.*?)(?=\n|$)/i);

    // Extract recommendations as array
    const recommendations = recommendationsMatch?.[1]
      .split('\n')
      .filter(line => line.startsWith('- '))
      .map(line => line.replace('- ', '').trim()) || [];

    return {
      analysis: analysisMatch?.[1]?.trim() || 'Analysis not available',
      confidence: parseInt(confidenceMatch?.[1] || '0'),
      recommendations: recommendations.length > 0 ? recommendations : ['No recommendations available'],
      impact: impactMatch?.[1]?.trim() || 'Impact assessment not available'
    };

  } catch (error) {
    console.error('Error analyzing attack with AI:', error);
    
    // Return a fallback response instead of null
    return {
      analysis: 'AI analysis temporarily unavailable',
      confidence: 0,
      recommendations: ['System is currently unable to provide recommendations'],
      impact: 'Unable to assess impact at this time'
    };
  }
};