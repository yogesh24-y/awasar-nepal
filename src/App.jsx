import { useState, useEffect } from "react";
import "./index.css";
import { supabase } from "./supabase";
import logo from "./assets/IMG-20260903-WA0000.jpg";

const categories = [
  {
    icon: "🎓",
    title: "Scholarships",
    type: "SCHOLARSHIP",
    text: "Find scholarships & funding",
  },
  {
    icon: "💼",
    title: "Jobs",
    type: "JOB",
    text: "Discover your next career",
  },
  {
    icon: "💻",
    title: "Internships",
    type: "INTERNSHIP",
    text: "Build real-world experience",
  },
  {
    icon: "📚",
    title: "Training",
    type: "TRAINING",
    text: "Learn new skills for free",
  },
  {
    icon: "🏆",
    title: "Competitions",
    type: "COMPETITION",
    text: "Show your talent",
  },
  {
    icon: "🚀",
    title: "Business",
    type: "BUSINESS",
    text: "Grow your business ideas",
  },
];

const opportunities = [
  {
    icon: "🎓",
    type: "SCHOLARSHIP",
    title: "Global Undergraduate Scholarship",
    location: "International",
    deadline: "2026-10-15",
    match: "96%",
    description:
      "A scholarship opportunity for students who want to study and build their future internationally.",
  },

  {
    icon: "💻",
    type: "INTERNSHIP",
    title: "Software Development Internship",
    location: "Kathmandu",
    deadline: "12 days left",
    match: "93%",
    description:
      "Gain practical experience and develop your skills by working on real software projects.",
  },

  {
    icon: "📚",
    type: "TRAINING",
    title: "Free Digital Skills Training",
    location: "Online",
    deadline: "25 days left",
    match: "89%",
    description:
      "Learn valuable digital skills online and improve your career opportunities.",
  },

  {
    icon: "💼",
    type: "JOB",
    title: "Junior Marketing Executive",
    location: "Kathmandu",
    deadline: "10 days left",
    match: "91%",
    description:
      "Join a growing team and develop your marketing and communication skills.",
  },

  {
    icon: "🏆",
    type: "COMPETITION",
    title: "National Innovation Challenge",
    location: "Nepal",
    deadline: "30 days left",
    match: "87%",
    description:
      "Present your innovative ideas and compete with talented young people from across Nepal.",
  },

  {
    icon: "🚀",
    type: "BUSINESS",
    title: "Youth Startup Support Program",
    location: "Nepal",
    deadline: "20 days left",
    match: "94%",
    description:
      "Get mentorship, guidance and support to develop your business idea.",
  },

  {
    icon: "🎓",
    type: "SCHOLARSHIP",
    title: "Women in Technology Scholarship",
    location: "International",
    deadline: "15 days left",
    match: "90%",
    description:
      "Support for students interested in technology and digital careers.",
  },

  {
    icon: "🌍",
    type: "TRAINING",
    title: "English Language Learning Program",
    location: "Online",
    deadline: "22 days left",
    match: "85%",
    description:
      "Improve your English communication skills through an online learning program.",
  },

  {
    icon: "💼",
    type: "JOB",
    title: "Customer Support Officer",
    location: "Lalitpur",
    deadline: "8 days left",
    match: "88%",
    description:
      "Work with customers and develop professional communication and service skills.",
  },
];
     
const getDeadlineStatus = (deadline) => {
  // Handle old text deadline like "18 days left"
  if (
    !deadline ||
    typeof deadline !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(deadline)
  ) {
    return {
      text: deadline || "Deadline not specified",
      status: "normal",
    };
  }

  const today = new Date();
  const deadlineDate = new Date(deadline);

  const difference = deadlineDate - today;

  const daysLeft = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return {
      text: "Deadline Passed",
      status: "passed",
    };
  }

  if (daysLeft === 0) {
    return {
      text: "Last day today!",
      status: "urgent",
    };
  }

  if (daysLeft <= 7) {
    return {
      text: `${daysLeft} days left`,
      status: "urgent",
    };
  }

  return {
    text: `${daysLeft} days left`,
    status: "normal",
  };
};

function App() {

  const [databaseOpportunities, setDatabaseOpportunities] = useState([]);
const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  const [savedOpportunities, setSavedOpportunities] = useState(() => {
  const saved = localStorage.getItem(
    "awasarNepalSavedOpportunities"
  );

  return saved ? JSON.parse(saved) : [];
});
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllOpportunities, setShowAllOpportunities] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleOpportunities, setVisibleOpportunities] = useState(6);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const[ showSignup, setShowSignup] = useState(false);
  const [name, setName] = useState("");
const [signupEmail, setSignupEmail] = useState("");
const [signupPhone, setSignupPhone] = useState("");
const [signupPassword, setSignupPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loginMethod, setLoginMethod] = useState("email");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [loginMessage, setLoginMessage] = useState("");
const [loggedInUser, setLoggedInUser] = useState("");
const [showUserMenu, setShowUserMenu] = useState(false);
const [isCheckingLogin, setIsCheckingLogin] = useState(true);

useEffect(() => {
  const isLoggedIn = localStorage.getItem(
    "awasarNepalLoggedIn"
  );

  const savedUser = JSON.parse(
    localStorage.getItem("awasarNepalUser")
  );

  if (isLoggedIn === "true" && savedUser) {
    setLoggedInUser(savedUser.name);
    setLoggedInEmail(savedUser.email);
  }

  setIsCheckingLogin(false);
}, []);

useEffect(() => {
  const fetchOpportunities = async () => {
 const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading opportunities:", error);
      setLoadingOpportunities(false);
      return;
    }

    const formattedOpportunities = (data || []).map((item) => ({
      ...item,
      type: item.category,
      icon: "📌",
      match: "New",
      education: "Not specified",
      funding: "Not specified",
      applyLink: item.application_link,
      requirements: [
        "Follow the requirements provided by the organization."
      ],
    }));

    setDatabaseOpportunities(formattedOpportunities);
    setLoadingOpportunities(false);
  };

  fetchOpportunities();
}, []);

const [loggedInEmail, setLoggedInEmail] = useState("");
const [showDashboard, setShowDashboard] = useState(false);
const [showAIFinder, setShowAIFinder] = useState(false);
const [aiInterest, setAiInterest] = useState("");
const [aiEducation, setAiEducation] = useState("");
const [aiLocation, setAiLocation] = useState("");
const [aiCategory, setAiCategory] = useState("");
const [aiGoal, setAiGoal] = useState("");
const [aiResults, setAiResults] = useState([]);
const [selectedOpportunity, setSelectedOpportunity] = useState(null);
const [showApplication, setShowApplication] = useState(false);

const [showEditProfile, setShowEditProfile] = useState(false);

const [editName, setEditName] = useState("");

const [editEmail, setEditEmail] = useState("");

const [editPhone, setEditPhone] = useState("");

const [applications, setApplications] = useState(() => {
  const savedApplications = localStorage.getItem(
    "awasarNepalApplications"
  );

  return savedApplications
    ? JSON.parse(savedApplications)
    : [];
});

const [applicantName, setApplicantName] = useState("");

const [applicantEmail, setApplicantEmail] = useState("");
const [currentPage, setCurrentPage] = useState("home");
const [showSubmitOpportunity, setShowSubmitOpportunity] = useState(false);
const [showAdminPanel, setShowAdminPanel] = useState(false);
const [adminFilter, setAdminFilter] = useState("pending");
const adminEmails = [
  "yogeshgautam30664@gmail.com",
  "yogeshgautam059@gmail.com",
];

const isAdmin = adminEmails.includes(
  loggedInEmail.toLowerCase()
);

const [submittedOpportunities, setSubmittedOpportunities] = useState(() => {
  const savedSubmissions = localStorage.getItem(
    "awasarNepalSubmissions"
  );

  return savedSubmissions
    ? JSON.parse(savedSubmissions)
    : [];
});

const [submitForm, setSubmitForm] = useState({
  title: "",
  organization: "",
  category: "",
  location: "",
  deadline: "",
  description: "",
  applyLink: "",
});

const handleLogin = async (e) => {
  e.preventDefault();

  if (loginMethod === "phone") {
    setLoginMessage(
      "Mobile login is not available yet. Please use email."
    );
    return;
  }

  if (!email.trim() || !password.trim()) {
    setLoginMessage(
      "Please enter your email and password."
    );
    return;
  }

  setLoginMessage("Logging in...");

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

  if (error) {
    setLoginMessage(error.message);
    return;
  }

  const userName =
    data.user.user_metadata?.name ||
    data.user.email;

  setLoggedInUser(userName);
  setLoggedInEmail(data.user.email);

  setShowDashboard(true);
  setShowLogin(false);

  setEmail("");
  setPassword("");
  setLoginMessage("");

  alert(`Welcome to Awasar Nepal, ${userName}! 🎉`);
};

const handleSignup = async (e) => {
  e.preventDefault();

  if (!name.trim()) {
    alert("Please enter your full name.");
    return;
  }

  if (!signupEmail.trim()) {
    alert("Please enter your email.");
    return;
  }

  if (!/^(98|97)\d{8}$/.test(signupPhone)) {
    alert("Please enter a valid 10-digit Nepal mobile number.");
    return;
  }

  if (signupPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (signupPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  // 1. Create Supabase Auth account
  const { data, error } = await supabase.auth.signUp({
    email: signupEmail.trim(),
    password: signupPassword,

    options: {
      data: {
        name: name.trim(),
        phone: signupPhone.trim(),
      },
    },
  });

  console.log("Supabase signup data:", data);
  console.log("Supabase signup error:", error);

  if (error) {
    alert("Signup Error: " + error.message);
    return;
  }

  if (!data.user) {
    alert("Account could not be created. Please try again.");
    return;
  }

  // 2. Success
alert(
  "Account created successfully! 🎉\n\n" +
  "Your profile has been saved automatically."
);

setShowSignup(false);

setName("");
setSignupEmail("");
setSignupPhone("");
setSignupPassword("");
setConfirmPassword("");

setShowLogin(true);
};

  

const handleSubmitOpportunity = async (e) => {
  e.preventDefault();

  if (
    !submitForm.title ||
    !submitForm.organization ||
    !submitForm.category ||
    !submitForm.location ||
    !submitForm.deadline ||
    !submitForm.description ||
    !submitForm.applyLink
  ) {
    alert("Please fill in all fields.");
    return;
  }

  const { error } = await supabase
  .from("opportunity_submissions")
  .insert([
    {
      title: submitForm.title,
      organization: submitForm.organization,
      category: submitForm.category,
      location: submitForm.location,
      deadline: submitForm.deadline,
      description: submitForm.description,
      application_link: submitForm.applyLink,
      status: "pending",
    },
  ]);

  if (error) {
  console.error("Submit opportunity error:", error);

  alert(
    "Submit Error:\n" +
    error.message +
    "\n\nCode: " +
    error.code
  );

  return;
}

  const newSubmission = {
  id: Date.now(),
  ...submitForm,
  status: "pending",
  submittedAt: new Date().toLocaleDateString(),
};

  const updatedSubmissions = [
    ...submittedOpportunities,
    newSubmission,
  ];

  setSubmittedOpportunities(updatedSubmissions);

  localStorage.setItem(
    "awasarNepalSubmissions",
    JSON.stringify(updatedSubmissions)
  );

  alert(
    "Opportunity submitted successfully! It will be reviewed before publishing."
  );

  setSubmitForm({
    title: "",
    organization: "",
    category: "",
    location: "",
    deadline: "",
    description: "",
    applyLink: "",
  });

  setShowSubmitOpportunity(false);
};


const approveOpportunity = async (id) => {
  const submission = submittedOpportunities.find(
    (item) => item.id === id
  );

  if (!submission) {
    alert("Submission not found.");
    return;
  }

  // Publish opportunity into the main opportunities table
  const { error: publishError } = await supabase
    .from("opportunities")
    .insert([
      {
        title: submission.title,
        organization: submission.organization,
        category: submission.category,
        location: submission.location,
        deadline: submission.deadline,
        description: submission.description,
        eligibility: "Please follow the eligibility requirements provided by the organization.",
        application_link: submission.applyLink || submission.application_link,
        image_url: null,
      },
    ]);

  if (publishError) {
    console.error("Publish opportunity error:", publishError);

    alert(
      "Could not publish opportunity:\n" +
      publishError.message +
      "\n\nCode: " +
      publishError.code
    );

    return;
  }

  // Change submission status to approved
  const { error: updateError } = await supabase
    .from("opportunity_submissions")
    .update({ status: "approved" })
    .eq("id", id);

  if (updateError) {
    console.error("Approve status update error:", updateError);

    alert(
      "Opportunity was published, but approval status could not be updated:\n" +
      updateError.message
    );

    return;
  }

  // Update local state
  const updatedSubmissions = submittedOpportunities.map((item) =>
    item.id === id
      ? { ...item, status: "approved" }
      : item
  );

  setSubmittedOpportunities(updatedSubmissions);

  localStorage.setItem(
    "awasarNepalSubmissions",
    JSON.stringify(updatedSubmissions)
  );

  alert("Opportunity approved and published successfully! ✅");
};


const declineOpportunity = (id) => {
  const updatedSubmissions = submittedOpportunities.map((item) =>
    item.id === id
      ? { ...item, status: "declined" }
      : item
  );

  setSubmittedOpportunities(updatedSubmissions);

  localStorage.setItem(
    "awasarNepalSubmissions",
    JSON.stringify(updatedSubmissions)
  );

  alert("Opportunity declined.");
};

const approvedOpportunities = submittedOpportunities
  .filter((item) => item.status === "approved")
  .map((item) => ({
    ...item,
    type: item.category,
    icon: "📌",
    match: "New",
    education: "Not specified",
    funding: "Not specified",
    eligibility: [
      "Check the official opportunity details for eligibility."
    ],
    requirements: [
      "Follow the requirements provided by the organization."
    ],
  }));

const allOpportunities = [
  ...databaseOpportunities,
  ...opportunities,
  ...approvedOpportunities,
];

const getCompleteOpportunity = (item) => {
  return {
    organization: "Awasar Nepal Partner Organization",

    education: "Open to eligible applicants",

    funding: "Check official details",

    eligibility: [
      "Meet the eligibility criteria of the organization",
      "Provide accurate application information",
      "Follow the official application requirements",
    ],

    requirements: [
      "Complete the application form",
      "Provide required supporting documents",
      "Follow instructions from the official organization",
    ],

    applyLink: "#",

    ...item,
  };
};

const findMatchingOpportunities = (
  interest,
  education,
  location,
  category,
  goal
) => {
  const interestText = interest.toLowerCase();
  const goalText = goal.toLowerCase();

  const scoredOpportunities = allOpportunities.map((item) => {
    let score = 0;
    const reasons = [];

    // 🎯 Category match
    if (
      category &&
      item.type.toLowerCase() === category.toLowerCase()
    ) {
      score += 40;
      reasons.push("Matches your preferred opportunity type");
    }

    // 🎓 Education match
    
    const itemEducation = (
  item.education || "Not specified"
).toLowerCase();

const selectedEducation = education.toLowerCase();
    if (
      itemEducation.includes(selectedEducation) ||
      selectedEducation.includes(itemEducation) ||
      itemEducation.includes("open to everyone") ||
      itemEducation.includes("open category")
    ) {
      score += 20;
      reasons.push("Suitable for your education level");
    }

    // 📍 Location match
    const itemLocation = item.location.toLowerCase();
    const selectedLocation = location.toLowerCase();

    if (
      itemLocation.includes(selectedLocation) ||
      selectedLocation === "online" &&
      itemLocation.includes("online") ||
      selectedLocation === "nepal" &&
      itemLocation.includes("nepal")
    ) {
      score += 15;
      reasons.push("Matches your preferred location");
    }


    
    // 💻 Interest matching
    const opportunityText = (
      item.title +
      " " +
      item.description +
      " " +
      item.type
    ).toLowerCase();

    const interestWords = interestText
      .split(/[\s,]+/)
      .filter((word) => word.length > 2);

    const interestMatch = interestWords.some((word) =>
      opportunityText.includes(word)
    );

    if (interestMatch) {
      score += 15;
      reasons.push("Matches your interests");
    }

    // 🚀 Goal matching
    const goalWords = goalText
      .split(/[\s,]+/)
      .filter((word) => word.length > 3);

    const goalMatch = goalWords.some((word) =>
      opportunityText.includes(word)
    );

    if (goalMatch) {
      score += 10;
      reasons.push("Relevant to your goal");
    }

    return {
      ...item,
      aiScore: Math.min(score, 100),
      aiReasons:
        reasons.length > 0
          ? reasons
          : ["May be worth exploring based on your profile"],
    };
  });

  const sortedResults = scoredOpportunities
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 6);

  setAiResults(sortedResults);
  setShowAIFinder(false);

  setTimeout(() => {
    document
      .getElementById("ai-results")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, 200);
};
const handleApply = (opportunity) => {
  if (!loggedInUser) {
    alert("Please log in before applying.");
    setShowLogin(true);
    return;
  }

  const alreadyApplied = applications.some(
    (item) => item.title === opportunity.title
  );

  if (alreadyApplied) {
    alert("You have already applied for this opportunity.");
    return;
  }

  const newApplication = {
    id: Date.now(),
    title: opportunity.title,
    organization:
      opportunity.organization ||
      "Awasar Nepal Partner Organization",
    location: opportunity.location,
    deadline: opportunity.deadline,
    status: "Applied",
    appliedAt: new Date().toLocaleDateString(),
  };

  const updatedApplications = [
    ...applications,
    newApplication,
  ];

  setApplications(updatedApplications);

  localStorage.setItem(
    "awasarNepalApplications",
    JSON.stringify(updatedApplications)
  );

  alert(
    "Application added to your tracker successfully! 🎉"
  );
};

const handleSaveProfile = (e) => {
  e.preventDefault();

  if (!editName.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!editEmail.trim()) {
    alert("Please enter your email.");
    return;
  }

  if (!/^(98|97)\d{8}$/.test(editPhone)) {
    alert("Please enter a valid 10-digit Nepal mobile number.");
    return;
  }

  const updatedUser = {
    name: editName.trim(),
    email: editEmail.trim(),
    phone: editPhone.trim(),
  };

  localStorage.setItem(
    "awasarNepalUser",
    JSON.stringify(updatedUser)
  );

  setLoggedInUser(updatedUser.name);
  setLoggedInEmail(updatedUser.email);

  setShowEditProfile(false);

  alert("Profile updated successfully! 🎉");
};

const filteredOpportunities = allOpportunities.filter((item) => {

  const matchesSearch =
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "" ||
    item.type.toLowerCase() === selectedCategory.toLowerCase();

  const matchesLocation =
    selectedLocation === "" ||
    item.location.toLowerCase().includes(
      selectedLocation.toLowerCase()
    );

  return (
    matchesSearch &&
    matchesCategory &&
    matchesLocation
  );

});
const openSavedOpportunity = (title) => {
  const opportunity = allOpportunities.find(
    (item) => item.title === title
  );

  if (opportunity) {
    setShowDashboard(false);

    setSelectedOpportunity(
      getCompleteOpportunity(opportunity)
    );
  }
};
  const toggleSave = (title) => {
  setSavedOpportunities((previous) => {

    const updatedSaved =
      previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title];

    localStorage.setItem(
      "awasarNepalSavedOpportunities",
      JSON.stringify(updatedSaved)
    );

    return updatedSaved;
  });
};
  return (

   <div className="app">
 <header className="navbar">

    <a className="logo" href="#home">
      <img
        src={logo}
        alt="Awasar Nepal Logo"
        className="website-logo"
      />

      <span>
        <strong>AWASAR</strong>
        <small>NEPAL</small>
      </span>
    </a>

    <nav className="nav-links">
      <a href="#home">Home</a>
      <a href="#opportunities">Opportunities</a>
      <a href="#categories">Categories</a>
      <a href="#premium">Premium</a>
      <button
  className="nav-about-btn"
  onClick={() => {
    setCurrentPage("about");
    window.scrollTo(0, 0);
  }}
>
  About
</button>
    </nav>

      <div className="nav-actions">
     <button
  className="submit-opportunity-btn"
  onClick={() => setShowSubmitOpportunity(true)}
>
  ➕ Submit Opportunity
</button>   

{isAdmin && (
  <button
    className="admin-btn"
    onClick={() => setShowAdminPanel(true)}
  >
    👑 Admin
  </button>
)}

{loggedInUser ? (
  <div className="user-menu-container">

    <button
      className="user-btn"
      onClick={() => setShowUserMenu(!showUserMenu)}
    >
      👤 {loggedInUser} ⌄
    </button>

    {showUserMenu && (
      <div className="user-dropdown">

        <button
          onClick={() => {
            setShowDashboard(true);
            setShowUserMenu(false);
          }}
        >
          👤 My Dashboard
        </button>

        <button
          onClick={() => {
            setShowEditProfile(true);
            setShowUserMenu(false);
          }}
        >
          ✏️ Edit Profile
        </button>

        <button
          className="dropdown-logout"
          onClick={() => {
            setLoggedInUser("");
            setLoggedInEmail("");

            localStorage.removeItem(
              "awasarNepalLoggedIn"
            );

            setShowUserMenu(false);

            alert("You have been logged out.");
          }}
        >
          🚪 Sign Out
        </button>

      </div>
    )}

  </div>
) : (
    <>
      <button
        className="login-btn"
        onClick={() => setShowLogin(true)}
      >
        Log in
      </button>

      <button
        className="signup-btn"
        onClick={() => setShowSignup(true)}
      >
        Get Started
      </button>
    </>
  )}

</div>

  </header>
{currentPage === "home" ? (
      <main>
        <section className="hero" id="home">
          <div className="hero-particles" aria-hidden="true">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>

<div className="hero-network" aria-hidden="true">
  <span className="network-line line-one"></span>
  <span className="network-line line-two"></span>
  <span className="network-line line-three"></span>
  <span className="network-dot dot-one"></span>
  <span className="network-dot dot-two"></span>
  <span className="network-dot dot-three"></span>
</div>
          <div className="hero-content">
            <div className="badge">
              🇳🇵 Built for Nepal · Open opportunities for everyone
            </div>

            <h1>
              Find the opportunity
              <span> made for you.</span>
            </h1>

            <p>
              Scholarships, jobs, internships, training, competitions and
              more — discover opportunities that match your goals.
            </p>

            <div className="search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
  onClick={() => {
    document
      .getElementById("opportunities")
      .scrollIntoView({ behavior: "smooth" });
  }}
>
  Search
</button>
            </div>

            <div className="quick-search">
  <span>Popular:</span>

  <button
    onClick={() => {
      setSelectedCategory("Scholarships");
      document
        .getElementById("opportunities")
        .scrollIntoView({ behavior: "smooth" });
    }}
  >
    Scholarship
  </button>

  <button
    onClick={() => {
      setSelectedCategory("Internships");
      document
        .getElementById("opportunities")
        .scrollIntoView({ behavior: "smooth" });
    }}
  >
    Internship
  </button>

  <button
    onClick={() => {
      setSelectedCategory("Jobs");
      document
        .getElementById("opportunities")
        .scrollIntoView({ behavior: "smooth" });
    }}
  >
    Job
  </button>

  <button
    onClick={() => {
      setSelectedCategory("Training");
      document
        .getElementById("opportunities")
        .scrollIntoView({ behavior: "smooth" });
    }}
  >
    Training
  </button>
</div>
          </div>

          <div className="hero-visual">
            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            <div className="mountain-card">
              <div className="sun"></div>

              <div className="mountains">
                <div className="mountain back"></div>
                <div className="mountain front"></div>
              </div>

              <div className="path"></div>

              <div className="floating-card card-one">
                <span>🎓</span>
                <div>
                  <b>Scholarship</b>
                  <small>96% match</small>
                </div>
              </div>

              <div className="floating-card card-two">
                <span>💼</span>
                <div>
                  <b>New Job</b>
                  <small>Just added</small>
                </div>
              </div>

              <div className="floating-card card-three">
                <span>🚀</span>
                <div>
                  <b>Opportunity</b>
                  <small>For you</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="stats">
          <div>
            <strong>1,000+</strong>
            <span>Opportunities</span>
          </div>
          <div>
            <strong>50+</strong>
            <span>Organizations</span>
          </div>
          <div>
            <strong>10+</strong>
            <span>Categories</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>Made for Nepal</span>
          </div>
        </section>

      <section className="section categories-section" id="categories">
          <div className="section-heading">
            <div>
              <span className="eyebrow">EXPLORE</span>
              <h2>What are you looking for?</h2>
            </div>
            <a href="#">View all →</a>
          </div>

          <div className="category-grid">
          {categories.map((category) => (
  <article
    className="category-card"
    key={category.title}
    onClick={() => {
  setSelectedCategory(category.type);

  document
    .getElementById("opportunities")
    .scrollIntoView({ behavior: "smooth" });
}}
  >  
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.text}</p>
                <span className="arrow">→</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section opportunities" id="opportunities">
          <div
  className="awasar-particle red"
  style={{
    top: "12%",
    left: "6%"
  }}
></div>

<div
  className="awasar-particle blue"
  style={{
    top: "28%",
    right: "8%",
    animationDelay: "2s"
  }}
></div>

<div
  className="awasar-particle gold"
  style={{
    bottom: "25%",
    left: "10%",
    animationDelay: "4s"
  }}
></div>

<div
  className="awasar-particle blue"
  style={{
    bottom: "10%",
    right: "15%",
    animationDelay: "6s"
  }}
></div>
          <div className="section-heading">
            <div>
              <span className="eyebrow">DISCOVER</span>
              <h2>Opportunities for you</h2>
            </div>
           <button
  className="explore-all-btn"
  onClick={() =>
    setShowAllOpportunities(!showAllOpportunities)
  }
>
  {showAllOpportunities
    ? "Show Less ↑"
    : "Explore All →"}
</button> 
          </div>

<div className="filters">

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="">All Categories</option>

    <option value="Scholarships">🎓 Scholarships</option>
    <option value="Jobs">💼 Jobs</option>
    <option value="Internships">💻 Internships</option>
    <option value="Training">📚 Training</option>
    <option value="Competitions">🏆 Competitions</option>
    <option value="Business">🚀 Business</option>

  </select>


  <select
    value={selectedLocation}
    onChange={(e) => setSelectedLocation(e.target.value)}
  >
    <option value="">📍 All Locations</option>

    <option value="Nepal">🇳🇵 Nepal</option>
    <option value="Kathmandu">📍 Kathmandu</option>
    <option value="Lalitpur">📍 Lalitpur</option>
    <option value="International">🌍 International</option>
    <option value="Online">🌐 Online</option>
    <option value="Remote">🌐 Remote</option>

  </select>


  {(selectedCategory || selectedLocation || searchTerm) && (
    <button
      className="clear-filters"
      onClick={() => {
        setSelectedCategory("");
        setSelectedLocation("");
        setSearchTerm("");
      }}
    >
      Clear Filters ✕
    </button>
  )}

</div>
          <div className="opportunity-grid">
            {filteredOpportunities.length === 0 && (
  <p className="no-results">
    😔 No opportunities found. Try another search.
  </p>
)}
            {(showAllOpportunities
  ? filteredOpportunities
  : filteredOpportunities.slice(0, 6)
).map((item) => (
              <article className="opportunity-card" key={item.title}>
                <div className="opportunity-top">
                  <div className="opportunity-icon">{item.icon}</div>
                  <span className="match">{item.match} Match</span>
                </div>

                <span className="opportunity-type">{item.type}</span>
                <h3>{item.title}</h3>
                <p className="opportunity-organization">
  🏢 {item.organization || "Awasar Nepal Partner"}
</p>

                <div className="opportunity-info">
  <span>📍 {item.location}</span>

  <span
    className={`deadline ${
      getDeadlineStatus(item.deadline).status
    }`}
  >
    ⏰ {getDeadlineStatus(item.deadline).text}
  </span>
</div>

                <div className="card-footer">
                 <button
  className={`save ${
    savedOpportunities.includes(item.title) ? "saved" : ""
  }`}
  onClick={() => toggleSave(item.title)}
>
  {savedOpportunities.includes(item.title) ? "♥" : "♡"}
</button> 

                 <button
  className="view-btn"
  onClick={() =>
  setSelectedOpportunity(getCompleteOpportunity(item))
}
>
  View Opportunity →
</button> 
                </div>
              </article>
            ))}
          </div>
        </section>
{aiResults.length > 0 && (
  <section className="ai-results-section" id="ai-results">

    <div className="ai-results-heading">
      <span className="premium-badge">
        🤖 AI POWERED MATCHING
      </span>

      <h2>Opportunities matched for you.</h2>

      <p>
        Based on your education, location, interests and goals,
        here are your best matches.
      </p>
    </div>

    <div className="ai-results-grid">

      {aiResults.map((item, index) => (

        <article
          className="ai-result-card"
          key={item.id || item.title}
        >

          <div className="ai-result-top">

            <div className="ai-result-icon">
              {item.icon}
            </div>

            <span className="ai-match-score">
              {item.aiScore}% Match
            </span>

          </div>

          <span className="opportunity-type">
            {item.type}
          </span>

          <h3>{item.title}</h3>

          <p className="ai-result-organization">
            🏢 {item.organization}
          </p>

          <div className="ai-result-info">
            <span>📍 {item.location}</span>
            <span>📅 {item.deadline}</span>
          </div>

          <div className="ai-reasons">

            <strong>Why this matches you</strong>

            {item.aiReasons.slice(0, 3).map(
              (reason, reasonIndex) => (
                <span key={reasonIndex}>
                  ✓ {reason}
                </span>
              )
            )}

          </div>

          <button
            className="ai-view-btn"
            onClick={() =>
  setSelectedOpportunity(getCompleteOpportunity(item))
}
          >
            View Opportunity →
          </button>

        </article>

      ))}

    </div>

  </section>
)}
        <section className="premium-section" id="premium">
          <div
  className="awasar-particle blue"
  style={{
    top: "12%",
    left: "10%"
  }}
></div>

<div
  className="awasar-particle red"
  style={{
    top: "35%",
    right: "8%",
    animationDelay: "3s"
  }}
></div>

<div
  className="awasar-particle gold"
  style={{
    bottom: "20%",
    left: "20%",
    animationDelay: "5s"
  }}
></div>

<div
  className="awasar-particle blue"
  style={{
    bottom: "12%",
    right: "18%",
    animationDelay: "7s"
  }}
></div>
  <div className="premium-heading">
    <span className="premium-badge">💎 AWASAR NEPAL PREMIUM</span>

    <h2>Unlock more opportunities.</h2>

    <p>
      Get powerful tools to help you find, save and manage
      opportunities more easily.
    </p>
  </div>

  <div className="premium-grid">

    <article
  className="premium-card"
  onClick={() => setShowAIFinder(true)}
  style={{ cursor: "pointer" }}
>
  <div className="premium-icon">🤖</div>

  <h3>AI Opportunity Finder</h3>

  <p>
    Tell us your goals and discover opportunities that match you.
  </p>

  <span className="premium-status">Try Now →</span>
</article>


    <article className="premium-card">
      <div className="premium-icon">📄</div>

      <h3>Resume Checker</h3>

      <p>
        Get helpful feedback to improve your CV and resume.
      </p>

      <span className="premium-status">Coming Soon</span>
    </article>


    <article className="premium-card">
      <div className="premium-icon">🎯</div>

      <h3>Personalized Matches</h3>

      <p>
        Get opportunity recommendations based on your interests.
      </p>

      <span className="premium-status">Coming Soon</span>
    </article>


    <article className="premium-card">
      <div className="premium-icon">❤️</div>

      <h3>Saved Opportunities</h3>

      <p>
        Save opportunities and keep track of the ones you love.
      </p>

      <strong className="saved-count">
        {savedOpportunities.length} Saved
      </strong>
    </article>

  </div>

  <div className="premium-bottom">
    <h3>More powerful features are coming soon 🚀</h3>

    <button>
      Get Premium
    </button>
  </div>
</section>
<section className="cta" id="about">
          <div>
            <span className="eyebrow">YOUR NEXT STEP</span>
            <h2>Stop searching everywhere.</h2>
            <p>
              Create your profile and let Awasar Nepal help you discover
              opportunities that fit you.
            </p>
          </div>
          <button
  onClick={() => {
    if (loggedInUser) {
      setShowDashboard(true);
    } else {
      setShowSignup(true);
    }
  }}
>
  {loggedInUser
    ? "Open My Dashboard →"
    : "Create your free profile →"}
</button>
        </section>
      </main>
      ) : (

  <main className="about-page">

    <section className="about-hero">
<div
  className="awasar-particle red"
  style={{
    top: "18%",
    left: "12%"
  }}
></div>

<div
  className="awasar-particle blue"
  style={{
    top: "28%",
    right: "12%",
    animationDelay: "2s"
  }}
></div>

<div
  className="awasar-particle gold"
  style={{
    bottom: "18%",
    left: "25%",
    animationDelay: "5s"
  }}
></div>
      <span className="eyebrow">
        ABOUT AWASAR NEPAL
      </span>

      <h1>
        Opportunities can change lives.
        <span> Finding them shouldn't be difficult.</span>
      </h1>

      <p>
        Awasar Nepal is a platform created to help students,
        young people and opportunity seekers discover valuable
        opportunities in one simple place.
      </p>

      <button
        className="about-home-btn"
        onClick={() => {
          setCurrentPage("home");
          window.scrollTo(0, 0);
        }}
      >
        ← Back to Home
      </button>

    </section>


    <section className="about-story">

      <div className="about-story-text">

        <span className="eyebrow">
          WHY AWASAR NEPAL?
        </span>

        <h2>
          The problem isn't always
          the lack of opportunities.
        </h2>

        <p>
          Every year, thousands of scholarships, jobs,
          internships, training programs and competitions
          become available.
        </p>

        <p>
          But many people never discover them at the right time.
          Important opportunities are often scattered across
          different websites, social media pages and organizations.
        </p>

        <p>
          Awasar Nepal was created to make opportunity discovery
          simpler, easier and more accessible for everyone.
        </p>

      </div>

      <div className="about-quote">

        <span>💡</span>

        <h3>
          "An opportunity can change someone's future.
          The right information can help them find it."
        </h3>

        <strong>
          — Awasar Nepal
        </strong>

      </div>

    </section>


    <section className="about-mission">

      <div className="mission-card">

        <div className="mission-icon">
          🎯
        </div>

        <span className="eyebrow">
          OUR MISSION
        </span>

        <h2>
          Make opportunities easier to discover.
        </h2>

        <p>
          Our mission is to bring useful opportunities into
          one accessible platform so that students and young
          people can spend less time searching and more time
          building their future.
        </p>

      </div>


      <div className="mission-card vision">

        <div className="mission-icon">
          🌍
        </div>

        <span className="eyebrow">
          OUR VISION
        </span>

        <h2>
          A future where no opportunity is missed.
        </h2>

        <p>
          We imagine a Nepal where talented and motivated people
          do not miss valuable opportunities simply because they
          didn't know where to find them.
        </p>

      </div>

    </section>


    <section className="about-features">
      <div
  className="awasar-particle red"
  style={{
    top: "20%",
    left: "8%"
  }}
></div>

<div
  className="awasar-particle blue"
  style={{
    top: "50%",
    right: "10%",
    animationDelay: "3s"
  }}
></div>

<div
  className="awasar-particle gold"
  style={{
    bottom: "15%",
    left: "15%",
    animationDelay: "6s"
  }}
></div>

      <div className="about-features-heading">

        <span className="eyebrow">
          WHAT YOU CAN FIND
        </span>

        <h2>
          One platform. Many opportunities.
        </h2>

        <p>
          Awasar Nepal is built to help you explore opportunities
          that can support your education, career and future.
        </p>

      </div>


      <div className="about-feature-grid">

        <div className="about-feature-card">
          <span>🎓</span>
          <h3>Scholarships</h3>
          <p>
            Discover scholarships and funding opportunities.
          </p>
        </div>


        <div className="about-feature-card">
          <span>💼</span>
          <h3>Jobs</h3>
          <p>
            Find career opportunities that match your goals.
          </p>
        </div>


        <div className="about-feature-card">
          <span>💻</span>
          <h3>Internships</h3>
          <p>
            Gain real-world experience and build your skills.
          </p>
        </div>


        <div className="about-feature-card">
          <span>📚</span>
          <h3>Training</h3>
          <p>
            Learn new skills and improve your future possibilities.
          </p>
        </div>


        <div className="about-feature-card">
          <span>🏆</span>
          <h3>Competitions</h3>
          <p>
            Discover platforms where you can show your talent.
          </p>
        </div>


        <div className="about-feature-card">
          <span>🚀</span>
          <h3>Business</h3>
          <p>
            Explore opportunities to grow your ideas and ambitions.
          </p>
        </div>

      </div>

    </section>


    <section className="about-big-vision">
      <div
  className="awasar-particle red"
  style={{
    top: "15%",
    left: "10%"
  }}
></div>

<div
  className="awasar-particle blue"
  style={{
    top: "30%",
    right: "12%",
    animationDelay: "3s"
  }}
></div>

<div
  className="awasar-particle gold"
  style={{
    bottom: "20%",
    left: "30%",
    animationDelay: "5s"
  }}
></div>

      <span className="eyebrow">
        OUR BELIEF
      </span>

      <h2>
        "Your next opportunity could be
        the beginning of your next chapter."
      </h2>

      <p>
        We believe that access to the right information can
        create new possibilities, open doors and help people
        take the next step towards their goals.
      </p>

    </section>


    <section className="about-final">

      <span className="eyebrow">
        YOUR JOURNEY STARTS HERE
      </span>

      <h2>
        Stop searching everywhere.
      </h2>

      <p>
        Discover opportunities. Build your future.
        Take your next step with Awasar Nepal.
      </p>

      <button
        onClick={() => {
          setCurrentPage("home");

          setTimeout(() => {
            document
              .getElementById("opportunities")
              ?.scrollIntoView({
                behavior: "smooth"
              });
          }, 100);
        }}
      >
        Explore Opportunities →
      </button>

    </section>

  </main>

)}

      {selectedOpportunity && (
  <div className="opportunity-overlay">
    <div className="opportunity-modal">

      <button
        className="login-close"
        onClick={() => setSelectedOpportunity(null)}
      >
        ×
      </button>

      <div className="detail-header">
        <div className="detail-icon">
          {selectedOpportunity.icon}
        </div>

        <div>
          <span className="opportunity-type">
            {selectedOpportunity.type}
          </span>

          <h2>{selectedOpportunity.title}</h2>

          <p className="detail-organization">
            🏢 {selectedOpportunity.organization}
          </p>
        </div>
      </div>

      <div className="detail-info-grid">

        <div className="detail-info-card">
          <span>📍</span>
          <div>
            <small>Location</small>
            <strong>{selectedOpportunity.location}</strong>
          </div>
        </div>

        <div className="detail-info-card">
          <span>📅</span>
          <div>
            <small>Deadline</small>
            <strong>{selectedOpportunity.deadline}</strong>
          </div>
        </div>

        <div className="detail-info-card">
          <span>🎓</span>
          <div>
            <small>Education</small>
            <strong>{selectedOpportunity.education}</strong>
          </div>
        </div>

        <div className="detail-info-card">
          <span>💰</span>
          <div>
            <small>Funding / Salary</small>
            <strong>{selectedOpportunity.funding}</strong>
          </div>
        </div>

      </div>

      <div className="detail-section">
        <h3>About this opportunity</h3>

        <p className="detail-description">
          {selectedOpportunity.description}
        </p>
      </div>

      <div className="detail-section">
        <h3>Who can apply?</h3>

        <ul className="requirements">
          {selectedOpportunity.eligibility.map((item, index) => (
            <li key={index}>✓ {item}</li>
          ))}
        </ul>
      </div>

      <div className="detail-section">
        <h3>Requirements</h3>

        <ul className="requirements">
          {selectedOpportunity.requirements.map((item, index) => (
            <li key={index}>📄 {item}</li>
          ))}
        </ul>
      </div>

      <div className="detail-actions">

        <button
          className={`detail-save-btn ${
            savedOpportunities.includes(selectedOpportunity.title)
              ? "saved"
              : ""
          }`}
          onClick={() => toggleSave(selectedOpportunity.title)}
        >
          {savedOpportunities.includes(selectedOpportunity.title)
            ? "♥ Saved"
            : "♡ Save Opportunity"}
        </button>

       <button
  className="apply-btn"
  onClick={() => {
    handleApply(selectedOpportunity);

    const applyLink = selectedOpportunity.applyLink;

    if (applyLink && applyLink !== "#") {
      window.open(applyLink, "_blank");
    } else {
      alert(
        "Official application link is not available for this opportunity."
      );
    }
  }}
>
  Apply Now →
</button>

      </div>

    </div>
  </div>
)}
{showSubmitOpportunity && (
  <div className="login-overlay">

    <div className="submit-opportunity-modal">

      <button
        className="login-close"
        onClick={() => setShowSubmitOpportunity(false)}
      >
        ×
      </button>

      <div className="submit-header">

        <div className="login-logo">
          ➕
        </div>

        <h2>Submit an Opportunity</h2>

        <p>
          Share a genuine opportunity with the Awasar Nepal community.
          Every submission is reviewed before publishing.
        </p>

      </div>


      <form
        className="submit-opportunity-form"
        onSubmit={handleSubmitOpportunity}
      >

        <label>Opportunity Title</label>

        <input
          type="text"
          placeholder="Example: Global Scholarship 2026"
          value={submitForm.title}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              title: e.target.value,
            })
          }
        />


        <label>Organization Name</label>

        <input
          type="text"
          placeholder="Organization offering this opportunity"
          value={submitForm.organization}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              organization: e.target.value,
            })
          }
        />


        <label>Category</label>

        <select
          value={submitForm.category}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              category: e.target.value,
            })
          }
        >
          <option value="">Select Category</option>
          <option value="SCHOLARSHIP">Scholarship</option>
          <option value="JOB">Job</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="TRAINING">Training</option>
          <option value="COMPETITION">Competition</option>
          <option value="BUSINESS">Business</option>
        </select>


        <label>Location</label>

        <input
          type="text"
          placeholder="Example: Kathmandu / Online / International"
          value={submitForm.location}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              location: e.target.value,
            })
          }
        />


        <label>Application Deadline</label>

        <input
          type="date"
          value={submitForm.deadline}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              deadline: e.target.value,
            })
          }
        />


        <label>Opportunity Description</label>

        <textarea
          placeholder="Describe the opportunity..."
          rows="5"
          value={submitForm.description}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              description: e.target.value,
            })
          }
        />


        <label>Official Application Link</label>

        <input
          type="url"
          placeholder="https://example.com/apply"
          value={submitForm.applyLink}
          onChange={(e) =>
            setSubmitForm({
              ...submitForm,
              applyLink: e.target.value,
            })
          }
        />


        <button
          type="submit"
          className="submit-opportunity-submit"
        >
          Submit for Review →
        </button>

      </form>

    </div>

  </div>
)}
{showAdminPanel && (
  <div className="login-overlay">

    <div className="admin-modal">

      <button
        className="login-close"
        onClick={() => setShowAdminPanel(false)}
      >
        ×
      </button>

      <div className="admin-header">

        <div className="login-logo">
          👑
        </div>

        <h2>Admin Panel</h2>

        <p>
          Review submitted opportunities before publishing them.
        </p>

      </div>
<div className="admin-tabs">

  <button
    className={adminFilter === "pending" ? "active" : ""}
    onClick={() => setAdminFilter("pending")}
  >
    🟡 Pending
  </button>

  <button
    className={adminFilter === "approved" ? "active" : ""}
    onClick={() => setAdminFilter("approved")}
  >
    ✅ Approved
  </button>

  <button
    className={adminFilter === "declined" ? "active" : ""}
    onClick={() => setAdminFilter("declined")}
  >
    ❌ Declined
  </button>

</div>

      <div className="admin-list">

        <div className="admin-stats">

  <div className="admin-stat pending-stat">
    <strong>
      {
        submittedOpportunities.filter(
          (item) => item.status === "pending"
        ).length
      }
    </strong>
    <span>🟡 Pending</span>
  </div>

  <div className="admin-stat approved-stat">
    <strong>
      {
        submittedOpportunities.filter(
          (item) => item.status === "approved"
        ).length
      }
    </strong>
    <span>✅ Approved</span>
  </div>

  <div className="admin-stat declined-stat">
    <strong>
      {
        submittedOpportunities.filter(
          (item) => item.status === "declined"
        ).length
      }
    </strong>
    <span>❌ Declined</span>
  </div>

</div>

        {submittedOpportunities.filter(
  (item) => item.status === adminFilter
).length === 0 ? (

          <p className="admin-empty">
            🎉 No pending opportunities to review.
          </p>

        ) : (

          submittedOpportunities
  .filter((item) => item.status === adminFilter)
  .map((item) => (

              <div
                className="admin-opportunity-card"
                key={item.id}
              >

                <div className="admin-opportunity-top">

                  <div>

                    <span className="opportunity-type">
                      {item.category}
                    </span>

                    <h3>{item.title}</h3>

                    <p>
                      🏢 {item.organization}
                    </p>

                  </div>

                </div>


                <div className="admin-opportunity-info">

                  <span>
                    📍 {item.location}
                  </span>

                  <span>
                    📅 {item.deadline}
                  </span>

                </div>


                <p className="admin-description">
                  {item.description}
                </p>


                
           <div className="admin-actions">

  <button
    className="admin-view-btn"
    onClick={() =>
      setSelectedOpportunity(
        getCompleteOpportunity({
          ...item,
          type: item.category,
          icon: "📌",
          match: "New",
        })
      )
    }
  >
    👀 View
  </button>

  {item.status === "pending" && (
    <>
      <button
        className="approve-btn"
        onClick={() => approveOpportunity(item.id)}
      >
        ✅ Approve
      </button>

      <button
        className="decline-btn"
        onClick={() => declineOpportunity(item.id)}
      >
        ❌ Decline
      </button>
    </>
  )}

  {item.status === "approved" && (
    <span className="admin-status approved">
      ✅ Published
    </span>
  )}

  {item.status === "declined" && (
    <span className="admin-status declined">
      ❌ Declined
    </span>
  )}

</div>       
  
                </div>
            ))
          )}
        </div>

      </div>

    </div>
)}
  
        
{showAIFinder && (
  <div className="login-overlay">

    <div className="login-modal">

      <button
        className="login-close"
        onClick={() => setShowAIFinder(false)}
      >
        ×
      </button>

      <div className="login-logo">
        🤖
      </div>

      <h2>AI Opportunity Finder</h2>

      <p>
        Tell us about yourself and we’ll find opportunities that match you.
      </p>

      {/* Education */}
      <label>🎓 Education Level</label>

      <select
        value={aiEducation}
        onChange={(e) => setAiEducation(e.target.value)}
      >
        <option value="">Select your education</option>
        <option value="+2">+2 / High School</option>
        <option value="Bachelor">Bachelor</option>
        <option value="Master">Master</option>
        <option value="Graduate">Graduate</option>
      </select>

      {/* Location */}
      <label>📍 Preferred Location</label>

      <select
        value={aiLocation}
        onChange={(e) => setAiLocation(e.target.value)}
      >
        <option value="">Select location</option>
        <option value="Nepal">Nepal</option>
        <option value="Kathmandu">Kathmandu</option>
        <option value="Online">Online</option>
        <option value="Abroad">Abroad</option>
      </select>

      {/* Category */}
      <label>🎯 Opportunity Type</label>

      <select
        value={aiCategory}
        onChange={(e) => setAiCategory(e.target.value)}
      >
        <option value="">Select opportunity type</option>
        <option value="SCHOLARSHIP">Scholarship</option>
        <option value="JOB">Job</option>
        <option value="INTERNSHIP">Internship</option>
        <option value="TRAINING">Training</option>
        <option value="COMPETITION">Competition</option>
        <option value="BUSINESS">Business</option>
      </select>

      {/* Interest */}
      <label>💻 Your Interest</label>

      <textarea
        rows="4"
        placeholder="Example: IT, programming, business, marketing..."
        value={aiInterest}
        onChange={(e) => setAiInterest(e.target.value)}
      />

      {/* Goal */}
      <label>🚀 Your Goal</label>

      <textarea
        rows="3"
        placeholder="Example: I want to gain experience and build my career..."
        value={aiGoal}
        onChange={(e) => setAiGoal(e.target.value)}
      />

      
      <button
  className="login-submit"
  onClick={() => {

    if (
      !aiEducation ||
      !aiLocation ||
      !aiCategory ||
      !aiInterest.trim()
    ) {
      alert("Please complete all required fields.");
      return;
    }

    findMatchingOpportunities(
      aiInterest,
      aiEducation,
      aiLocation,
      aiCategory,
      aiGoal
    );

  }}
>
  Find My Opportunities →
</button>

    </div>

  </div>
)}
{showDashboard && (
  <div className="login-overlay">
    <div className="dashboard-modal">

      <button
        className="login-close"
        onClick={() => setShowDashboard(false)}
      >
        ×
      </button>

      <div className="dashboard-header">

        <div className="dashboard-avatar">
          {loggedInUser.charAt(0).toUpperCase()}
        </div>


        <div>
          <h2>{loggedInUser}</h2>
          <p>Welcome to Awasar Nepal 👋</p>
        </div>

      </div>

<div className="profile-info">

  <div className="profile-info-item">
    <span>📧</span>
    <div>
      <small>Email</small>
      <strong>{loggedInEmail || "Not available"}</strong>
    </div>
  </div>

  <div className="profile-info-item">
    <span>📱</span>
    <div>
      <small>Mobile Number</small>
      <strong>
        {JSON.parse(
          localStorage.getItem("awasarNepalUser")
        )?.phone || "Not available"}
      </strong>
    </div>
  </div>

  <button
    className="edit-profile-btn"
    onClick={() => {
      const savedUser = JSON.parse(
        localStorage.getItem("awasarNepalUser")
      );

      if (savedUser) {
        setEditName(savedUser.name || "");
        setEditEmail(savedUser.email || "");
        setEditPhone(savedUser.phone || "");
      }

      setShowEditProfile(true);
    }}
  >
    ✏️ Edit Profile
  </button>

</div>

      <div className="dashboard-stats">

        <div className="dashboard-stat">
          <strong>{savedOpportunities.length}</strong>
          <span>Saved Opportunities</span>
        </div>

        <div className="dashboard-stat">
  <strong>{applications.length}</strong>
  <span>Applications</span>
</div>

      </div>

<div className="dashboard-section">

  <h3>❤️ Saved Opportunities</h3>

  {savedOpportunities.length === 0 ? (

    <p className="dashboard-empty">
      You haven't saved any opportunities yet.
    </p>

  ) : (

    savedOpportunities.map((title) => {

      const opportunity = allOpportunities.find(
        (item) => item.title === title
      );

      if (!opportunity) return null;

      return (

        <div
          className="saved-item"
          key={title}
        >

          <div>
            <strong>{opportunity.title}</strong>

            <small>
              📍 {opportunity.location}
            </small>
          </div>

          <button
            className="saved-view-btn"
            onClick={() => {
              setShowDashboard(false);

              setSelectedOpportunity(
                getCompleteOpportunity(opportunity)
              );
            }}
          >
            View →
          </button>

        </div>

      );

    })

  )}

</div>

      <div className="dashboard-section">

  <h3>📩 Applied Opportunities</h3>

  {applications.length === 0 ? (

    <p className="dashboard-empty">
      You haven't applied to any opportunities yet.
    </p>

  ) : (

    applications.map((application) => (

      <div
        className="saved-item"
        key={application.id}
      >

        <div>
          <strong>{application.title}</strong>

          <small>
            {application.organization}
          </small>
        </div>

        <span>
          {application.status}
        </span>

      </div>

    ))

  )}

</div>

      <button
        className="logout-btn"
        onClick={() => {

          setLoggedInUser("");
          setLoggedInEmail("");

          setShowDashboard(false);

          localStorage.removeItem(
            "awasarNepalLoggedIn"
          );

        }}
      >
        🚪 Log out
      </button>

    </div>
  </div>
)}
{showEditProfile && (
  <div className="login-overlay">

    <div className="login-modal">

      <button
        className="login-close"
        onClick={() => setShowEditProfile(false)}
      >
        ×
      </button>

      <div className="login-logo">
        👤
      </div>

      <h2>Edit Profile</h2>

      <p>
        Update your Awasar Nepal profile information.
      </p>

      <form onSubmit={handleSaveProfile}>

        <label>👤 Full Name</label>

        <input
          type="text"
          placeholder="Enter your full name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
        />


        <label>📧 Email Address</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={editEmail}
          onChange={(e) => setEditEmail(e.target.value)}
        />


        <label>📱 Mobile Number</label>

        <input
          type="tel"
          placeholder="98XXXXXXXX"
          maxLength="10"
          value={editPhone}
          onChange={(e) => setEditPhone(e.target.value)}
        />


        <button
          type="submit"
          className="login-submit"
        >
          Save Changes →
        </button>

      </form>

    </div>
  </div>
)}
      {showLogin && (
  <div className="login-overlay">
    <div className="login-modal">

      <button
        className="login-close"
        onClick={() => setShowLogin(false)}
      >
        ×
      </button>

      <div className="login-logo">A</div>

      <h2>Welcome back 👋</h2>
      <p>Login to continue to Awasar Nepal</p>

      <div className="login-tabs">
        <button
          type="button"
          className={loginMethod === "email" ? "active" : ""}
          onClick={() => {
            setLoginMethod("email");
            setLoginMessage("");
          }}
        >
          📧 Email
        </button>

        <button
          type="button"
          className={loginMethod === "phone" ? "active" : ""}
          onClick={() => {
            setLoginMethod("phone");
            setLoginMessage("");
          }}
        >
          📱 Mobile
        </button>
      </div>

      <form onSubmit={handleLogin}>

        {loginMethod === "email" ? (
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <input
            type="tel"
            placeholder="98XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength="10"
          />
        )}

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {loginMessage && (
          <p className="login-message">{loginMessage}</p>
        )}

        <button type="submit" className="login-submit">
          Log in →
        </button>

      </form>

      <p className="login-note">
        Don't have an account? <span>Get Started</span>
      </p>

    </div>
  </div>
)}
{showSignup && (
  <div className="login-overlay">
    <div className="login-modal">

      <button
        className="login-close"
        onClick={() => setShowSignup(false)}
      >
        ×
      </button>

      <div className="login-logo">A</div>

      <h2>Create your account 🚀</h2>

      <p>Join Awasar Nepal and discover opportunities.</p>

      <form onSubmit={handleSignup}>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e)  => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
        />

        <input
          type="tel"
          placeholder="98XXXXXXXX"
          maxLength="10"
          value={signupPhone}
          onChange={(e) => setSignupPhone (e.target.value)}
        />

        <input
          type="password"
          placeholder="Create password"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit" className="login-submit">
          Create Account →
        </button>

      </form>

      <p className="login-note">
        Already have an account?{" "}
        <span
          onClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
          style={{ cursor: "pointer" }}
        >
          Log in
        </span>
      </p>

    </div>
  </div>
)}
      <footer>
        <div className="footer-logo">
          <img
  src={logo}
  alt="Awasar Nepal Logo"
  className="website-logo"
/>
          <div>
            <strong>AWASAR NEPAL</strong>
            <small>Your opportunity starts here.</small>
          </div>
        </div>
        <p>© 2026 Awasar Nepal. Made with purpose in Nepal 🇳🇵</p>
        <p>Owner Yogesh Gautam</p>
      </footer>
    </div>
  );
}

export default App;