import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Navigation, Star, Loader2, AlertTriangle } from 'lucide-react';
import { getCurrentLocation, geocodeAddress, Location, LocationError } from '@/lib/locationService';
import { searchPharmacies, Pharmacy, getDirectionsUrl, formatPhoneForCalling, getTodayHours } from '@/lib/pharmacyService';
import { useToast } from '@/hooks/use-toast';

const PharmacyLocator = () => {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLocationSearch = async () => {
    if (!location.trim()) return;
    
    setIsLocating(true);
    setError(null);
    
    try {
      const locationData = await geocodeAddress(location);
      setCurrentLocation(locationData);
      setLocation(locationData.address || location);
      await searchPharmaciesAtLocation(locationData);
      
      toast({
        title: "Location Found",
        description: `Found location: ${locationData.address || location}`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to find location';
      setError(errorMessage);
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLocating(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    setError(null);
    
    try {
      const locationData = await getCurrentLocation();
      setCurrentLocation(locationData);
      setLocation(locationData.address || `${locationData.latitude}, ${locationData.longitude}`);
      await searchPharmaciesAtLocation(locationData);
      
      toast({
        title: "Location Found",
        description: "Using your current location",
      });
    } catch (error) {
      const locationError = error as LocationError;
      setError(locationError.message);
      toast({
        title: "Location Access Error",
        description: locationError.message,
        variant: "destructive"
      });
    } finally {
      setIsLocating(false);
    }
  };

  const searchPharmaciesAtLocation = async (loc: Location) => {
    setIsSearching(true);
    
    try {
      const result = await searchPharmacies({
        latitude: loc.latitude,
        longitude: loc.longitude,
        query: searchQuery,
        radius: 10,
        limit: 20
      });
      
      setPharmacies(result.pharmacies);
      
      toast({
        title: "Pharmacy Search Complete",
        description: `Found ${result.pharmacies.length} pharmacies nearby`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search pharmacies';
      setError(errorMessage);
      toast({
        title: "Search Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handlePharmacySearch = async () => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Please set your location first",
        variant: "destructive"
      });
      return;
    }
    
    await searchPharmaciesAtLocation(currentLocation);
  };

  const handleCallPharmacy = (pharmacy: Pharmacy) => {
    const phoneUrl = `tel:${formatPhoneForCalling(pharmacy.phone)}`;
    window.open(phoneUrl, '_self');
  };

  const handleGetDirections = (pharmacy: Pharmacy) => {
    const directionsUrl = getDirectionsUrl(
      pharmacy, 
      currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : undefined
    );
    window.open(directionsUrl, '_blank');
  };

  useEffect(() => {
    if (currentLocation && searchQuery !== undefined) {
      const timeoutId = setTimeout(() => {
        handlePharmacySearch();
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, currentLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Pharmacy Locator</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find nearby pharmacies, check availability, and get medications delivered to your doorstep.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="card-medical mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Find Pharmacies Near You</span>
              </CardTitle>
              <CardDescription>
                Search by location or use your current location to find the nearest pharmacies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-destructive">Location Error</h4>
                      <p className="text-xs text-destructive/80 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Enter your location (city, area, pincode)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleLocationSearch}
                    disabled={isLocating || !location.trim()}
                    className="btn-medical flex-1"
                  >
                    {isLocating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <MapPin className="w-4 h-4 mr-2" />
                    )}
                    {isLocating ? 'Searching...' : 'Search'}
                  </Button>
                  <Button
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    variant="outline"
                    className="flex-1"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {isLocating ? 'Getting...' : 'Current'}
                  </Button>
                </div>
              </div>
              
              {currentLocation && (
                <div className="mt-4 flex space-x-2">
                  <Input
                    placeholder="Search pharmacies by name or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  {isSearching && (
                    <div className="flex items-center px-3">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {currentLocation && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="card-medical">
                <CardHeader>
                  <CardTitle>Map View</CardTitle>
                  <CardDescription>
                    Interactive map showing pharmacy locations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">
                        Showing {pharmacies.length} pharmacies near your location
                      </p>
                      {isSearching && (
                        <div className="flex items-center justify-center mt-2">
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span className="text-sm">Loading pharmacies...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    {isSearching ? 'Searching...' : `Found ${pharmacies.length} Pharmacies`}
                  </h2>
                  {searchQuery && (
                    <Badge variant="outline" className="text-xs">
                      Filtered by: {searchQuery}
                    </Badge>
                  )}
                </div>
                
                {pharmacies.map((pharmacy) => (
                  <Card key={pharmacy.id} className="card-medical">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{pharmacy.name}</h3>
                            <Badge 
                              variant={pharmacy.isOpen ? "default" : "secondary"}
                              className={pharmacy.isOpen ? "bg-secondary" : ""}
                            >
                              {pharmacy.isOpen ? 'Open' : 'Closed'}
                            </Badge>
                            {pharmacy.priceLevel && (
                              <Badge variant="outline" className="text-xs">
                                {'₹'.repeat(pharmacy.priceLevel)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 mb-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm">{pharmacy.rating}</span>
                              {pharmacy.reviewCount && (
                                <span className="text-sm text-muted-foreground">({pharmacy.reviewCount})</span>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">• {pharmacy.distanceText} away</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{getTodayHours(pharmacy)}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {pharmacy.services.map((service, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleCallPharmacy(pharmacy)}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleGetDirections(pharmacy)}
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Directions
                          </Button>
                          <Button 
                            className="btn-secondary-medical flex-1" 
                            size="sm"
                            onClick={() => {
                              if (pharmacy.website) {
                                window.open(pharmacy.website, '_blank');
                              } else {
                                toast({
                                  title: "Online Ordering",
                                  description: "Online ordering coming soon for this pharmacy",
                                });
                              }
                            }}
                          >
                            Order Online
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!currentLocation && !isLocating && (
            <div className="text-center py-12">
              <MapPin className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-2">Find Nearby Pharmacies</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Enter your location or use your current location to discover pharmacies in your area with real-time information
              </p>
              <div className="flex justify-center space-x-4">
                <Button onClick={handleGetCurrentLocation} className="btn-medical">
                  <Navigation className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>
              </div>
            </div>
          )}
          
          {currentLocation && pharmacies.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <MapPin className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-2">No Pharmacies Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? `No pharmacies found matching "${searchQuery}" in your area. Try a different search term.`
                  : "No pharmacies found in your area. Try expanding your search radius or check a different location."
                }
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyLocator;