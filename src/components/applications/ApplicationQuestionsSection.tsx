
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertCircle } from 'lucide-react';
import { JobQuestion } from '@/types';

interface ApplicationQuestionsSectionProps {
  questions: JobQuestion[];
  answers: Record<string, string>;
  handleAnswerChange: (questionId: string, value: string) => void;
  validationErrors: Record<string, string>;
}

const ApplicationQuestionsSection = ({ 
  questions, 
  answers, 
  handleAnswerChange,
  validationErrors
}: ApplicationQuestionsSectionProps) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Screening Questions</CardTitle>
        <CardDescription>
          Please answer the following questions to help the employer assess your fit for the role.
          <div className="mt-1 text-sm text-muted-foreground">
            <span className="text-red-500">*</span> indicates required questions
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question, index) => (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id} className="text-base font-medium">
              {question.questionText}
              {question.isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea 
              id={question.id} 
              className={`mt-2 min-h-[120px] ${validationErrors[question.id] ? 'border-red-500' : ''}`}
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              aria-invalid={!!validationErrors[question.id]}
            />
            {validationErrors[question.id] && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>{validationErrors[question.id]}</span>
              </div>
            )}
            {index < (questions.length || 0) - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ApplicationQuestionsSection;
