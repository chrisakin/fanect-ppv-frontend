import React from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export const Terms = (): JSX.Element => {
  return (
    <div className="bg-background text-foreground max-w-[1440px] mx-auto">
      <Header />
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-16 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p className="text-lg">Last updated: February 2024</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using FaNect, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Content and Conduct</h2>
            <p>
              Users agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violate any laws or regulations</li>
              <li>Infringe upon intellectual property rights</li>
              <li>Share inappropriate or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};