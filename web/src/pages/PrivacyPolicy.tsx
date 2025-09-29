import React from "react";

const PrivacyPolicy: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Arial, sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  };

  const headingStyle: React.CSSProperties = {
    textAlign: "center",
    fontSize: "1.5rem",
    marginBottom: "20px",
  };

  const paragraphStyle: React.CSSProperties = {
    marginBottom: "15px",
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: "underline",
    color: "blue",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Privacy Policy</h2>
      <p style={paragraphStyle}>
        We highly value your privacy and strive to ensure that your personal
        information is handled securely and responsibly. This Privacy Policy
        outlines how we collect, use, and protect your data when you use our
        mobile application.
      </p>

      <h3 style={headingStyle}>Information Collection and Use</h3>
      <p style={paragraphStyle}>
        We do not collect any personally identifiable information (such as name
        and email, etc.) from users unless voluntarily provided. The information
        collected will only be used for authentication and will never be shared.
      </p>

      <h3 style={headingStyle}>Data Security</h3>
      <p style={paragraphStyle}>
        We are committed to safeguarding the confidentiality of your
        information. We implement reasonable security measures to protect
        against unauthorized access, alteration, disclosure, or destruction of
        data.
      </p>

      <h3 style={headingStyle}>Third-Party Services</h3>
      <p style={paragraphStyle}>
        Our app does not integrate with third-party services.
      </p>

      <h3 style={headingStyle}>Changes to This Privacy Policy</h3>
      <p style={paragraphStyle}>
        We reserve the right to update our Privacy Policy from time to time. Any
        changes will be reflected on this page. We encourage you to review this
        Privacy Policy periodically for any updates.
      </p>

      <h3 style={headingStyle}>Contact Us</h3>
      <p style={paragraphStyle}>
        If you have any questions or concerns regarding this Privacy Policy or
        the handling of your data, please contact us at{" "}
        <a href="mailto:app.educado@gmail.com" style={linkStyle}>
          app.educado@gmail.com
        </a>
        .
      </p>

      <p style={paragraphStyle}>
        This Privacy Policy was last updated on 26/11/23.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
