
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Answer } from '@/types';

interface ApplicationAnswersCardProps {
  answers: Answer[];
}

const ApplicationAnswersCard: React.FC<ApplicationAnswersCardProps> = ({ answers }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Responses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {answers?.map((answer, index) => (
          <div key={answer.id} className="space-y-2">
            <h3 className="font-medium">Question {index + 1}</h3>
            <p className="text-sm">{answer.answerText}</p>
            {answer.aiScore !== undefined && (
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground mr-2">AI Score:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {answer.aiScore}%
                </Badge>
              </div>
            )}
            {index < answers.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ApplicationAnswersCard;
