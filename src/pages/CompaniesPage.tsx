
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Users, 
  Star, 
  ChevronRight,
  Building
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Mock data for companies
const mockCompanies = [
  {
    id: 'company1',
    name: 'Tech Innovations Inc.',
    logo: 'https://picsum.photos/seed/company1/80/80',
    description: 'A leading technology company specializing in innovative software solutions.',
    industry: 'Technology',
    location: 'San Francisco, CA',
    size: '1,000-5,000',
    openJobs: 12,
    rating: 4.5
  },
  {
    id: 'company2',
    name: 'Growth Marketing Co.',
    logo: 'https://picsum.photos/seed/company2/80/80',
    description: 'Helping brands grow through digital marketing and analytics.',
    industry: 'Marketing',
    location: 'New York, NY',
    size: '50-200',
    openJobs: 5,
    rating: 4.2
  },
  {
    id: 'company3',
    name: 'Global Financial Services',
    logo: 'https://picsum.photos/seed/company3/80/80',
    description: 'Providing financial solutions to individuals and businesses worldwide.',
    industry: 'Finance',
    location: 'Chicago, IL',
    size: '5,000-10,000',
    openJobs: 24,
    rating: 3.8
  },
  {
    id: 'company4',
    name: 'Healthcare Solutions',
    logo: 'https://picsum.photos/seed/company4/80/80',
    description: 'Innovative healthcare technology improving patient outcomes.',
    industry: 'Healthcare',
    location: 'Boston, MA',
    size: '500-1,000',
    openJobs: 8,
    rating: 4.0
  },
  {
    id: 'company5',
    name: 'Green Energy Innovations',
    logo: 'https://picsum.photos/seed/company5/80/80',
    description: 'Developing sustainable energy solutions for a greener future.',
    industry: 'Energy',
    location: 'Austin, TX',
    size: '200-500',
    openJobs: 15,
    rating: 4.7
  },
  {
    id: 'company6',
    name: 'Creative Design Studio',
    logo: 'https://picsum.photos/seed/company6/80/80',
    description: 'Award-winning design studio creating impactful brand experiences.',
    industry: 'Design',
    location: 'Los Angeles, CA',
    size: '10-50',
    openJobs: 3,
    rating: 4.4
  }
];

const industries = [
  'All Industries',
  'Technology',
  'Finance',
  'Healthcare',
  'Marketing',
  'Education',
  'Retail',
  'Manufacturing',
  'Design',
  'Energy'
];

const locations = [
  'All Locations',
  'San Francisco, CA',
  'New York, NY',
  'Chicago, IL',
  'Boston, MA',
  'Austin, TX',
  'Los Angeles, CA',
  'Seattle, WA',
  'Denver, CO',
  'Remote'
];

const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  
  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          company.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'All Industries' || company.industry === selectedIndustry;
    
    const matchesLocation = selectedLocation === 'All Locations' || company.location === selectedLocation;
    
    return matchesSearch && matchesIndustry && matchesLocation;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Companies</h1>
          <p className="text-muted-foreground mt-1">
            Discover great places to work and explore their open positions
          </p>
        </div>
        
        <Button asChild>
          <Link to="/jobs">
            <Briefcase className="mr-2 h-4 w-4" /> Browse All Jobs
          </Link>
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-950 rounded-lg border shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search companies..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            {filteredCompanies.length} companies found
          </p>
          
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> More Filters
          </Button>
        </div>
      </div>
      
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-12">
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No companies found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            We couldn't find any companies matching your search criteria. Try adjusting your filters or search term.
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setSelectedIndustry('All Industries');
            setSelectedLocation('All Locations');
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-6">
          Don't see what you're looking for? There are many more companies on our platform.
        </p>
        <Button asChild variant="outline">
          <Link to="/jobs">
            Browse All Jobs
          </Link>
        </Button>
      </div>
    </div>
  );
};

interface CompanyCardProps {
  company: typeof mockCompanies[0];
}

const CompanyCard = ({ company }: CompanyCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded bg-white flex items-center justify-center overflow-hidden border">
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">
                <Link to={`/companies/${company.id}`} className="hover:text-primary">
                  {company.name}
                </Link>
              </h3>
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="fill-current h-4 w-4" />
                <span className="text-sm font-medium">{company.rating}</span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
            {company.description}
          </p>
        </div>
        
        <Separator />
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{company.industry}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{company.location}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-muted-foreground mr-2" />
              <span>{company.size} employees</span>
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-primary mr-2" />
              <span className="font-medium text-primary">{company.openJobs} open jobs</span>
            </div>
          </div>
          
          <Button asChild variant="outline" className="w-full mt-4">
            <Link to={`/companies/${company.id}`}>
              View Company <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompaniesPage;
