import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Shield, Clock } from 'lucide-react';

const Hero = () => {
  return (
    <section className="hero-gradient min-h-screen flex items-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Health,{' '}
              <span className="gradient-text">Our Priority</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Access comprehensive healthcare services from the comfort of your home. 
              Get AI-powered symptom analysis, consult with doctors, and manage your health records seamlessly.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/symptom-checker">
                <Button className="btn-medical group">
                  Start Symptom Check
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/video-consultation">
                <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
                  Book Consultation
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">AI-Powered</p>
                  <p className="text-xs text-muted-foreground">Symptom Analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Secure</p>
                  <p className="text-xs text-muted-foreground">HIPAA Compliant</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 justify-center lg:justify-start">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm">24/7</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative">
            <div className="w-full max-w-lg mx-auto lg:max-w-none">
              <div className="relative bg-gradient-card rounded-3xl p-8 shadow-medical">
                <div className="grid grid-cols-2 gap-4">
                  <div className="card-medical p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold">Health Check</p>
                    <p className="text-xs text-muted-foreground">AI Analysis</p>
                  </div>
                  <div className="card-medical p-4 text-center">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-secondary" />
                    </div>
                    <p className="text-sm font-semibold">Secure</p>
                    <p className="text-xs text-muted-foreground">Data Protection</p>
                  </div>
                  <div className="card-medical p-4 text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                    <p className="text-sm font-semibold">Fast</p>
                    <p className="text-xs text-muted-foreground">Quick Results</p>
                  </div>
                  <div className="card-medical p-4 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-semibold">Easy</p>
                    <p className="text-xs text-muted-foreground">Simple Process</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;