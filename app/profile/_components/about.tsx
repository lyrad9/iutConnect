import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

export function About() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">
              Bachelor of Science in Computer Science
            </h4>
            <p className="text-sm text-muted-foreground">
              University of Technology • 2022 - 2025
            </p>
          </div>
          <div>
            <h4 className="font-semibold">High School Diploma</h4>
            <p className="text-sm text-muted-foreground">
              Tech Preparatory Academy • 2018 - 2022
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Research Assistant</h4>
            <p className="text-sm text-muted-foreground">
              University AI Lab • 2023 - Present
            </p>
            <p className="text-sm mt-1">
              Working on machine learning models for natural language
              processing.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Teaching Assistant</h4>
            <p className="text-sm text-muted-foreground">
              Intro to Programming • 2022 - 2023
            </p>
            <p className="text-sm mt-1">
              Assisted professor with labs and grading for first-year
              programming course.
            </p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              Python
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              JavaScript
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              React
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Machine Learning
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Data Analysis
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              TensorFlow
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              PyTorch
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              SQL
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Git
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              Artificial Intelligence
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Robotics
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Photography
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Hiking
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Chess
            </Button>
            <Button variant="outline" size="sm" className="rounded-full">
              Science Fiction
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
