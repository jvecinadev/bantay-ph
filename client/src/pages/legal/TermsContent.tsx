const TermsContent = () => {
  return (
    <div className="space-y-5">
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">1. About the Service</h3>
        <p>
          Bantay PH allows users to submit community reports (text, location, and photos) for review
          and follow-up by authorized personnel.
        </p>
        <p>Not an emergency service. For emergencies, contact local hotlines.</p>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">2. User Content</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>No false or misleading reports.</li>
          <li>No harassment, hate speech, or illegal content.</li>
          <li>Avoid sensitive personal data unless necessary.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-text-primary">3. Moderation</h3>
        <p>
          We may remove content or restrict accounts that violate these terms or applicable rules.
        </p>
      </section>
    </div>
  );
};

export default TermsContent;