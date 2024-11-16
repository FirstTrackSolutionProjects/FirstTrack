import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy & Policy</h1>

      <p className="mb-4 text-gray-700">
        At <strong>First Track</strong>, we are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your data when you use our services.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
      <p className="mb-4 text-gray-700">
        We may collect personal information from you, such as your name, email address, phone number, and shipping details when you create an account, make a shipment, or contact us for inquiries. This information is necessary for us to provide you with our services.
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
      <p className="mb-4 text-gray-700">
        Your information is used for the following purposes:
        <ul className="list-disc list-inside">
          <li>To process and deliver your shipments</li>
          <li>To provide you with tracking updates</li>
          <li>To communicate with you about our services</li>
          <li>To improve our website and services</li>
          <li>To comply with legal obligations</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. Data Protection</h2>
      <p className="mb-4 text-gray-700">
        We use secure systems and technologies to ensure that your personal information is protected from unauthorized access, use, or disclosure. We follow industry best practices to safeguard your data both online and offline.
      </p>

      <h2 className="text-2xl font-semibold mb-4">4. Sharing of Information</h2>
      <p className="mb-4 text-gray-700">
        We do not sell or share your personal information with third parties, except in cases where it is necessary to fulfill your shipping requests or comply with legal obligations. We may share your information with trusted partners for the purpose of processing shipments and ensuring timely deliveries.
      </p>

      <h2 className="text-2xl font-semibold mb-4">5. Cookies</h2>
      <p className="mb-4 text-gray-700">
        Our website uses cookies to enhance your user experience. Cookies are small files placed on your computer that help us understand how you interact with our website, improve its functionality, and offer personalized content.
      </p>

      <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
      <p className="mb-4 text-gray-700">
        You have the right to access, modify, or delete your personal information at any time. If you wish to exercise these rights, please contact us at <a href="mailto:info@firsttrack.site" className="text-blue-500 hover:underline">info@firsttrack.site</a>.
      </p>

      <h2 className="text-2xl font-semibold mb-4">7. Changes to this Policy</h2>
      <p className="mb-4 text-gray-700">
        We may update this Privacy Policy from time to time to reflect changes in our services or legal requirements. Any updates will be posted on this page, and we encourage you to review the policy periodically.
      </p>

      <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
      <p className="mb-4 text-gray-700">
        If you have any questions or concerns about our Privacy Policy, feel free to contact us at <a href="mailto:info@firsttrack.site" className="text-blue-500 hover:underline">info@firsttrack.site</a>.
      </p>

      <p className="text-gray-700 text-sm mt-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default PrivacyPolicy;
