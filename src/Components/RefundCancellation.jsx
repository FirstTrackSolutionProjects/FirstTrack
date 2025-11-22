import React from 'react';

const RefundCancellation = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Refund & Cancellation Policy</h1>

      <p className="mb-4 text-gray-700">
        At <strong>First Track</strong>, we strive to provide reliable and efficient logistics services. 
        This Refund & Cancellation Policy outlines the conditions under which cancellations, refunds, 
        and compensation may or may not be provided.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Cancellation of Shipments</h2>
      <p className="mb-4 text-gray-700">
        You may cancel your shipment request before the shipment has been picked up.  
        Once the pickup is completed, cancellations are no longer allowed.
        <ul className="list-disc list-inside">
          <li>Cancellations must be requested through your dashboard or by contacting customer support.</li>
          <li>Any service charges incurred before cancellation may be non-refundable.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
      <p className="mb-4 text-gray-700">
        Refunds may be granted under the following conditions:
        <ul className="list-disc list-inside">
          <li>If a shipment is canceled *before pickup* is completed.</li>
          <li>If there is a duplicate payment or incorrect charge due to a system error.</li>
          <li>If First Track is unable to provide the service due to internal issues or operational limitations.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. Non-Refundable Cases</h2>
      <p className="mb-4 text-gray-700">
        Refunds will not be provided in the following situations:
        <ul className="list-disc list-inside">
          <li>Shipment is already picked up or in transit.</li>
          <li>Delays caused by customs, weather, strikes, natural disasters, or third-party delays.</li>
          <li>Incorrect information provided by the user (address, contact, package details, etc.).</li>
          <li>Confiscation or restriction by customs or government authorities.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-semibold mb-4">4. Refund Processing Time</h2>
      <p className="mb-4 text-gray-700">
        Approved refunds will be processed within <strong>7–10 business days</strong>.  
        Refunds will be credited to the original mode of payment only.
      </p>

      <h2 className="text-2xl font-semibold mb-4">5. Damaged or Lost Shipments</h2>
      <p className="mb-4 text-gray-700">
        In case of damage or loss, compensation may be provided based on:
        <ul className="list-disc list-inside">
          <li>The declared value of the shipment.</li>
          <li>Supporting documents such as invoices and photos.</li>
          <li>The investigation outcome from logistics partners.</li>
        </ul>
        Compensation is subject to our policies and third-party carrier terms.
      </p>

      <h2 className="text-2xl font-semibold mb-4">6. Changes to Policy</h2>
      <p className="mb-4 text-gray-700">
        First Track reserves the right to update this Refund & Cancellation Policy at any time. 
        Any changes will be reflected on this page and are effective immediately upon posting.
      </p>

      <h2 className="text-2xl font-semibold mb-4">7. Contact Information</h2>
      <p className="mb-4 text-gray-700">
        For refund or cancellation requests, please contact us at  
        <a href="mailto:info@firsttrack.site" className="text-blue-500 hover:underline">
          info@firsttrack.site
        </a>.
      </p>

      <p className="text-gray-700 text-sm mt-6">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};

export default RefundCancellation;
