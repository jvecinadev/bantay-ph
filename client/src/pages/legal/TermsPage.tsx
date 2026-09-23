import LegalLayout from "./LegalLayout";

const TermsPage = () => {
  return (
    <LegalLayout title="Terms and Conditions" lastUpdated="2026-09-23">
      <section className="space-y-2">
        <h2 className="text-base font-semibold">1. About the Service</h2>
        <p className="text-text-secondary">
          Bantay PH allows users to submit community reports (text, location, and photos) for review
          and follow-up by authorized personnel.
        </p>
        <p className="text-text-secondary">
          This is not an emergency service. For immediate danger or emergencies, contact local
          emergency hotlines.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">2. Eligibility and Accounts</h2>
        <p className="text-text-secondary">
          You are responsible for all activity under your account and for keeping your access secure.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">3. User Content (Reports, Photos, Comments)</h2>
        <ul className="list-disc pl-5 text-text-secondary space-y-1">
          <li>Do not submit false, misleading, or malicious reports.</li>
          <li>Do not upload illegal content or content that violates others’ rights.</li>
          <li>Avoid uploading sensitive personal data (faces, IDs, plate numbers) unless necessary.</li>
          <li>Be respectful in comments; harassment and hate speech are prohibited.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">4. Moderation and Enforcement</h2>
        <p className="text-text-secondary">
          We may review, remove, restrict, or moderate content and may suspend or terminate accounts
          that violate these terms or applicable rules.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">5. License to Display Content</h2>
        <p className="text-text-secondary">
          You grant Bantay PH a limited, non-exclusive license to store, display, and process your
          submitted content within the app for operational purposes (e.g., verification, assignment,
          audit/history).
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">6. Disclaimers</h2>
        <p className="text-text-secondary">
          We do not guarantee that reports will be verified, assigned, or resolved. Service
          availability may change without notice.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">7. Contact</h2>
        <p className="text-text-secondary">
          If you have questions about these terms, contact the administrators of your deployment.
        </p>
      </section>
    </LegalLayout>
  );
};

export default TermsPage;