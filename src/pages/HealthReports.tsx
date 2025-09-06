import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FileText, Download, Upload, Calendar, TrendingUp, Heart, Activity, User } from 'lucide-react';

const healthMetrics = [
  {
    id: 1,
    name: 'Blood Pressure',
    value: '120/80',
    unit: 'mmHg',
    status: 'normal',
    lastUpdated: '2024-01-15',
    trend: 'stable'
  },
  {
    id: 2,
    name: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    status: 'normal',
    lastUpdated: '2024-01-15',
    trend: 'improving'
  },
  {
    id: 3,
    name: 'Blood Sugar',
    value: '95',
    unit: 'mg/dL',
    status: 'normal',
    lastUpdated: '2024-01-14',
    trend: 'stable'
  },
  {
    id: 4,
    name: 'BMI',
    value: '23.5',
    unit: 'kg/m²',
    status: 'normal',
    lastUpdated: '2024-01-10',
    trend: 'stable'
  }
];

const reports = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    date: '2024-01-10',
    doctor: 'Dr. Priya Sharma',
    status: 'Normal',
    type: 'Lab Report'
  },
  {
    id: 2,
    name: 'Lipid Profile',
    date: '2024-01-08',
    doctor: 'Dr. Rajesh Kumar',
    status: 'Attention Needed',
    type: 'Lab Report'
  },
  {
    id: 3,
    name: 'Chest X-Ray',
    date: '2024-01-05',
    doctor: 'Dr. Anita Verma',
    status: 'Normal',
    type: 'Imaging'
  },
  {
    id: 4,
    name: 'Annual Health Checkup',
    date: '2024-01-01',
    doctor: 'Dr. Suresh Patel',
    status: 'Good Health',
    type: 'General'
  }
];

const appointments = [
  {
    id: 1,
    doctor: 'Dr. Priya Sharma',
    specialty: 'General Medicine',
    date: '2024-01-20',
    time: '10:00 AM',
    type: 'Follow-up',
    status: 'Upcoming'
  },
  {
    id: 2,
    doctor: 'Dr. Rajesh Kumar',
    specialty: 'Cardiology',
    date: '2024-01-18',
    time: '2:00 PM',
    type: 'Consultation',
    status: 'Completed'
  }
];

const HealthReports = () => {
  const [selectedReport, setSelectedReport] = useState<number | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
      case 'good health':
        return 'bg-secondary text-secondary-foreground';
      case 'attention needed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-secondary" />;
      case 'declining':
        return <TrendingUp className="w-4 h-4 text-destructive rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Health Reports</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View your medical history, track health metrics, and manage your healthcare records in one place.
          </p>
        </div>

        <Tabs defaultValue="overview" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Health Summary */}
              <Card className="card-medical lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-primary" />
                    <span>Health Summary</span>
                  </CardTitle>
                  <CardDescription>
                    Your overall health status and recent metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {healthMetrics.map((metric) => (
                      <div key={metric.id} className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-2xl font-bold text-primary">
                            {metric.value}
                          </span>
                          <span className="text-sm text-muted-foreground ml-1">
                            {metric.unit}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">{metric.name}</p>
                        <div className="flex items-center justify-center space-x-1">
                          {getTrendIcon(metric.trend)}
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(metric.status)}
                          >
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Manage your health records
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="btn-medical w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Report
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Checkup
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Medical History
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card className="card-medical">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>
                  Your latest medical reports and test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.slice(0, 3).map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{report.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {report.date} • Dr. {report.doctor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">All Reports</h2>
              <Button className="btn-medical">
                <Upload className="w-4 h-4 mr-2" />
                Upload New Report
              </Button>
            </div>

            <div className="grid gap-4">
              {reports.map((report) => (
                <Card key={report.id} className="card-medical">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{report.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {report.type} • {report.date}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Conducted by {report.doctor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {healthMetrics.map((metric) => (
                <Card key={metric.id} className="card-medical">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{metric.name}</span>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(metric.trend)}
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Last updated: {metric.lastUpdated}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-primary mb-2">
                        {metric.value}
                        <span className="text-lg text-muted-foreground ml-2">
                          {metric.unit}
                        </span>
                      </div>
                    </div>
                    
                    {/* Mock trend chart */}
                    <div className="h-32 bg-muted/30 rounded-lg flex items-end justify-center p-4">
                      <div className="flex items-end space-x-2">
                        {[65, 72, 68, 75, 70, 72, 74].map((height, index) => (
                          <div
                            key={index}
                            className="bg-primary/60 w-4 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" className="w-full">
                        Add Reading
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Appointments</h2>
              <Button className="btn-medical">
                <Calendar className="w-4 h-4 mr-2" />
                Book New Appointment
              </Button>
            </div>

            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="card-medical">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{appointment.doctor}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {appointment.specialty}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant="outline"
                          className={appointment.status === 'Upcoming' ? 'border-primary text-primary' : 'border-secondary text-secondary'}
                        >
                          {appointment.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {appointment.type}
                        </Badge>
                        {appointment.status === 'Upcoming' && (
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthReports;