import { getRecommendedSectionOrder } from "./cv-profile";
import { defaultCoverLetter } from "./cover-letter";
import { createId } from "./default-data";
import { DEFAULT_TYPOGRAPHY } from "./typography";
import type { CvProfile, ResumeState } from "./types";

function baseConfigEn(profile: CvProfile): ResumeState["config"] {
  return {
    language: "en",
    exportMode: "modern",
    cvProfile: profile,
    template: profile === "student" ? "academic" : "elegant",
    colorTheme: "slate",
    showPhoto: false,
    ...DEFAULT_TYPOGRAPHY,
    sectionOrder: getRecommendedSectionOrder(profile),
  };
}

export const sampleProfessionalStateEn: ResumeState = {
  data: {
    personal: {
      fullName: "Alex Morgan",
      title: "Software Engineer",
      email: "alex.morgan@email.com",
      phone: "+1 555-0100",
      location: "Jakarta, Indonesia",
      website: "alexmorgan.dev",
      linkedin: "linkedin.com/in/alex-morgan",
      github: "github.com/alexmorgan",
      summary:
        "Software Engineer with 5+ years of experience building production web applications for 50,000+ active users. Skilled in React, TypeScript, Node.js, PostgreSQL, and REST API design. Led a squad of 5 engineers and improved system performance by 35%. Seeking a full-time role on a product team where quality and user impact matter.",
      photo: "",
    },
    experiences: [
      {
        id: createId(),
        company: "Acme Digital",
        position: "Software Engineer",
        location: "Jakarta",
        startDate: "Jan 2022",
        endDate: "",
        current: true,
        description: "",
        highlights: [
          "Designed a checkout module handling 12,000+ monthly transactions with an error rate below 0.1%",
          "Improved homepage load time by 35% (2.8s → 1.8s) through code splitting and database query optimization",
          "Led a squad of 5 engineers delivering 4 major features per quarter against the product roadmap",
          "Raised payment module test coverage from 45% to 82% with unit tests and API documentation",
          "Ran A/B tests on 3 onboarding variants with UX, increasing registration conversion by 18%",
        ],
      },
      {
        id: createId(),
        company: "Startup Labs",
        position: "Junior Developer",
        location: "Bandung",
        startDate: "Mar 2019",
        endDate: "Dec 2021",
        current: false,
        description: "",
        highlights: [
          "Helped build an MVP from scratch to 2,000 beta users in 6 months",
          "Developed 8 REST API endpoints and a payment gateway integration for daily transactions",
          "Wrote 40+ unit tests for the payment module, reducing production bugs by 30%",
          "Set up a lightweight CI/CD pipeline, cutting deploy time from 2 hours to 20 minutes",
        ],
      },
    ],
    educations: [
      {
        id: createId(),
        institution: "Example University",
        degree: "B.S.",
        field: "Computer Science",
        location: "Bandung",
        startDate: "2015",
        endDate: "2019",
        gpa: "3.70",
        highlights: [],
      },
    ],
    organizations: [
      {
        id: createId(),
        name: "Computer Science Student Association",
        role: "Events Lead",
        location: "Bandung",
        startDate: "2017",
        endDate: "2018",
        current: false,
        highlights: [
          "Coordinated 3 campus events with 200+ attendees",
          "Managed a team of 12 volunteers",
        ],
      },
    ],
    skillGroups: [
      {
        id: createId(),
        name: "Frameworks",
        skills: ["React", "Next.js", "Node.js", "TypeScript"],
      },
      {
        id: createId(),
        name: "Tools",
        skills: ["PostgreSQL", "Git"],
      },
      {
        id: createId(),
        name: "Soft Skills",
        skills: ["Communication", "Problem solving", "Teamwork"],
      },
    ],
    technicalSkills: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Git",
    ],
    softSkills: ["Communication", "Problem solving", "Teamwork"],
    projects: [
      {
        id: createId(),
        name: "Portfolio Website",
        url: "github.com/alexmorgan/portfolio",
        description: "Personal portfolio with blog and project showcase",
        technologies: ["Next.js", "Tailwind CSS"],
      },
    ],
    certifications: [
      {
        id: createId(),
        name: "Web Development Certificate",
        issuer: "Online Academy",
        date: "2023",
        url: "",
      },
    ],
    languages: [
      { id: createId(), name: "Indonesian", level: "native" },
      { id: createId(), name: "English", level: "professional" },
    ],
    customSections: [],
  },
  config: baseConfigEn("professional"),
  coverLetter: {
    ...defaultCoverLetter("en"),
    bodyCustom: false,
    company: "Acme Digital",
    position: "Software Engineer",
    body: "",
  },
};

export const sampleInternshipStateEn: ResumeState = {
  data: {
    personal: {
      fullName: "Sari Putri",
      title: "Computer Science Undergraduate",
      email: "sari.putri@email.com",
      phone: "+62 813-0000-0000",
      location: "Bandung, Indonesia",
      website: "",
      linkedin: "linkedin.com/in/sari-putri",
      github: "github.com/sariputri",
      summary:
        "6th-semester Computer Science student (GPA 3.65) with a 3-month frontend internship at a tech startup. Comfortable with React, JavaScript, HTML/CSS, Git, Figma, and agile workflows. Active in the programming club and led a basic web workshop for 40 participants. Seeking a web development internship to grow on real products.",
      photo: "",
    },
    experiences: [
      {
        id: createId(),
        company: "Tech Startup Nusantara",
        position: "Frontend Intern",
        location: "Bandung",
        startDate: "Jun 2025",
        endDate: "Aug 2025",
        current: false,
        description: "",
        highlights: [
          "Helped ship 2 admin dashboard features used daily by 40+ operations staff",
          "Fixed 18 UI bugs in React components and aligned designs with the internal design system",
          "Wrote 25+ unit tests for form and table components, reducing release regressions",
          "Joined daily stand-ups, sprint planning, and code reviews for 3 months",
          "Interviewed 8 internal users; findings informed monthly report flow improvements",
        ],
      },
    ],
    educations: [
      {
        id: createId(),
        institution: "Example University",
        degree: "B.S. Computer Science",
        field: "Computer Science",
        location: "Bandung",
        startDate: "2022",
        endDate: "2026 (expected)",
        gpa: "3.65",
        highlights: [],
      },
    ],
    organizations: [
      {
        id: createId(),
        name: "Programming Club",
        role: "Web Division Member",
        location: "Bandung",
        startDate: "2023",
        endDate: "",
        current: true,
        highlights: [
          "Hosted an HTML/CSS workshop for 40 participants",
          "Built the club profile website",
        ],
      },
    ],
    skillGroups: [
      {
        id: createId(),
        name: "Web Development",
        skills: ["HTML", "CSS", "JavaScript", "React"],
      },
      {
        id: createId(),
        name: "Tools",
        skills: ["Git", "Figma", "VS Code"],
      },
      {
        id: createId(),
        name: "Soft Skills",
        skills: ["Teamwork", "Communication", "Fast learner"],
      },
    ],
    technicalSkills: ["HTML", "CSS", "JavaScript", "React", "Git", "Figma", "VS Code"],
    softSkills: ["Teamwork", "Communication", "Fast learner"],
    projects: [
      {
        id: createId(),
        name: "Campus Task Manager",
        url: "github.com/sariputri/task-app",
        description: "Final project for Web Programming course",
        technologies: ["React", "Firebase"],
      },
    ],
    certifications: [],
    languages: [
      { id: createId(), name: "Indonesian", level: "native" },
      { id: createId(), name: "English", level: "intermediate" },
    ],
    customSections: [],
  },
  config: baseConfigEn("internship"),
  coverLetter: {
    ...defaultCoverLetter("en"),
    bodyCustom: false,
    company: "Tech Startup Nusantara",
    position: "Frontend Intern",
    body: "",
  },
};

export const sampleStudentStateEn: ResumeState = {
  data: {
    personal: {
      fullName: "Budi Santoso",
      title: "Grade 12 STEM Student",
      email: "budi.santoso@email.com",
      phone: "+62 857-0000-0000",
      location: "Surabaya, Indonesia",
      website: "",
      linkedin: "",
      github: "github.com/budisantoso",
      summary:
        "Grade 12 STEM student interested in technology, digital design, and robotics. Active in the student council IT division and robotics club; experienced with social media content, visual design, and simple event websites. Strong teamwork and presentation skills. Looking for an IT internship or part-time opportunity before college.",
      photo: "",
    },
    experiences: [
      {
        id: createId(),
        company: "Local Computer Shop",
        position: "Part-time Helper",
        location: "Surabaya",
        startDate: "Jul 2024",
        endDate: "Dec 2024",
        current: false,
        description: "",
        highlights: [
          "Assisted with OS installs, data backup, and basic troubleshooting for 10+ customers per day",
          "Created a repair checklist that sped up diagnostics by about 20%",
          "Practiced professional customer communication and complaint handling",
        ],
      },
    ],
    educations: [
      {
        id: createId(),
        institution: "Example Public High School",
        degree: "High School",
        field: "STEM",
        location: "Surabaya",
        startDate: "2022",
        endDate: "2026 (expected)",
        gpa: "88/100",
        highlights: [],
      },
    ],
    organizations: [
      {
        id: createId(),
        name: "Student Council IT Division",
        role: "Member",
        location: "Surabaya",
        startDate: "2024",
        endDate: "",
        current: true,
        highlights: [
          "Managed council social media (8 posts/week); engagement rose 60% in 6 months",
          "Designed 8 digital posters and 3 short promo videos for 5 school events (300+ attendees)",
          "Coordinated a 4-person team for event documentation and publishing",
        ],
      },
      {
        id: createId(),
        name: "Robotics Club",
        role: "Team Member",
        location: "Surabaya",
        startDate: "2023",
        endDate: "",
        current: true,
        highlights: [
          "2nd place in city-level robotics competition with a 4-person team",
          "Built and programmed an autonomous line-following robot",
        ],
      },
    ],
    skillGroups: [
      {
        id: createId(),
        name: "Digital",
        skills: ["Canva", "Basic HTML/CSS", "Social media"],
      },
      {
        id: createId(),
        name: "Soft Skills",
        skills: ["Teamwork", "Presentation", "Fast learner"],
      },
    ],
    technicalSkills: ["Canva", "Basic HTML/CSS", "Social media"],
    softSkills: ["Teamwork", "Presentation", "Fast learner"],
    projects: [
      {
        id: createId(),
        name: "School Event Landing Page",
        url: "github.com/budisantoso/school-fair",
        description: "Simple website for the annual school fair",
        technologies: ["HTML", "CSS"],
      },
    ],
    certifications: [],
    languages: [
      { id: createId(), name: "Indonesian", level: "native" },
      { id: createId(), name: "English", level: "intermediate" },
    ],
    customSections: [],
  },
  config: baseConfigEn("student"),
  coverLetter: {
    ...defaultCoverLetter("en"),
    bodyCustom: false,
    company: "Example Company",
    position: "High School Internship Program",
    body: "",
  },
};

export const samplesEn: Record<CvProfile, ResumeState> = {
  professional: sampleProfessionalStateEn,
  internship: sampleInternshipStateEn,
  student: sampleStudentStateEn,
};