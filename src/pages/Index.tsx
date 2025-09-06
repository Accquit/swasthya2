import Hero from '@/components/Hero';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Shield, Clock, Users, Star, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'AI Symptom Checker',
    description: 'Get instant health insights with our advanced AI-powered symptom analysis.',
    link: '/symptom-checker'
  },
  {
    icon: Users,
    title: 'Video Consultations',
    description: 'Connect with certified doctors through secure video calls from home.',
    link: '/video-consultation'
  },
  {
    icon: Shield,
    title: 'Mental Wellness',
    description: 'Access mental health resources, mood tracking, and professional support.',
    link: '/mental-wellness'
  },
  {
    icon: Clock,
    title: 'Health Reports',
    description: 'Manage your medical records and track health metrics in one place.',
    link: '/health-reports'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Patient',
    content: 'Swasthya Health Hub has revolutionized how I manage my health. The AI symptom checker is incredibly accurate!',
    rating: 5
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Healthcare Provider',
    content: 'The platform makes it easy to connect with patients and provide quality care remotely.',
    rating: 5
  },
  {
    name: 'Emily Davis',
    role: 'Mental Health Advocate',
    content: 'The mental wellness features have been a game-changer for my daily well-being routine.',
    rating: 5
  }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive <span className="gradient-text">Healthcare Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for better health, accessible anytime, anywhere
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="card-medical group hover:scale-105 transition-transform duration-300">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-6">{feature.description}</CardDescription>
                    <Link to={feature.link}>
                      <Button variant="outline" className="group/btn">
                        Learn More
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our community says about their healthcare experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-medical">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your <span className="gradient-text">Healthcare Experience?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands who have already improved their health with our comprehensive platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/symptom-checker">
              <Button className="btn-medical">
                Start Health Check
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-primary/20">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl gradient-text">Swasthya Health Hub</span>
              </div>
              <p className="text-muted-foreground">
                Your trusted partner in digital healthcare, making quality medical care accessible to everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/symptom-checker" className="hover:text-primary">Symptom Checker</Link></li>
                <li><Link to="/video-consultation" className="hover:text-primary">Video Consultation</Link></li>
                <li><Link to="/mental-wellness" className="hover:text-primary">Mental Wellness</Link></li>
                <li><Link to="/pharmacy" className="hover:text-primary">Pharmacy Locator</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  24/7 Support
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Emergency: Call 911<br />
                Support: 1-800-HEALTH
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Swasthya Health Hub. All rights reserved. HIPAA Compliant.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
