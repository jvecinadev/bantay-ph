import LegalLayout from "./LegalLayout";

const PrivacyPage = () => {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="2026-09-23">
      <section className="space-y-2">
        <h2 className="text-base font-semibold">1. Information We Collect</h2>
        <ul className="list-disc pl-5 text-text-secondary space-y-1">
          <li>Account info (e.g., name)</li>
          <li>Reports you submit (title, description, category)</li>
          <li>Location data you provide (latitude/longitude)</li>
          <li>Uploaded photos (stored via a third-party provider, if configured)</li>
          <li>Comments and moderation/verification history</li>
          <li>Technical logs (e.g., request metadata for security/audit)</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">2. How We Use Information</h2>
        <ul className="list-disc pl-5 text-text-secondary space-y-1">
          <li>To create, review, verify, and manage reports</li>
          <li>To prevent abuse and maintain security</li>
          <li>To provide audit logs and history tracking for accountability</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">3. Sharing and Access</h2>
        <p className="text-text-secondary">
          Access to your report data may be available to authorized roles (e.g., validators, staff,
          admins) for operational purposes. We do not sell your personal data.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">4. Third Parties</h2>
        <p className="text-text-secondary">
          Photos may be stored/served by a media provider (e.g., Cloudinary). Map tiles may be loaded
          from external map providers (e.g., OpenStreetMap tile servers). These providers may process
          basic request data to deliver content.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">5. Cookies / Sessions</h2>
        <p className="text-text-secondary">
          We use cookies for authentication sessions (cookie-based login). This is required for the
          app to function.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-semibold">6. Data Retention and Deletion</h2>
        <p className="text-text-secondary">
          We retain reports, photos, and history as needed for operations and accountability. You may
          request deletion depending on your deployment’s policy and legal requirements.
        </p>
      </section>
    </LegalLayout>
  );
};

export default PrivacyPage;