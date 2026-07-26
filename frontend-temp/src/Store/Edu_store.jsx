import * as icon from "react-icons/fa";

// % % % % % % *EDUCTION PAGE* % % % % % %

// ========================================
// EDUCATION HOME - Schools , colleges & Uni
// ========================================
export const categories = [
    {
        title: "Schools",
        link: "schools",
        description:
            "Discover top-rated schools with detailed information about curriculum, facilities, faculty, and admission process to help parents choose with confidence.",
        btn: "View Schools"
    },
    {
        title: "Colleges",
        link: "colleges",
        description:
            "Compare leading colleges, explore academic programs, and review campus life insights to find the right path for higher education.",
        btn: "Explore Colleges"
    },
    {
        title: "Online Courses",
        link: "onlineCourses",
        description:
            "Browse flexible online programs and skill-based certifications designed to empower students with modern, career-ready knowledge.",
        btn: "Browse Courses"
    },
];


// &&&&&&&&&&&& *ONLINE COURSES DATA* &&&&&&&&&&&& \\

/* ================================
   ONLINE COURSES List & Links
================================ */
export const OnlineCourses = [
    { CourseName: "Full Stack Web Development", id: 1 },
    { CourseName: "Data Science & Machine Learning", id: 2 },
    { CourseName: "UI/UX Design Fundamentals", id: 3 },
    { CourseName: "Digital Marketing Masterclass", id: 4 },
    { CourseName: "Python Programming for Beginners", id: 5 },
    { CourseName: "Cybersecurity Essentials", id: 6 },
    { CourseName: "Artificial Intelligence & Deep Learning", id: 7 }
];

// ========================================
// ONLINE COURSES CARD DATA
// ========================================
export const OnlineCourseCardDta = [
    { img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", InstName: "Full Stack Web Development", Desc: "Learn front-end & back-end development to become a full stack developer.", id: "1", btn_txt: "Enroll Now" },
    { img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", InstName: "Data Science & Machine Learning", Desc: "Master data analysis, statistics, and machine learning algorithms.", id: "2", btn_txt: "Enroll Now" },
    { img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", InstName: "UI/UX Design Fundamentals", Desc: "Design beautiful and user-friendly interfaces for web and mobile apps.", id: "3", btn_txt: "Enroll Now" },
    { img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", InstName: "Digital Marketing Masterclass", Desc: "Learn SEO, social media marketing, and advertising strategies.", id: "4", btn_txt: "Enroll Now" },
    { img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", InstName: "Python Programming for Beginners", Desc: "Start coding in Python and build real-world applications.", id: "5", btn_txt: "Enroll Now" },
    { img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", InstName: "Cybersecurity Essentials", Desc: "Learn how to secure systems, networks, and protect data online.", id: "6", btn_txt: "Enroll Now" },
    { img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg", InstName: "Artificial Intelligence & Deep Learning", Desc: "Explore AI concepts, neural networks, and deep learning models.", id: "7", btn_txt: "Enroll Now" }
];

// ========================================
// ONLINE COURSES DETAILS ARRAY
// ========================================
export const OnlineCourses_Details = [
    { id: 1, Title: "Full Stack Web Development", tag_line: "“Build Complete Web Applications”", A_UsPara: "This course provides comprehensive training on both front-end and back-end web development using modern technologies.", Course_Info: [{ Duration: "6 Months", Mode: "Online", Skill_Level: "Beginner to Advanced", Languages: "HTML, CSS, JavaScript, Node.js, React" }], Facilities: ["Interactive Coding Labs", "Project-Based Learning", "Mentor Support", "Certificates"], Achievements: ["Build Portfolio Projects", "Deploy Real Applications", "Job Assistance"], Contact_Info: [{ Email: "info@fullstackcourses.com", Phone: "+92 300 1234567", website: "www.fullstackcourses.com" }] },
    { id: 2, Title: "Data Science & Machine Learning", tag_line: "“Analyze Data & Build Models”", A_UsPara: "Learn Python, data analysis, visualization, and machine learning to become a data science expert.", Course_Info: [{ Duration: "5 Months", Mode: "Online", Skill_Level: "Intermediate", Languages: "Python, R, SQL" }], Facilities: ["Hands-on Projects", "Jupyter Notebook Labs", "Mentor Guidance"], Achievements: ["Data Analysis Projects", "Predictive Models", "Industry-Ready Skills"], Contact_Info: [{ Email: "info@datasciencecourses.com", Phone: "+92 301 9876543", website: "www.datasciencecourses.com" }] },
    { id: 3, Title: "UI/UX Design Fundamentals", tag_line: "“Design Engaging Interfaces”", A_UsPara: "Focus on creating intuitive and appealing user interfaces with UX principles and design tools.", Course_Info: [{ Duration: "3 Months", Mode: "Online", Skill_Level: "Beginner", Tools: "Figma, Adobe XD, Sketch" }], Facilities: ["Design Labs", "Portfolio Projects", "Expert Mentorship"], Achievements: ["UI/UX Projects", "Portfolio Ready", "Design Certifications"], Contact_Info: [{ Email: "info@uxdesigncourses.com", Phone: "+92 302 5556677", website: "www.uxdesigncourses.com" }] },
    { id: 4, Title: "Digital Marketing Masterclass", tag_line: "“Grow Your Online Presence”", A_UsPara: "Learn all aspects of digital marketing including SEO, SEM, email campaigns, and social media strategies.", Course_Info: [{ Duration: "4 Months", Mode: "Online", Skill_Level: "Beginner to Intermediate" }], Facilities: ["Practical Assignments", "Real Campaigns", "Mentor Support"], Achievements: ["Marketing Portfolio", "Certifications", "Hands-on Campaign Experience"], Contact_Info: [{ Email: "info@digitalmarketing.com", Phone: "+92 303 1122334", website: "www.digitalmarketing.com" }] },
    { id: 5, Title: "Python Programming for Beginners", tag_line: "“Start Coding Today”", A_UsPara: "Learn Python from scratch and build practical applications, scripts, and projects.", Course_Info: [{ Duration: "2 Months", Mode: "Online", Skill_Level: "Beginner", Languages: "Python" }], Facilities: ["Coding Exercises", "Project Guidance", "Mentor Support"], Achievements: ["Mini Projects", "Practical Python Skills", "Completion Certificate"], Contact_Info: [{ Email: "info@pythoncourses.com", Phone: "+92 304 4455667", website: "www.pythoncourses.com" }] },
    { id: 6, Title: "Cybersecurity Essentials", tag_line: "“Protect Systems & Data”", A_UsPara: "Understand network security, system vulnerabilities, and data protection techniques in this essential course.", Course_Info: [{ Duration: "3 Months", Mode: "Online", Skill_Level: "Beginner to Intermediate" }], Facilities: ["Virtual Labs", "Simulated Hacking Scenarios", "Mentor Guidance"], Achievements: ["Security Projects", "Hands-on Experience", "Certification Provided"], Contact_Info: [{ Email: "info@cybersecurity.com", Phone: "+92 305 7788990", website: "www.cybersecurity.com" }] },
    { id: 7, Title: "Artificial Intelligence & Deep Learning", tag_line: "“Master AI Concepts”", A_UsPara: "Dive into AI fundamentals, neural networks, and deep learning frameworks to build intelligent applications.", Course_Info: [{ Duration: "6 Months", Mode: "Online", Skill_Level: "Advanced", Tools: "Python, TensorFlow, PyTorch" }], Facilities: ["Lab Projects", "AI Challenges", "Mentor Support"], Achievements: ["AI Projects", "Deep Learning Models", "Industry Ready"], Contact_Info: [{ Email: "info@aicourses.com", Phone: "+92 306 9988776", website: "www.aicourses.com" }] }
];