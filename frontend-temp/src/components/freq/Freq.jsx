
import React, { useState } from "react";
import "./Freq.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const sfreqData = [
  {
    question: "What is Digital Smart Cities Hub?",
    answer:
      "Digital Smart Cities Hub is a platform designed to digitalize small cities by providing online fee systems for schools, hospital management systems, online appointments, and more.",
  },
  {
    question: "How can I pay my school fees online?",
    answer:
      "You can pay your school fees securely via our platform using multiple payment options such as debit/credit cards, mobile banking, and online wallets.",
  },
  {
    question: "Can I book a hospital appointment online?",
    answer:
      "Yes! You can view available doctors, choose a suitable time, and book your appointment online through our system.",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "Absolutely. We use secure encryption and adhere to privacy standards to protect all your personal and payment information.",
  },
  {
    question: "Do you provide support for technical issues?",
    answer:
      "Yes, our support team is available 24/7 to assist with any technical problems or queries you may have.",
  },
];

const Freq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="sfaq-section">
      <h2 className="sfaq-title">Frequently Asked Questions</h2>

      <div className="sfaq-container">
        {sfreqData.map((item, index) => (
          <div
            key={index}
            className={`sf+aq-card ${activeIndex === index ? "active" : ""}`}
          >
            {/* Question Box */}
            <div className="sfaq-question" onClick={() => toggleFAQ(index)}>
              <span>{item.question}</span>
              <span className="sfaq-icon">
                {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </div>

            {/* Answer */}
            <div
              className="sfaq-answer"
              style={{
                maxHeight: activeIndex === index ? "240px" : "0",
              }}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Freq;
