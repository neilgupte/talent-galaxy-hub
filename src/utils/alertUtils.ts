
import { Profile } from '@/types';

// Generate suggested alerts based on user profile and applications
export async function getSuggestedAlerts(profile: Profile, applications: any[]) {
  const suggestions: any[] = [];
  
  // Extract job titles from applications
  if (applications && applications.length > 0) {
    // Group applications by job title to find most common ones
    const jobTitleCount = applications.reduce((acc: Record<string, number>, app: any) => {
      const title = app.job?.title;
      if (title) {
        // Extract the main job role (e.g., "UX Designer", "Software Engineer")
        const mainRole = extractMainJobRole(title);
        if (mainRole) {
          acc[mainRole] = (acc[mainRole] || 0) + 1;
        }
      }
      return acc;
    }, {});
    
    // Get the most common job titles
    const mostCommonTitles = Object.entries(jobTitleCount)
      .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
      .slice(0, 2)
      .map(([title]) => title);
    
    if (mostCommonTitles.length > 0) {
      // Get most common location
      const locationCount = applications.reduce((acc: Record<string, number>, app: any) => {
        const location = app.job?.location;
        if (location) {
          acc[location] = (acc[location] || 0) + 1;
        }
        return acc;
      }, {});
      
      const mostCommonLocation = Object.entries(locationCount)
        .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
        .map(([location]) => location)[0];
      
      // Get most common employment types and job levels
      const employmentTypes = new Set<string>();
      const jobLevels = new Set<string>();
      
      applications.slice(0, 5).forEach((app: any) => {
        if (app.job?.employment_type) {
          employmentTypes.add(app.job.employment_type);
        }
        if (app.job?.job_level) {
          jobLevels.add(app.job.job_level);
        }
      });
      
      suggestions.push({
        keywords: [mostCommonTitles[0]],
        location: mostCommonLocation,
        employmentTypes: Array.from(employmentTypes).length > 0 ? Array.from(employmentTypes) : null,
        jobLevels: Array.from(jobLevels).length > 0 ? Array.from(jobLevels) : null,
        salaryMin: null,
        salaryMax: null,
      });
    }
  }
  
  // Create suggestions based on profile skills and title
  if (profile.skills && profile.skills.length > 0) {
    // Group skills by likely profession
    const devSkills = ['javascript', 'react', 'node', 'python', 'java', 'typescript', 'angular', 'vue', 'c#', 'php'];
    const designSkills = ['ui', 'ux', 'design', 'photoshop', 'figma', 'illustrator', 'sketch'];
    const marketingSkills = ['marketing', 'seo', 'social media', 'content', 'analytics', 'advertising'];
    
    const hasDevSkills = profile.skills.some(skill => 
      devSkills.some(devSkill => skill.toLowerCase().includes(devSkill))
    );
    
    const hasDesignSkills = profile.skills.some(skill => 
      designSkills.some(designSkill => skill.toLowerCase().includes(designSkill))
    );
    
    const hasMarketingSkills = profile.skills.some(skill => 
      marketingSkills.some(marketingSkill => skill.toLowerCase().includes(marketingSkill))
    );
    
    if (hasDevSkills && !suggestions.some(s => s.keywords.includes('Developer'))) {
      suggestions.push({
        keywords: ['Developer', 'Engineer', 'Programmer'],
        location: profile.location || null,
        employmentTypes: null,
        jobLevels: null,
        salaryMin: null,
        salaryMax: null,
      });
    }
    
    if (hasDesignSkills && !suggestions.some(s => s.keywords.includes('Designer'))) {
      suggestions.push({
        keywords: ['Designer', 'UX', 'UI'],
        location: profile.location || null,
        employmentTypes: null,
        jobLevels: null,
        salaryMin: null,
        salaryMax: null,
      });
    }
    
    if (hasMarketingSkills && !suggestions.some(s => s.keywords.includes('Marketing'))) {
      suggestions.push({
        keywords: ['Marketing', 'Digital'],
        location: profile.location || null,
        employmentTypes: null,
        jobLevels: null,
        salaryMin: null,
        salaryMax: null,
      });
    }
    
    // Add suggestion based on current title if available
    if (profile.currentTitle && !suggestions.some(s => s.keywords.includes(profile.currentTitle))) {
      suggestions.push({
        keywords: [profile.currentTitle],
        location: profile.location || null,
        employmentTypes: null,
        jobLevels: null,
        salaryMin: null,
        salaryMax: null,
      });
    }
  }
  
  // Limit to 3 suggestions
  return suggestions.slice(0, 3);
}

// Helper function to extract main job role from job title
function extractMainJobRole(jobTitle: string): string | null {
  // Remove common prefixes like "Senior", "Junior", etc.
  const title = jobTitle.replace(/^(senior|junior|lead|principal|staff|chief|head of|director of)\s+/i, '');
  
  // Extract the first 2-3 words as the main role
  const words = title.split(' ');
  const mainRole = words.slice(0, Math.min(words.length, 2)).join(' ');
  
  return mainRole || null;
}
