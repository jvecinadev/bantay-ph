const TermsContent = () => {
  return (
    <div className="space-y-8">
      <p className="text-xs text-text-secondary">
        Last updated: January 2025
      </p>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          1. About the Service
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            Bantay PH allows users to submit community reports — including
            text, location, and photos — for review and follow-up by
            authorized personnel such as validators and barangay staff.
          </p>
          <p className="rounded-xl border border-danger/30 bg-danger-light px-3.5 py-2.5 text-xs font-medium text-danger">
            This is not an emergency service. For emergencies, contact your
            local hotline or emergency responders immediately.
          </p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          2. Eligibility and Accounts
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            You must provide accurate registration information and keep your
            account credentials secure. You are responsible for all activity
            that occurs under your account.
          </p>
          <p>
            Accounts found to be impersonating others, creating duplicate
            identities, or misusing permissions may be suspended or removed.
          </p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          3. User Content
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            You retain ownership of the content you submit. By posting, you
            grant Bantay PH a non-exclusive license to display and share it
            with authorized personnel for the purpose of review and resolution.
          </p>
          <p>When submitting reports or comments, you agree not to:</p>
          <ul className="list-disc space-y-1.5 pl-5 marker:text-text-secondary/50">
            <li>Submit false, misleading, or duplicate reports.</li>
            <li>
              Post harassment, hate speech, threats, or content that violates
              applicable law.
            </li>
            <li>
              Share sensitive personal data (like IDs or financial details)
              unless strictly necessary for the report.
            </li>
            <li>
              Upload photos that you do not own or do not have permission to
              share.
            </li>
            <li>Impersonate another person, official, or organization.</li>
          </ul>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          4. Location and Photos
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            Reports may include precise location data and photos. This
            information is visible to authorized personnel and, once verified,
            to the public feed. Do not pin locations that reveal sensitive
            private residences without consent.
          </p>
          <p>
            Photos are stored solely to support verification and resolution of
            the issue. Uploading unrelated or graphic imagery is prohibited.
          </p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          5. Moderation and Enforcement
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            We reserve the right to review, edit, hide, or remove any content
            that violates these terms or applicable rules. Repeated violations
            may result in restricted access, temporary suspension, or permanent
            removal of your account.
          </p>
          <p>
            Moderation decisions are made by authorized personnel and are
            logged for accountability.
          </p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          6. Privacy and Data Use
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            We collect only the information needed to operate the service —
            your account details, the reports you submit, and metadata such as
            timestamps and status changes.
          </p>
          <p>
            Your data is not sold to third parties. It may be shared with
            authorized personnel and, for verified reports, with the public
            feed. Audit logs of administrative actions are retained for
            accountability.
          </p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          7. Intellectual Property
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            The Bantay PH name, logo, and platform code are owned by their
            respective holders. You may not copy, modify, or redistribute
            them without permission.
          </p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          8. Disclaimers
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            Bantay PH is provided “as is.” We do not guarantee that every
            report will be reviewed, acted upon, or resolved within a specific
            timeframe. Resolution depends on the relevant local authorities.
          </p>
          <p>
            We are not liable for actions taken or not taken by third parties
            based on information shown in the platform.
          </p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          9. Changes to These Terms
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            We may update these terms as the service evolves. Continued use of
            Bantay PH after changes are posted constitutes acceptance of the
            revised terms.
          </p>
        </div>
      </section>

      <div className="h-px bg-border" />

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-tight text-text-primary">
          10. Contact
        </h3>
        <div className="space-y-2.5 text-sm leading-relaxed text-text-secondary">
          <p>
            For questions about these terms or to report a concern, contact
            your barangay administrator or reach the Bantay PH team through
            the official support channel.
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsContent;