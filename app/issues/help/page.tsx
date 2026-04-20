"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, MessageSquare, BookOpen, Zap } from "lucide-react";
import { useDebounce } from "../../../lib/hooks/useDebounce";

const faqItems = [
  {
    id: "item-1",
    question: "How do I create a new issue?",
    answer:
      'Navigate to the Issues page and click the "New Issue" button. Fill in the required details including title, description, priority, and status, then click "Create Issue".',
  },
  {
    id: "item-2",
    question: "Can I assign issues to team members?",
    answer:
      "Yes, you can assign issues to team members by clicking the issue and selecting an assignee from the dropdown menu. You can only assign to users in your workspace.",
  },
  {
    id: "item-3",
    question: "How do I filter issues by priority?",
    answer:
      "Use the Filter Bar at the top of the Issues page to filter by priority level. You can select one or multiple priority levels (Low, Medium, High, Urgent).",
  },
  {
    id: "item-4",
    question: "What status options are available?",
    answer:
      "Issues can have the following statuses: Open, In Progress, In Review, and Closed. You can update the status from the issue detail view or directly from the table.",
  },
  {
    id: "item-5",
    question: "How do I export issue data?",
    answer:
      "Currently, you can view all issues in the table format. Future releases will include export functionality for CSV and PDF formats.",
  },
  {
    id: "item-6",
    question: "Is my data secure?",
    answer:
      "Yes, all data is encrypted in transit using HTTPS. Your authentication tokens are securely stored and validated on every request.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const normalizedQuery = debouncedSearchQuery.trim().toLowerCase();
  const filteredFaqItems = faqItems.filter((item) => {
    if (!normalizedQuery) {
      return true;
    }

    return (
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery)
    );
  });

  return (
    <main className="flex-1 overflow-auto p-6 md:p-8">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
          <p className="text-muted-foreground mt-2">
            Find answers to common questions and get support
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8 bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Search Help
              </label>
              <Input
                placeholder="Search for topics, issues, or keywords..."
                className="bg-background"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-primary" />
                Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Read our comprehensive guide to get started with Issue Tracker
              </p>
              <Button variant="outline" size="sm">
                Read Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn the basics and start tracking issues in minutes
              </p>
              <Button variant="outline" size="sm">
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Email our support team for technical assistance
              </p>
              <Button variant="outline" size="sm">
                Email Us
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Join our community forum and connect with other users
              </p>
              <Button variant="outline" size="sm">
                Join Forum
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Find quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFaqItems.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                No help articles match your search.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
