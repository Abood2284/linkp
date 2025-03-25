import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Privacy Policy | Linkp",
  description: "Privacy policy for Linkp link-in-bio platform",
};

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container max-w-4xl py-12 px-4 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {currentDate}</p>
      </div>

      <Card className="mb-10">
        <CardContent className="pt-6">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              This privacy policy outlines how Linkp (&quot;we,&quot;
              &quot;our,&quot; or &quot;us&quot;) collects, uses, stores, and
              protects information obtained from users of our link-in-bio
              platform. Our platform connects creators, brands, and audiences
              through high-performance, analytics-driven link-in-bio pages.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Information We Collect
            </h2>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Account Information</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Email address and name</li>
                <li>Profile information</li>
                <li>Account credentials</li>
                <li>Subscription and payment details</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Platform Usage Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Workspace configurations</li>
                <li>Links created and managed</li>
                <li>Templates selected</li>
                <li>Brand collaboration details</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Analytics Data</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Page views and click data</li>
                <li>Geographic location of visitors</li>
                <li>Device and browser information</li>
                <li>Referral sources</li>
                <li>Engagement metrics</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">
                Connected Services Data
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Information from connected social media accounts (Instagram,
                  etc.)
                </li>
                <li>Platform metrics (follower counts, engagement rates)</li>
                <li>Content performance data</li>
                <li>Authentication tokens</li>
              </ul>
            </div>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              How We Use Your Information
            </h2>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">
                Core Service Functionality
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Creating and maintaining your account</li>
                <li>Providing our link-in-bio service</li>
                <li>Processing payments and subscriptions</li>
                <li>Delivering analytics insights</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Platform Improvement</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Enhancing user experience</li>
                <li>Developing new features</li>
                <li>Troubleshooting technical issues</li>
                <li>Improving platform performance</li>
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">
                Business Relationships
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Facilitating creator-brand connections</li>
                <li>Managing the collaboration marketplace</li>
                <li>Processing commissions on collaborations</li>
                <li>Verifying performance metrics</li>
              </ul>
            </div>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Data Storage and Security
            </h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to
              protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Data encryption in transit and at rest</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication protocols</li>
              <li>Cloudflare infrastructure for enhanced security</li>
              <li>Database backups and disaster recovery procedures</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Third-Party Services
            </h2>
            <p className="text-muted-foreground mb-4">
              Our platform integrates with third-party services:
            </p>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">
                Social Media Platforms
              </h3>
              <p className="text-muted-foreground">
                We may request access to your social media accounts (like
                Instagram) when you connect them to our platform. This access is
                governed both by our privacy policy and the respective
                platform&apos;s terms and privacy policies.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Payment Processors</h3>
              <p className="text-muted-foreground">
                Payment information is handled by secure third-party payment
                processors in compliance with PCI-DSS standards.
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-medium mb-2">Analytics Tools</h3>
              <p className="text-muted-foreground">
                We use analytics providers to help us understand platform usage
                and performance.
              </p>
            </div>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Cookies and Similar Technologies
            </h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Maintain user sessions</li>
              <li>Remember preferences</li>
              <li>Analyze platform usage</li>
              <li>Improve performance</li>
              <li>Personalize content</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground">
              We retain your information as long as your account is active or as
              needed to provide services. You may request deletion of your data,
              subject to legal retention requirements and legitimate business
              purposes.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have rights to:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Delete your data</li>
              <li>Object to certain processing</li>
              <li>Export your data</li>
              <li>Withdraw consent</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground">
              Our services are not directed to individuals under 16. We do not
              knowingly collect personal information from children. If we become
              aware that we have collected personal information from a child
              without verification of parental consent, we will take steps to
              remove that information.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              International Data Transfers
            </h2>
            <p className="text-muted-foreground">
              Linkp operates globally, and your information may be transferred
              to and processed in countries outside your residence. We ensure
              adequate safeguards are in place for these transfers.
            </p>
          </section>

          <Separator className="my-6" />

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground mb-4">
              We may update this privacy policy periodically. We will notify you
              of significant changes by:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Email notification</li>
              <li>Notice on our platform</li>
              <li>Updated "Last modified" date on the policy</li>
            </ul>
          </section>

          <Separator className="my-6" />

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about this privacy policy or your data:
            </p>
            <p className="text-muted-foreground">
              Email: abdulraheemsayyed@gmail.com
            </p>
            <p className="text-muted-foreground">
              Address: ahmed bld, byculla east, mumbai 400027
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
