import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Video, Star, MapPin, CheckCircle } from 'lucide-react';

const doctors = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialty: 'General Medicine',
    rating: 4.9,
    experience: '12 years',
    location: 'SMS Hospital, Jaipur',
    price: '₹250',
    available: true,
    nextSlot: '2:00 PM Today'
  },
  {
    id: 2,
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiology',
    rating: 4.8,
    experience: '15 years',
    location: 'Manipal Hospital, Jaipur',
    price: '₹500',
    available: true,
    nextSlot: '3:30 PM Today'
  },
  {
    id: 3,
    name: 'Dr. Anita Verma',
    specialty: 'Dermatology',
    rating: 4.7,
    experience: '8 years',
    location: 'AIIMS, Delhi',
    price: '₹100',
    available: false,
    nextSlot: '10:00 AM Tomorrow'
  },
  {
    id: 4,
    name: 'Dr. Suresh Patel',
    specialty: 'Pediatrics',
    rating: 4.9,
    experience: '20 years',
    location: 'Apollo Multi-Speciality Hospital',
    price: '₹700',
    available: true,
    nextSlot: '4:00 PM Today'
  }
];

const VideoConsultation = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime || !patientName) return;
    
    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsBooked(true);
      setIsBooking(false);
    }, 2000);
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="card-medical">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Appointment Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your video consultation has been scheduled successfully.
                </p>
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <div className="space-y-2 text-sm">
                    <p><strong>Doctor:</strong> {doctors.find(d => d.id === selectedDoctor)?.name}</p>
                    <p><strong>Date:</strong> {appointmentDate}</p>
                    <p><strong>Time:</strong> {appointmentTime}</p>
                    <p><strong>Patient:</strong> {patientName}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button className="btn-medical w-full">
                    <Video className="w-4 h-4 mr-2" />
                    Join Video Call (Available 10 mins before)
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Video Consultation</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with certified doctors from the comfort of your home. Get expert medical advice through secure video calls.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Doctor Selection */}
          <div className="lg:col-span-2">
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Choose Your Doctor</CardTitle>
                <CardDescription>
                  Select from our qualified healthcare professionals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedDoctor === doctor.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedDoctor(doctor.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{doctor.name}</h3>
                              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{doctor.rating}</span>
                            </div>
                            <span>{doctor.experience}</span>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{doctor.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant={doctor.available ? "default" : "secondary"}
                                className={doctor.available ? "bg-secondary" : ""}
                              >
                                {doctor.available ? 'Available' : 'Busy'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Next: {doctor.nextSlot}
                              </span>
                            </div>
                            <span className="font-semibold text-primary">{doctor.price}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            <Card className="card-medical">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Book Appointment</span>
                </CardTitle>
                <CardDescription>
                  Schedule your video consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Patient Name</Label>
                  <Input
                    id="patient-name"
                    placeholder="Enter patient name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-age">Age</Label>
                  <Input
                    id="patient-age"
                    type="number"
                    placeholder="Enter age"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment-date">Preferred Date</Label>
                  <Input
                    id="appointment-date"
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment-time">Preferred Time</Label>
                  <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms/Reason</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Briefly describe your symptoms or reason for consultation"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleBookAppointment}
                  disabled={!selectedDoctor || !appointmentDate || !appointmentTime || !patientName || isBooking}
                  className="btn-medical w-full"
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Book Consultation
                    </>
                  )}
                </Button>

                {selectedDoctor && (
                  <div className="bg-muted/30 rounded-lg p-3 text-sm">
                    <p className="font-medium mb-1">Consultation Fee:</p>
                    <p className="text-primary font-semibold text-lg">
                      {doctors.find(d => d.id === selectedDoctor)?.price}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoConsultation;