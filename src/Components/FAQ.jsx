import React, { useState } from 'react';

const faqData = [
  {
    question: "What services does First Track Express offer?",
    answer: "We provide fast and reliable logistics, shipping, and door-to-door delivery services for both local and international shipments."
  },
  {
    question: "How can I track my shipment?",
    answer: "You can track your shipment using our online tracking system by entering your tracking number on our website."
  },
  {
    question: "What is the estimated delivery time for local and international shipments?",
    answer: "Local shipments usually take 1-3 business days, while international deliveries vary depending on the destination, typically between 5-7 business days."
  },
  {
    question: "How do I schedule a shipment?",
    answer: "You can schedule a shipment through our online booking platform or by contacting our customer support team."
  },
  {
    question: "What are your shipping rates?",
    answer: "Our rates depend on the size, weight, and destination of the shipment. Use our rate calculator online for detailed pricing."
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);  // Collapse the active one
    } else {
      setActiveIndex(index); // Expand the selected one
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-xl md:text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>

      {faqData.map((faq, index) => (
        <div key={index} className="mb-4">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full text-left p-4 bg-gray-200 hover:bg-gray-300 rounded-lg focus:outline-none  transition duration-300 ease-in-out"
          >
            <div className="flex justify-between items-center">
              <span className="text-base md:text-lg font-semibold">{faq.question}</span>
              <span className="text-2xl">{activeIndex === index ? '-' : '+'}</span>
            </div>
          </button>
          {activeIndex === index && (
            <div className="p-4 bg-white border-l-4 border-blue-800">
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQ;
