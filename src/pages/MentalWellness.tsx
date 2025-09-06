import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Brain, Heart, Smile, Moon, Users, Play, BookOpen, Headphones, MessageCircle, Send, Loader2 } from 'lucide-react';
import { generateWellnessResponse } from '@/lib/geminiService';
import { useToast } from '@/hooks/use-toast';

const moodOptions = [
  { emoji: '😊', label: 'Great', value: 'great' },
  { emoji: '🙂', label: 'Good', value: 'good' },
  { emoji: '😐', label: 'Okay', value: 'okay' },
  { emoji: '😔', label: 'Low', value: 'low' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' }
];

const resources = [
  {
    id: 1,
    title: 'Guided Meditation for Beginners',
    type: 'audio',
    duration: '10 min',
    category: 'Meditation',
    description: 'Learn basic meditation techniques to reduce stress and anxiety',
    icon: Headphones
  },
  {
    id: 2,
    title: 'Understanding Anxiety',
    type: 'article',
    duration: '5 min read',
    category: 'Education',
    description: 'Comprehensive guide to understanding and managing anxiety',
    icon: BookOpen
  },
  {
    id: 3,
    title: 'Deep Breathing Exercises',
    type: 'video',
    duration: '15 min',
    category: 'Exercises',
    description: 'Video guide to breathing techniques for instant relaxation',
    icon: Play
  },
  {
    id: 4,
    title: 'Sleep Hygiene Tips',
    type: 'article',
    duration: '7 min read',
    category: 'Sleep',
    description: 'Improve your sleep quality with these evidence-based tips',
    icon: Moon
  }
];

const therapists = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Clinical Psychologist',
    experience: '12 years',
    rating: 4.9,
    price: '₹2000',
    available: true
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Psychiatrist',
    experience: '15 years',
    rating: 4.8,
    price: '₹2500',
    available: true
  },
  {
    id: 3,
    name: 'Dr. Emily Davis',
    specialty: 'Marriage & Family Therapist',
    experience: '8 years',
    rating: 4.7,
    price: '₹1800',
    available: false
  }
];

const MentalWellness = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [wellnessInput, setWellnessInput] = useState('');
  const [wellnessResponse, setWellnessResponse] = useState<string | null>(null);
  const [isLoadingWellness, setIsLoadingWellness] = useState(false);
  const { toast } = useToast();
  const [moodHistory, setMoodHistory] = useState([
    { date: '2024-01-15', mood: 'good' },
    { date: '2024-01-14', mood: 'great' },
    { date: '2024-01-13', mood: 'okay' },
    { date: '2024-01-12', mood: 'good' },
    { date: '2024-01-11', mood: 'low' }
  ]);

  const handleWellnessQuery = async () => {
    if (!wellnessInput.trim()) return;
    
    setIsLoadingWellness(true);
    try {
      const response = await generateWellnessResponse(wellnessInput);
      setWellnessResponse(response);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get wellness support. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingWellness(false);
    }
  };

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    const today = new Date().toISOString().split('T')[0];
    setMoodHistory(prev => [
      { date: today, mood },
      ...prev.filter(entry => entry.date !== today)
    ]);
  };

  const getWellnessScore = () => {
    const recentMoods = moodHistory.slice(0, 7);
    const moodValues = { great: 5, good: 4, okay: 3, low: 2, anxious: 1 };
    const total = recentMoods.reduce((sum, entry) => sum + moodValues[entry.mood as keyof typeof moodValues], 0);
    return Math.round((total / (recentMoods.length * 5)) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Mental Wellness</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your mental health matters. Track your mood, access resources, and connect with mental health professionals.
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ai-support">AI Support</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="therapy">Therapy</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Mood Tracker */}
              <Card className="card-medical lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smile className="w-5 h-5 text-primary" />
                    <span>Daily Mood Check-in</span>
                  </CardTitle>
                  <CardDescription>
                    How are you feeling today? Track your mood to identify patterns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => handleMoodSelection(mood.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedMood === mood.value
                            ? 'border-primary bg-primary/5 scale-105'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{mood.emoji}</div>
                        <p className="text-xs font-medium">{mood.label}</p>
                      </button>
                    ))}
                  </div>
                  
                  {selectedMood && (
                    <div className="bg-secondary/10 rounded-lg p-4">
                      <p className="text-sm text-secondary font-medium">
                        Mood logged for today! Keep tracking to build healthy habits.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Wellness Score */}
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-accent" />
                    <span>Wellness Score</span>
                  </CardTitle>
                  <CardDescription>
                    Based on your recent mood patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-accent mb-2">
                      {getWellnessScore()}%
                    </div>
                    <Progress value={getWellnessScore()} className="mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {getWellnessScore() >= 80 ? 'Great' : 
                       getWellnessScore() >= 60 ? 'Good' : 
                       getWellnessScore() >= 40 ? 'Fair' : 'Needs Attention'} mental wellness
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mood Consistency</span>
                      <span className="text-muted-foreground">85%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sleep Quality</span>
                      <span className="text-muted-foreground">72%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Stress Level</span>
                      <span className="text-muted-foreground">Low</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Quick Wellness Actions</CardTitle>
                <CardDescription>
                  Immediate tools to support your mental health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Headphones className="w-6 h-6 text-primary" />
                    <span className="text-sm">5-Min Meditation</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Heart className="w-6 h-6 text-secondary" />
                    <span className="text-sm">Breathing Exercise</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Moon className="w-6 h-6 text-accent" />
                    <span className="text-sm">Sleep Sounds</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                    <Users className="w-6 h-6 text-primary" />
                    <span className="text-sm">Support Groups</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-support" className="space-y-6">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span>AI Wellness Support</span>
                </CardTitle>
                <CardDescription>
                  Share your feelings and get supportive guidance from our AI wellness assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="How are you feeling today? Share what's on your mind..."
                      value={wellnessInput}
                      onChange={(e) => setWellnessInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleWellnessQuery();
                        }
                      }}
                      disabled={isLoadingWellness}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleWellnessQuery}
                      disabled={!wellnessInput.trim() || isLoadingWellness}
                      className="btn-medical"
                    >
                      {isLoadingWellness ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  
                  {wellnessResponse && (
                    <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                      <div className="flex items-start space-x-2 mb-2">
                        <Heart className="w-4 h-4 text-secondary mt-1 flex-shrink-0" />
                        <h4 className="text-sm font-medium text-secondary">Wellness Support</h4>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm whitespace-pre-wrap text-foreground">
                          {wellnessResponse}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {!wellnessResponse && !isLoadingWellness && (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Share your thoughts and feelings to receive personalized wellness support
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Wellness Disclaimer */}
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Badge variant="outline" className="border-accent text-accent">
                      Wellness Support
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This AI provides general wellness support and is not a substitute for professional mental health care. 
                    If you're experiencing a crisis, please contact emergency services or a mental health professional immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const IconComponent = resource.icon;
                return (
                  <Card key={resource.id} className="card-medical">
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{resource.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {resource.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {resource.duration}
                            </span>
                            <Button size="sm" className="btn-medical">
                              {resource.type === 'video' ? 'Watch' :
                               resource.type === 'audio' ? 'Listen' : 'Read'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="therapy" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Professional Support</h2>
                <p className="text-muted-foreground mb-6">
                  Connect with licensed mental health professionals for personalized care and support.
                </p>
                
                <div className="space-y-4">
                  {therapists.map((therapist) => (
                    <Card key={therapist.id} className="card-medical">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{therapist.name}</h3>
                            <p className="text-sm text-muted-foreground">{therapist.specialty}</p>
                            <p className="text-sm text-muted-foreground">{therapist.experience} experience</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{therapist.price}</p>
                            <p className="text-sm text-muted-foreground">per session</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm">⭐ {therapist.rating}</span>
                            </div>
                            <Badge 
                              variant={therapist.available ? "default" : "secondary"}
                              className={therapist.available ? "bg-secondary" : ""}
                            >
                              {therapist.available ? 'Available' : 'Busy'}
                            </Badge>
                          </div>
                          <Button 
                            className="btn-medical"
                            disabled={!therapist.available}
                          >
                            Book Session
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="card-medical">
                <CardHeader>
                  <CardTitle>Emergency Support</CardTitle>
                  <CardDescription>
                    Immediate help when you need it most
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <h4 className="font-semibold text-destructive mb-2">Crisis Helpline</h4>
                    <p className="text-sm mb-3">24/7 support for mental health emergencies</p>
                    <Button variant="destructive" className="w-full">
                      Call Now: 1-800-CRISIS
                    </Button>
                  </div>
                  
                  <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary mb-2">Text Support</h4>
                    <p className="text-sm mb-3">Anonymous text-based crisis counseling</p>
                    <Button className="btn-secondary-medical w-full">
                      Text: HELLO to 741741
                    </Button>
                  </div>
                  
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <h4 className="font-semibold text-primary mb-2">Online Chat</h4>
                    <p className="text-sm mb-3">Connect with a counselor online</p>
                    <Button className="btn-medical w-full">
                      Start Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="community">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>Support Community</span>
                </CardTitle>
                <CardDescription>
                  Connect with others on similar wellness journeys
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community Features Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We're building a safe, supportive community where you can connect with others, 
                    share experiences, and find encouragement on your wellness journey.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MentalWellness;