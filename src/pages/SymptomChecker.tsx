import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Brain, MessageCircle, Stethoscope, Send, AlertTriangle } from 'lucide-react';
import SymptomChat from '@/components/SymptomChat';
import { analyzeSymptoms, SymptomAnalysisResponse } from '@/lib/geminiService';
import { useToast } from '@/hooks/use-toast';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [analysis, setAnalysis] = useState<SymptomAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if API key is configured
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured. Please add your API key to the environment variables.');
      }

      const analysisResult = await analyzeSymptoms({
        symptoms,
        age,
        gender,
        duration,
        severity
      });
      
      setAnalysis(analysisResult);
      
      toast({
        title: "Analysis Complete",
        description: "Your symptoms have been analyzed successfully.",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getUrgencyBadgeText = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🔴 High Priority';
      case 'medium': return '🟡 Medium Priority';
      case 'low': return '🟢 Low Priority';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered <span className="gradient-text">Symptom Checker</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant health insights with our advanced AI analysis. Choose between guided questions or chat interface.
          </p>
        </div>

        <Tabs defaultValue="form" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="form" className="flex items-center space-x-2">
              <Stethoscope className="w-4 h-4" />
              <span>Guided Check</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>AI Chat</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form */}
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-primary" />
                    <span>Symptom Information</span>
                  </CardTitle>
                  <CardDescription>
                    Please provide details about your symptoms for accurate analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="Enter your age"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Symptoms</Label>
                      <Textarea
                        id="symptoms"
                        placeholder="Describe your symptoms in detail..."
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        required
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Select value={duration} onValueChange={setDuration} required>
                          <SelectTrigger>
                            <SelectValue placeholder="How long?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="few-hours">Few hours</SelectItem>
                            <SelectItem value="1-day">1 day</SelectItem>
                            <SelectItem value="2-3-days">2-3 days</SelectItem>
                            <SelectItem value="1-week">1 week</SelectItem>
                            <SelectItem value="2-weeks">2+ weeks</SelectItem>
                            <SelectItem value="chronic">Chronic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="severity">Severity</Label>
                        <Select value={severity} onValueChange={setSeverity} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Pain level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild (1-3)</SelectItem>
                            <SelectItem value="moderate">Moderate (4-6)</SelectItem>
                            <SelectItem value="severe">Severe (7-10)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="btn-medical w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze Symptoms
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Results */}
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-accent" />
                    <span>Analysis Results</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered health assessment based on your symptoms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-destructive">Analysis Error</h4>
                          <p className="text-xs text-destructive/80 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {analysis ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 mb-4">
                        <Badge 
                          variant={getUrgencyBadgeVariant(analysis.urgencyLevel)} 
                          className="text-xs"
                        >
                          {getUrgencyBadgeText(analysis.urgencyLevel)}
                        </Badge>
                        <Badge variant="outline" className="border-secondary text-secondary">
                          AI Analysis Complete
                        </Badge>
                      </div>
                      
                      {/* Main Analysis */}
                      <div className="prose prose-sm max-w-none">
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm text-foreground font-sans">
                            {analysis.analysis}
                          </pre>
                        </div>
                      </div>
                      
                      {/* Recommendations */}
                      {analysis.recommendations.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold mb-2">Key Recommendations:</h4>
                          <ul className="space-y-1">
                            {analysis.recommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                                <span className="text-primary mt-1">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Suggested Actions */}
                      {analysis.suggestedActions.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold mb-2">When to Seek Care:</h4>
                          <ul className="space-y-1">
                            {analysis.suggestedActions.map((action, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                                <span className="text-accent mt-1">•</span>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-border">
                        <Button className="btn-secondary-medical w-full">
                          Book Consultation
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Fill out the form to get your AI-powered symptom analysis
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chat">
            <SymptomChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SymptomChecker;