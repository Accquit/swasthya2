import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Calendar as CalendarIcon, Clock, MapPin, Phone, Video, 
  Edit, Save, X, Plus, FileText, Heart, Pill, Brain 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

interface Appointment {
  id: string;
  type: 'video' | 'clinic' | 'pharmacy' | 'mental-health';
  title: string;
  doctor: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  location?: string;
  notes?: string;
}

const handleSignOut = async () => {
  const { error } = await signOut();
  if (error) {
    toast({
      title: "Error",
      description: "Failed to sign out. Please try again.",
      variant: "destructive"
    });
  } else {
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out."
    });
  }
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    bloodType: '',
    allergies: [],
    medications: []
  });

  // Sample appointments data
  useEffect(() => {
    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        type: 'video',
        title: 'General Consultation',
        doctor: 'Dr. Sarah Johnson',
        date: '2024-01-20',
        time: '10:00 AM',
        status: 'upcoming',
        notes: 'Follow-up for blood pressure monitoring'
      },
      {
        id: '2',
        type: 'clinic',
        title: 'Annual Health Checkup',
        doctor: 'Dr. Michael Chen',
        date: '2024-01-25',
        time: '2:30 PM',
        status: 'upcoming',
        location: 'City Medical Center, Room 302'
      },
      {
        id: '3',
        type: 'mental-health',
        title: 'Therapy Session',
        doctor: 'Dr. Emily Davis',
        date: '2024-01-15',
        time: '11:00 AM',
        status: 'completed',
        notes: 'Stress management techniques discussed'
      },
      {
        id: '4',
        type: 'pharmacy',
        title: 'Medication Pickup',
        doctor: 'Apollo Pharmacy',
        date: '2024-01-22',
        time: '4:00 PM',
        status: 'upcoming',
        location: 'Apollo Pharmacy, MG Road'
      }
    ];
    setAppointments(sampleAppointments);
  }, []);

  const handleProfileSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const getAppointmentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'clinic': return <Heart className="w-4 h-4" />;
      case 'pharmacy': return <Pill className="w-4 h-4" />;
      case 'mental-health': return <Brain className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getAppointmentColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-500';
      case 'clinic': return 'bg-green-500';
      case 'pharmacy': return 'bg-purple-500';
      case 'mental-health': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getFilteredAppointments = () => {
    if (!selectedDate) return appointments;
    
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === selectedDateStr);
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    return appointments.filter(apt => 
      apt.status === 'upcoming' && isAfter(parseISO(apt.date), startOfDay(today))
    ).slice(0, 5);
  };

  const getAppointmentStats = () => {
    const today = new Date();
    const upcoming = appointments.filter(apt => 
      apt.status === 'upcoming' && isAfter(parseISO(apt.date), today)
    ).length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;
    const thisMonth = appointments.filter(apt => {
      const aptDate = parseISO(apt.date);
      return aptDate.getMonth() === today.getMonth() && aptDate.getFullYear() === today.getFullYear();
    }).length;

    return { upcoming, completed, thisMonth };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to access your profile and appointments.
              </p>
              <Link to="/login">
                <Button className="btn-medical">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getAppointmentStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">My Profile</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage your personal information, appointments, and health records
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Profile Summary */}
                <Card className="card-medical">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-primary" />
                      <span>Profile Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-gradient-primary text-white text-lg">
                          {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        {profile.phone && (
                          <p className="text-sm text-muted-foreground">{profile.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {profile.bloodType && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Blood Type:</span>
                          <Badge variant="outline">{profile.bloodType}</Badge>
                        </div>
                      )}
                      {profile.allergies.length > 0 && (
                        <div>
                          <span className="text-sm text-muted-foreground">Allergies:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {profile.allergies.map((allergy, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="card-medical">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <span>Appointment Stats</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Upcoming</span>
                        <Badge className="bg-green-500">{stats.upcoming}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <Badge variant="secondary">{stats.completed}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">This Month</span>
                        <Badge variant="outline">{stats.thisMonth}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="card-medical">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button className="w-full btn-medical">
                        <Plus className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                      <Button variant="outline" className="w-full">
                        <FileText className="w-4 h-4 mr-2" />
                        View Reports
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Pill className="w-4 h-4 mr-2" />
                        Medication Reminders
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Appointments */}
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>
                    Your next {getUpcomingAppointments().length} scheduled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getUpcomingAppointments().map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${getAppointmentColor(appointment.type)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getAppointmentIcon(appointment.type)}
                            <h4 className="font-medium">{appointment.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <CalendarIcon className="w-3 h-3" />
                              <span>{format(parseISO(appointment.date), 'MMM dd, yyyy')}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{appointment.time}</span>
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {appointment.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>All Appointments</span>
                    <Button className="btn-medical">
                      <Plus className="w-4 h-4 mr-2" />
                      New Appointment
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Manage and view all your healthcare appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id} className="border-l-4" style={{borderLeftColor: getAppointmentColor(appointment.type).replace('bg-', '#')}}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                {getAppointmentIcon(appointment.type)}
                                <h4 className="font-semibold">{appointment.title}</h4>
                                <Badge 
                                  variant={appointment.status === 'upcoming' ? 'default' : 
                                          appointment.status === 'completed' ? 'secondary' : 'destructive'}
                                >
                                  {appointment.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{appointment.doctor}</p>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>{format(parseISO(appointment.date), 'MMM dd, yyyy')}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{appointment.time}</span>
                                </span>
                                {appointment.location && (
                                  <span className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{appointment.location}</span>
                                  </span>
                                )}
                              </div>
                              {appointment.notes && (
                                <p className="text-sm mt-2 p-2 bg-muted/50 rounded">{appointment.notes}</p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              {appointment.status === 'upcoming' && (
                                <Button variant="outline" size="sm">
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="card-medical">
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                    <CardDescription>
                      View your appointments in calendar format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      modifiers={{
                        hasAppointment: appointments.map(apt => parseISO(apt.date))
                      }}
                      modifiersStyles={{
                        hasAppointment: { 
                          backgroundColor: 'var(--primary)',
                          color: 'white',
                          fontWeight: 'bold'
                        }
                      }}
                    />
                  </CardContent>
                </Card>

                <Card className="card-medical">
                  <CardHeader>
                    <CardTitle>
                      {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a Date'}
                    </CardTitle>
                    <CardDescription>
                      Appointments for the selected day
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getFilteredAppointments().length > 0 ? (
                        getFilteredAppointments().map((appointment) => (
                          <div key={appointment.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                            <div className={`w-2 h-8 rounded ${getAppointmentColor(appointment.type)}`}></div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {getAppointmentIcon(appointment.type)}
                                <h5 className="font-medium text-sm">{appointment.title}</h5>
                              </div>
                              <p className="text-xs text-muted-foreground">{appointment.doctor}</p>
                              <p className="text-xs text-muted-foreground">{appointment.time}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {appointment.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No appointments on this day</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Personal Information</span>
                    <Button
                      variant="outline"
                      onClick={() => isEditing ? handleProfileSave() : setIsEditing(true)}
                    >
                      {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                      {isEditing ? 'Save' : 'Edit'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          disabled={true}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => setProfile({...profile, dateOfBirth: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Input
                          id="gender"
                          value={profile.gender}
                          onChange={(e) => setProfile({...profile, gender: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <Input
                          id="bloodType"
                          value={profile.bloodType}
                          onChange={(e) => setProfile({...profile, bloodType: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={profile.emergencyContact}
                          onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) => setProfile({...profile, address: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Account Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2 w-full md:w-auto"
                      onClick={handleSignOut}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;