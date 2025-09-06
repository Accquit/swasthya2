import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, AlertTriangle, TestTube } from 'lucide-react';
import { generateChatResponse, testGeminiConnection, listAvailableModels } from '@/lib/geminiService';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const SymptomChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI health assistant powered by Gemini AI. I can help analyze your symptoms and provide health guidance. Please describe what symptoms you\'re experiencing, and I\'ll ask follow-up questions to better understand your condition.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const testApiConnection = async () => {
    setIsLoading(true);
    try {
      // First, try to list available models
      console.log('Checking available models...');
      const modelsResult = await listAvailableModels();
      console.log('Models result:', modelsResult);
      
      // Then test the connection
      const result = await testGeminiConnection();
      setTestResult(result.message);
      
      if (result.success) {
        toast({
          title: "API Test Successful",
          description: "Gemini API is working correctly!",
        });
      } else {
        const fullMessage = modelsResult.success 
          ? `${result.message} Available models: ${modelsResult.models.join(', ')}`
          : result.message;
        
        toast({
          title: "API Test Failed",
          description: fullMessage,
          variant: "destructive"
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Test failed';
      setTestResult(errorMessage);
      toast({
        title: "API Test Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string, conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>): Promise<string> => {
    try {
      setError(null);
      
      // Check if API key is configured
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Please add your API key to the environment variables.');
      }

      const response = await generateChatResponse(userMessage, conversationHistory);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      // Fallback response when API fails
      return `I apologize, but I'm having trouble connecting to the AI service right now. ${errorMessage}\n\nIn the meantime, here are some general recommendations:\n\n• Monitor your symptoms closely\n• Stay hydrated and get plenty of rest\n• Consider consulting a healthcare provider\n• Seek immediate care for severe symptoms\n\nPlease try again in a moment.`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const aiResponseContent = await generateAIResponse(currentInput, conversationHistory);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponseContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      if (error) {
        toast({
          title: "Connection Issue",
          description: "There was a problem connecting to the AI service, but I provided a fallback response.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="card-medical max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-primary" />
          <span>AI Health Assistant</span>
        </CardTitle>
        <CardDescription>
          Chat with our AI to get personalized symptom analysis and health guidance
        </CardDescription>
        
        {/* Test API Button */}
        <div className="flex items-center space-x-2">
          <Button
            onClick={testApiConnection}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
            ) : (
              <TestTube className="w-3 h-3 mr-1" />
            )}
            Test API Connection
          </Button>
          {testResult && (
            <span className="text-xs text-muted-foreground">
              {testResult.substring(0, 50)}...
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-destructive">Connection Issue</h4>
                <p className="text-xs text-destructive/80 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-primary text-white'
                    : 'bg-card border border-border'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'ai' && (
                    <Bot className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                  )}
                  {message.type === 'user' && (
                    <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-lg bg-card border border-border">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">AI is analyzing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            placeholder="Describe your symptoms..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="btn-medical"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Badge variant="outline" className="border-accent text-accent">
              Medical Disclaimer
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            This AI assistant provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always consult with qualified healthcare providers for medical concerns.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SymptomChat;