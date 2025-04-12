
/**
 * Generates a mock analysis report for CV review
 */
export const generateAnalysisReport = (cvName: string) => {
  return {
    fileName: `${cvName.split('.')[0]}_Analysis.pdf`,
    content: `
    CV Analysis Report for ${cvName}
    
    Strengths:
    - Good education section with relevant qualifications
    - Clear work history with quantifiable achievements
    - Technical skills clearly articulated
    
    Areas for Improvement:
    - Consider adding a more impactful professional summary
    - Quantify more achievements with specific metrics
    - Tailor skills section to match job descriptions more closely
    
    Recommendations:
    1. Add more keywords related to your target industry
    2. Reorganize experience to highlight most relevant achievements first
    3. Use action verbs at the beginning of each bullet point
    4. Include relevant certifications prominently
    
    Analysis Score: 78/100
    `,
    date: new Date().toISOString()
  };
};

/**
 * Creates and triggers download of CV analysis report
 */
export const downloadAnalysisReport = (cvId: string, fileName: string, content: string) => {
  // Create a Blob from the text content
  const blob = new Blob([content], { type: 'text/plain' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  
  // Programmatically click the anchor to trigger download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
