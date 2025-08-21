import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  User,
  Building2,
  Car,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: string;
  plateNumber: string;
  color: string;
  engineNumber: string;
  chassisNumber: string;
}

interface CustomerFormData {
  // Basic Information
  firstName: string;
  lastName: string;
  companyName: string;
  customerType: 'Personal' | 'Government' | 'NGO' | 'Private' | '';
  subType: string;
  
  // Contact Information
  phone: string;
  email: string;
  altPhone: string;
  address: string;
  city: string;
  district: string;
  country: string;
  
  // Business Information (for non-personal)
  businessRegNumber: string;
  taxId: string;
  contactPerson: string;
  
  // Personal Information (for personal customers)
  nationalId: string;
  isOwner: boolean;
  ownerName: string;
  relationship: string;
  
  // Vehicle Information
  vehicles: VehicleInfo[];
  
  // Service Preferences
  preferredServices: string[];
  notes: string;
}

const customerSubTypes = {
  Personal: ['Car Owner', 'Driver (Brings Client Car)', 'Motorcycle Owner', 'Other'],
  Government: ['Fleet Management', 'Individual Department', 'Parastatal', 'Local Government'],
  NGO: ['International NGO', 'Local NGO', 'Humanitarian Organization', 'Development Agency'],
  Private: ['Company Fleet', 'Taxi/Uber Company', 'Transport Business', 'Motorcycle (Bodaboda)', 'Other Business'],
};

const availableServices = [
  'Oil Change',
  'Tire Installation',
  'Tire Sales',
  'Engine Repair',
  'Brake Service',
  'Transmission Service',
  'AC Service',
  'Battery Service',
  'Consultation',
  'Fleet Maintenance',
];

export default function AddCustomer() {
  const [formData, setFormData] = useState<CustomerFormData>({
    firstName: '',
    lastName: '',
    companyName: '',
    customerType: '',
    subType: '',
    phone: '',
    email: '',
    altPhone: '',
    address: '',
    city: '',
    district: '',
    country: 'Uganda',
    businessRegNumber: '',
    taxId: '',
    contactPerson: '',
    nationalId: '',
    isOwner: true,
    ownerName: '',
    relationship: '',
    vehicles: [],
    preferredServices: [],
    notes: '',
  });

  const [currentVehicle, setCurrentVehicle] = useState<VehicleInfo>({
    id: '',
    make: '',
    model: '',
    year: '',
    plateNumber: '',
    color: '',
    engineNumber: '',
    chassisNumber: '',
  });

  const handleInputChange = (field: keyof CustomerFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleVehicleChange = (field: keyof VehicleInfo, value: string) => {
    setCurrentVehicle(prev => ({ ...prev, [field]: value }));
  };

  const addVehicle = () => {
    if (currentVehicle.make && currentVehicle.model) {
      const newVehicle = {
        ...currentVehicle,
        id: Date.now().toString(),
      };
      setFormData(prev => ({
        ...prev,
        vehicles: [...prev.vehicles, newVehicle]
      }));
      setCurrentVehicle({
        id: '',
        make: '',
        model: '',
        year: '',
        plateNumber: '',
        color: '',
        engineNumber: '',
        chassisNumber: '',
      });
    }
  };

  const removeVehicle = (vehicleId: string) => {
    setFormData(prev => ({
      ...prev,
      vehicles: prev.vehicles.filter(v => v.id !== vehicleId)
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      preferredServices: prev.preferredServices.includes(service)
        ? prev.preferredServices.filter(s => s !== service)
        : [...prev.preferredServices, service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Customer Data:', formData);
    // Here you would typically send the data to your backend
    alert('Customer registered successfully!');
  };

  const isPersonal = formData.customerType === 'Personal';
  const isBusiness = ['Government', 'NGO', 'Private'].includes(formData.customerType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/customers/search">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Customer</h1>
          <p className="text-muted-foreground">
            Register a new customer with complete information for tracking and services
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact & Address</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Customer type and identification details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Type */}
                <div className="space-y-3">
                  <Label>Customer Type *</Label>
                  <RadioGroup
                    value={formData.customerType}
                    onValueChange={(value) => handleInputChange('customerType', value)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
                      <RadioGroupItem value="Personal" id="personal" />
                      <Label htmlFor="personal" className="flex-1 cursor-pointer">
                        <div className="font-medium">Personal</div>
                        <div className="text-sm text-muted-foreground">Individual customers</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
                      <RadioGroupItem value="Government" id="government" />
                      <Label htmlFor="government" className="flex-1 cursor-pointer">
                        <div className="font-medium">Government</div>
                        <div className="text-sm text-muted-foreground">Government entities</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
                      <RadioGroupItem value="NGO" id="ngo" />
                      <Label htmlFor="ngo" className="flex-1 cursor-pointer">
                        <div className="font-medium">NGO</div>
                        <div className="text-sm text-muted-foreground">Non-profit organizations</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent">
                      <RadioGroupItem value="Private" id="private" />
                      <Label htmlFor="private" className="flex-1 cursor-pointer">
                        <div className="font-medium">Private</div>
                        <div className="text-sm text-muted-foreground">Private companies</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Sub Type */}
                {formData.customerType && (
                  <div className="space-y-2">
                    <Label htmlFor="subType">Customer Sub-Type *</Label>
                    <Select value={formData.subType} onValueChange={(value) => handleInputChange('subType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-type" />
                      </SelectTrigger>
                      <SelectContent>
                        {customerSubTypes[formData.customerType as keyof typeof customerSubTypes]?.map((subType) => (
                          <SelectItem key={subType} value={subType}>
                            {subType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Name Fields */}
                <div className="grid gap-4 md:grid-cols-2">
                  {isPersonal ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter first name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter last name"
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="companyName">Organization/Company Name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        placeholder="Enter organization or company name"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* Personal Customer Specific Fields */}
                {isPersonal && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">National ID</Label>
                      <Input
                        id="nationalId"
                        value={formData.nationalId}
                        onChange={(e) => handleInputChange('nationalId', e.target.value)}
                        placeholder="Enter national ID number"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isOwner"
                          checked={formData.isOwner}
                          onCheckedChange={(checked) => handleInputChange('isOwner', checked)}
                        />
                        <Label htmlFor="isOwner">I am the vehicle owner</Label>
                      </div>

                      {!formData.isOwner && (
                        <div className="grid gap-4 md:grid-cols-2 ml-6">
                          <div className="space-y-2">
                            <Label htmlFor="ownerName">Vehicle Owner Name</Label>
                            <Input
                              id="ownerName"
                              value={formData.ownerName}
                              onChange={(e) => handleInputChange('ownerName', e.target.value)}
                              placeholder="Enter owner's name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="relationship">Relationship to Owner</Label>
                            <Select value={formData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="driver">Driver</SelectItem>
                                <SelectItem value="family">Family Member</SelectItem>
                                <SelectItem value="employee">Employee</SelectItem>
                                <SelectItem value="friend">Friend</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Business Customer Specific Fields */}
                {isBusiness && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="businessRegNumber">Registration Number</Label>
                      <Input
                        id="businessRegNumber"
                        value={formData.businessRegNumber}
                        onChange={(e) => handleInputChange('businessRegNumber', e.target.value)}
                        placeholder="Business registration number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={formData.taxId}
                        onChange={(e) => handleInputChange('taxId', e.target.value)}
                        placeholder="Tax identification number"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="contactPerson">Primary Contact Person</Label>
                      <Input
                        id="contactPerson"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        placeholder="Name of primary contact person"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact & Address Information
                </CardTitle>
                <CardDescription>
                  Communication details and location information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Primary Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+256 700 123 456"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="altPhone">Alternative Phone</Label>
                    <Input
                      id="altPhone"
                      type="tel"
                      value={formData.altPhone}
                      onChange={(e) => handleInputChange('altPhone', e.target.value)}
                      placeholder="+256 700 123 456"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter full street address"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City/Town *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g., Kampala"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="e.g., Kampala"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Uganda"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vehicles */}
          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Information
                </CardTitle>
                <CardDescription>
                  Add vehicles that will receive services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add New Vehicle Form */}
                <div className="border rounded-lg p-4 space-y-4">
                  <h4 className="font-medium">Add Vehicle</h4>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Input
                      placeholder="Make (e.g., Toyota)"
                      value={currentVehicle.make}
                      onChange={(e) => handleVehicleChange('make', e.target.value)}
                    />
                    <Input
                      placeholder="Model (e.g., Camry)"
                      value={currentVehicle.model}
                      onChange={(e) => handleVehicleChange('model', e.target.value)}
                    />
                    <Input
                      placeholder="Year"
                      value={currentVehicle.year}
                      onChange={(e) => handleVehicleChange('year', e.target.value)}
                    />
                    <Input
                      placeholder="Plate Number"
                      value={currentVehicle.plateNumber}
                      onChange={(e) => handleVehicleChange('plateNumber', e.target.value)}
                    />
                    <Input
                      placeholder="Color"
                      value={currentVehicle.color}
                      onChange={(e) => handleVehicleChange('color', e.target.value)}
                    />
                    <Button
                      type="button"
                      onClick={addVehicle}
                      disabled={!currentVehicle.make || !currentVehicle.model}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      placeholder="Engine Number (optional)"
                      value={currentVehicle.engineNumber}
                      onChange={(e) => handleVehicleChange('engineNumber', e.target.value)}
                    />
                    <Input
                      placeholder="Chassis Number (optional)"
                      value={currentVehicle.chassisNumber}
                      onChange={(e) => handleVehicleChange('chassisNumber', e.target.value)}
                    />
                  </div>
                </div>

                {/* Vehicle List */}
                {formData.vehicles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Registered Vehicles ({formData.vehicles.length})</h4>
                    {formData.vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                          <p className="text-sm text-muted-foreground">
                            Plate: {vehicle.plateNumber} • Color: {vehicle.color}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVehicle(vehicle.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Service Preferences & Notes
                </CardTitle>
                <CardDescription>
                  Preferred services and additional information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Preferred Services</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {availableServices.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={formData.preferredServices.includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <Label htmlFor={service} className="text-sm cursor-pointer">
                          {service}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requirements, preferences, or important notes about this customer..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button type="button" variant="outline" asChild>
            <Link to="/customers/search">Cancel</Link>
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Register Customer
          </Button>
        </div>
      </form>
    </div>
  );
}
