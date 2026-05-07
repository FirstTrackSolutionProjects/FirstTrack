import React from 'react';

const RefundCancellation = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 lg:p-12 font-inter bg-white shadow-xl rounded-2xl my-8"> {/* Enhanced container styling */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-[#1f2937]">Refund & Cancellation Policy</h1> {/* Stronger heading */}

      <p className="mb-6 text-gray-700 leading-relaxed">
        At <strong className="text-[#22c55e]">First Track</strong>, we strive to provide reliable and efficient logistics services. 
        This Refund & Cancellation Policy outlines the conditions under which cancellations, refunds, 
        and compensation may or may not be provided.
      </p>

      <h2 className="text-2xl font-bold mb-5 text-[#1f2937]">1. Cancellation of Shipments</h2> {/* Stronger subheadings */}
      <p className="mb-4 text-gray-700 leading-relaxed">
        You may cancel your shipment request before the shipment has been picked up.  
        Once the pickup is completed, cancellations are no longer allowed.
        <ul className="list-disc list-inside pl-5 mt-3 space-y-2 text-gray-600"> {/* Added padding and spacing */}
          <li>Cancellations must be requested through your dashboard or by contacting customer support.</li>
          <li>Any service charges incurred before cancellation may be non-refundable.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-bold mb-5 text-[#1f2937]">2. Refund Eligibility</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Refunds may be granted under the following conditions:
        <ul className="list-disc list-inside pl-5 mt-3 space-y-2 text-gray-600">
          <li>If a shipment is canceled <em className="font-semibold text-[#22c55e]">*before pickup*</em> is completed.</li> {/* Emphasized text */}
          <li>If there is a duplicate payment or incorrect charge due to a system error.</li>
          <li>If First Track is unable to provide the service due to internal issues or operational limitations.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-bold mb-5 text-[#1f2937]">3. Non-Refundable Cases</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Refunds will not be provided in the following situations:
        <ul className="list-disc list-inside pl-5 mt-3 space-y-2 text-gray-600">
          <li>Shipment is already picked up or in transit.</li>
          <li>Delays caused by customs, weather, strikes, natural disasters, or third-party delays.</li>
          <li>Incorrect information provided by the user (address, contact, package details, etc.).</li>
          <li>Confiscation or restriction by customs or government authorities.</li>
        </ul>
      </p>

      <h2 className="text-2xl font-bold mb-5 text-[#1f2937]">4. Refund Processing Time</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        Approved refunds will be processed within <strong className="text-[#1f2937]">7–10 business days</strong>.  
        Refunds will be credited to the original mode of payment only.
      </p>

      <h2 className="text-2xl font-bold mb-5 text-[#1f2937]">5. Damaged or Lost Shipments</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        In case of damage or loss, compensation may be provided based on:
        <ul className="list-disc list-inside pl-5 mt-3 space-y-2 text-gray-600">
          <li>The declared value of the shipment.</li>
          <li>Supporting documents such as invoices and photos.</li>
          <li>The investigation outcome from logistics partners.</li>
        </ul>
        Compensation is subject to our policies and third-party carrier terms.
      </p>

      <h2 className="text-2xl font-bold mb-5 text-[#1f2937]">6. Changes to Policy</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        First Track reserves the right to update this Refund & Cancellation Policy at any time. 
        Any changes will be reflected on this page and are effective immediately upon posting.
      </p>

      <h2 className="text-2xl font-bold mb-5 text-[#1f2937]">7. Contact Information</h2>
      <p className="mb-4 text-gray-700 leading-relaxed">
        For refund or cancellation requests, please contact us at  
        <a href="mailto:info@firsttrack.site" className="text-blue-500 hover:underline transition-colors duration-200">
          info@firsttrack.site
        </a>.
      </p>

      <p className="text-gray-500 text-sm mt-8 text-right"> {/* Moved to right and adjusted color */}
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} {/* Enhanced date format */}
      </p>
    </div>
  );
};

export default RefundCancellation;
