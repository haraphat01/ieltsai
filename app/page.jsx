import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { GraduationCap, BookOpen, Sparkles, Clock, BarChart2, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-primary">
          Ace Your IELTS with AI-Enhanced Practice
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Boost your score with targeted, AI-driven feedback on all IELTS sections. Personalized insights and structured practice to get you exam-ready.
        </p>
        <Link href="/signup">
          <Button className="text-xl font-semibold py-4 px-8">Start Your Free Trial</Button>
        </Link>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-20">
        {[
          {
            icon: <Clock className="h-8 w-8 text-primary" />,
            title: "Fast, Targeted Feedback",
            description: "AI evaluates your responses in seconds, pinpointing areas for improvement."
          },
          {
            icon: <BarChart2 className="h-8 w-8 text-primary" />,
            title: "Detailed Score Insights",
            description: "Receive band scores for each section along with in-depth analysis to refine your skills."
          },
          {
            icon: <CheckCircle className="h-8 w-8 text-primary" />,
            title: "Track Your Progress",
            description: "Monitor your scores and identify trends to stay on track and meet your goals."
          },
        ].map((benefit, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
              {benefit.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
            <p className="text-muted-foreground">{benefit.description}</p>
          </Card>
        ))}
      </div>

      {/* Practice Sections */}
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
        <Card className="p-8 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Academic IELTS</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Essential for students and professionals aiming for academic certifications.
          </p>
          <Link href="/practice/academic">
            <Button className="w-full">Start Academic Practice</Button>
          </Link>
        </Card>

        <Card className="p-8 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">General IELTS</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Perfect for those pursuing immigration or assessing general English proficiency.
          </p>
          <Link href="/practice/general">
            <Button className="w-full">Start General Practice</Button>
          </Link>
        </Card>
      </div>

      {/* Key Features Section */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Top Features</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: <Sparkles className="h-6 w-6" />,
              title: "AI-Powered Feedback",
              description: "Get instant, detailed feedback on your writing and speaking responses."
            },
            {
              icon: <BookOpen className="h-6 w-6" />,
              title: "Comprehensive Practice",
              description: "Practice all IELTS sections: Reading, Writing, Listening, and Speaking."
            },
            {
              icon: <GraduationCap className="h-6 w-6" />,
              title: "Performance Tracking",
              description: "Track your progress with performance analytics."
            }
          ].map((feature, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              quote: "This platform boosted my confidence! The AI feedback was incredibly accurate and helped me improve my writing and speaking.",
              name: "Sarah L.",
              score: "IELTS 8.0"
            },
            {
              quote: "Perfect for a busy schedule! I could practice any section whenever I had time and get instant feedback.",
              name: "Mark R.",
              score: "IELTS 7.5"
            }
          ].map((testimonial, index) => (
            <Card key={index} className="p-8">
              <p className="text-lg mb-4">“{testimonial.quote}”</p>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.score}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Boost Your IELTS Score?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          Join thousands of students who are preparing smarter and reaching their target scores with our AI-powered IELTS platform.
        </p>
        <Link href="/signup">
          <Button className="text-xl font-semibold py-4 px-8">Get Started for Free</Button>
        </Link>
      </div>
    </div>
  )
}
