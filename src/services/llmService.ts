export interface AiInsightResponse {
  insightText: string;
  recommendation: string;
  severity: 'info' | 'warning' | 'critical';
}

export const fetchAiInsight = async (context: string): Promise<AiInsightResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn("No API key found. Using fallback mock data.");
    return {
      insightText: "Groundwater has decreased 7% over the last quarter. Agricultural consumption in Block X is exceeding recharge rates.",
      recommendation: "Recommend immediate inspection of Block X borewells and temporary suspension of new industrial water permits.",
      severity: "warning"
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI environmental executive assistant for a Government Command Center. Provide a brief, highly professional, actionable insight based on the provided context. Return ONLY a valid JSON object with the following structure: { \"insightText\": \"string\", \"recommendation\": \"string\", \"severity\": \"info\" | \"warning\" | \"critical\" }"
          },
          {
            role: "user",
            content: `Analyze the following environmental context for a district: ${context}`
          }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    return {
      insightText: parsed.insightText || "Analysis complete.",
      recommendation: parsed.recommendation || "Review data.",
      severity: parsed.severity || "info"
    };

  } catch (err) {
    console.error("Failed to fetch AI insight from API", err);
    return {
      insightText: "Failed to connect to Intelligence Server. Reverting to local analysis.",
      recommendation: "Please verify API key and network connection.",
      severity: "critical"
    };
  }
};
