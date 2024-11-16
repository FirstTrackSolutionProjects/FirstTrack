import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Use</h1>

      <p className="mb-4 text-gray-700">
        Welcome to <strong>First Track</strong>. By accessing or using our website and services, you agree to comply with and be bound by the following Terms of Use. Please review these terms carefully, as they govern your use of our platform.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
      <p className="mb-4 text-gray-700">
        By using our services, you agree to these Terms of Use in full. If you do not accept any part of these terms, you must discontinue the use of our website and services.
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. Services Provided</h2>
      <p className="mb-4 text-gray-700">
        First Track provides logistics and shipping services, including but not limited to door-to-door delivery, shipment tracking, and global shipping solutions. The terms outlined here apply to all users of our services, including visitors, registered users, and customers.
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
      <p className="mb-4 text-gray-700">
        As a user of our services, you agree to:
        <ul className="list-disc list-inside">
          <li>Provide accurate and complete information when booking shipments or creating an account.</li>
          <li>Comply with all applicable laws, regulations, and our policies when using our services.</li>
          <li>Not engage in any activity that disrupts or interferes with our services, including tampering with the website or systems.</li>
          <li>Be responsible for safeguarding your account login details and any actions taken under your account.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">4. Prohibited Activities</h2>
      <p className="mb-4 text-gray-700">
        Users are prohibited from:
        <ul className="list-disc list-inside">
          <li>Using our services for any unlawful purposes, including the shipment of illegal or hazardous goods.</li>
          <li>Attempting to gain unauthorized access to our systems or user accounts.</li>
          <li>Impersonating another user or entity.</li>
          <li>Sending fraudulent, misleading, or harmful shipments through our services.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
      <p className="mb-4 text-gray-700">
        First Track will not be held liable for any indirect, incidental, or consequential damages arising out of the use of our services. While we strive to ensure timely and safe deliveries, delays or issues caused by third parties, natural disasters, or other unforeseen circumstances are beyond our control.
      </p>

      <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
      <p className="mb-4 text-gray-700">
        All content on our website, including text, graphics, logos, and images, is the intellectual property of First Track. You may not copy, reproduce, distribute, or create derivative works from any content without our written permission.
      </p>

      <h2 className="text-2xl font-semibold mb-4">7. Termination of Use</h2>
      <p className="mb-4 text-gray-700">
        First Track reserves the right to terminate or suspend your access to our services at any time, without notice, if we determine that you have violated these Terms of Use or engaged in unlawful or harmful behavior.
      </p>

      <h2 className="text-2xl font-semibold mb-4">8. Changes to Terms</h2>
      <p className="mb-4 text-gray-700">
        We may update these Terms of Use from time to time to reflect changes in our services or applicable laws. Any updates will be posted on this page, and it is your responsibility to review the terms periodically.
      </p>

      <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
      <p className="mb-4 text-gray-700">
        These Terms of Use are governed by and construed in accordance with the laws of the jurisdiction in which First Track operates. Any disputes arising from the use of our services will be resolved in the courts of that jurisdiction.
      </p>

      <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
      <p className="mb-4 text-gray-700">
        If you have any questions about these Terms of Use, please contact us at <a href="mailto:info@firsttrack.site" className="text-blue-500 hover:underline">info@firsttrack.site</a>.
      </p>

      <p className="text-gray-700 text-sm mt-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default Terms;
