const PrivacyContent = () => {
  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">1. Data We Collect</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Account info (e.g., name, email)</li>
          <li>Report details (title, description, category)</li>
          <li>Location you provide (latitude/longitude)</li>
          <li>Uploaded photos</li>
          <li>Comments and audit/history records</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">2. How We Use It</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>To verify and manage reports</li>
          <li>To prevent abuse and secure the platform</li>
          <li>To support accountability via history/audit</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">3. Third Parties</h3>
        <p>
          Photos may be stored/served by a media provider (e.g., Cloudinary). Map tiles may be loaded
          from third-party map services.
        </p>
      </section>
    </div>
  );
};

export default PrivacyContent;