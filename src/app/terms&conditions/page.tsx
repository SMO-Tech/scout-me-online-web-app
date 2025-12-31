import React from 'react';

const TermsOfService = () => {
  const sections = [
    { title: "1. Agreement", content: "If you’re using the Scout Me Online (www.scoutme.cloud) services, you’re entering into a legal agreement automatically..." },
    { title: "2. Eligibility", content: "You must be at least the “minimum age”... a) 14 years old in Australia, Canada, Germany... b) 16 years old in Netherlands..." },
    { title: "3. Membership", content: "You agree to not share your password with anyone and you keep it confidential..." },
    { title: "4. Payment", content: "Scout Me Online is a free tool however, to get access to additional features, there is a cost involved with a subscription plan..." },
    { title: "5. Notices and Service Messages", content: "You agree that Scout Me Online will provide notices on any changes and updates by using our websites and email..." },
    { title: "6. Messages and Sharing", content: "Others can see, copy and use the information you share... Scout Me Online recommends not to upload information you wish to keep private..." },
    { title: "7. Your License to Scout Me Online", content: "You own the content you post, but you grant Scout Me Online a non-exclusive, worldwide, transferable license to use it..." },
    { title: "8. Service Availability", content: "We may change or discontinue any content of our platforms and are not obligated to store information indefinitely." },
    { title: "9. Other members, Content, and Third Parties", content: "You use others' information at your own risk. Scout Me Online does not endorse content posted by members." },
    { title: "10. Limits", content: "Scout Me Online reserves all intellectual property rights and may restrict or terminate accounts for misuse." },
    { title: "11. Disclaimer and Limit of Liability", content: "THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND." },
    { title: "12. Exclusion of Liability", content: "TO THE EXTENT PERMITTED BY LAW, SCOUT ME ONLINE SHALL NOT BE LIABLE FOR INDIRECT OR CONSEQUENTIAL DAMAGES." },
    { title: "13. Termination", content: "Both you and Scout Me Online can terminate this agreement at any time. Certain data may remain to maintain team analysis integrity." },
    { title: "14. Dispute", content: "Legal disputes will take place in England and Wales, applying English law." },
    { title: "15. General Terms", content: "This is the only agreement between us regarding the Services and supersedes all prior agreements." },
    { title: "16. You agree that you will:", content: "Commit to our terms, provide accurate information, and use the services in a professional manner." },
    { title: "17. You agree that you will not:", content: "Act dishonestly, create false profiles, send spam, or violate intellectual property rights." },
    { title: "18. Complaints Regarding Content", content: "We provide a policy and process for complaints concerning content posted by our Members." },
    { title: "19. Contact for dispute or any legal matter", content: "Please email to legal@scoutmeonline.com." },
    { title: "20. Stats Analysis Service", content: "By sending us match video, you authorize the creation of player profiles and understand stats will be visible for analysis." }
  ];

  return (
    <div style={{ backgroundColor: '#121212', color: '#e0e0e0', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif', lineHeight: '1.6' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#1e1e1e', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        
        <header style={{ borderBottom: '1px solid #333', marginBottom: '30px', paddingBottom: '20px' }}>
          <h1 style={{ color: '#ffffff', fontSize: '2.5rem', margin: '0 0 10px 0' }}>User Agreement</h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Last Updated: October 2023</p>
        </header>

        <section style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '1.1rem', color: '#bbb' }}>
            Welcome to Scout Me Online. Please read these terms carefully as they govern your use of our platform and services.
          </p>
        </section>

        {sections.map((section, index) => (
          <div key={index} style={{ marginBottom: '40px', borderLeft: '3px solid #444', paddingLeft: '20px' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.4rem', marginBottom: '15px' }}>{section.title}</h2>
            <div style={{ color: '#cccccc', whiteSpace: 'pre-wrap', fontSize: '1rem' }}>
              {section.content}
            </div>
          </div>
        ))}

        <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #333', textAlign: 'center', color: '#666' }}>
          <p>&copy; {new Date().getFullYear()} Scout Me Online Ltd. All rights reserved.</p>
          <p>For inquiries: admin@scoutmeonline.com</p>
        </footer>
      </div>
    </div>
  );


  
};

export default TermsOfService;