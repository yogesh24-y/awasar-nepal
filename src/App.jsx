import { useState, useEffect } from "react";
import "./index.css";
import { supabase } from "./supabase";
import logo from "./assets/IMG-20260903-WA0000.jpg";
import founderPhoto from "./assets/yogesh.jpg";

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

  const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

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

  const [showAboutLanguage, setShowAboutLanguage] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutLanguage, setAboutLanguage] = useState(
    localStorage.getItem("awasarAboutLanguage") || "",
  );

  const [savedOpportunities, setSavedOpportunities] = useState(() => {
    const saved = localStorage.getItem("awasarNepalSavedOpportunities");

    return saved ? JSON.parse(saved) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllOpportunities, setShowAllOpportunities] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleOpportunities, setVisibleOpportunities] = useState(6);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const [showEmailPhoneModal, setShowEmailPhoneModal] = useState(false);
const [currentUserEmail, setCurrentUserEmail] = useState("");

const [showPrivacyModal, setShowPrivacyModal] = useState(false);
const [profilePrivate, setProfilePrivate] = useState(false);

const [showNotificationsModal, setShowNotificationsModal] = useState(false);
const [deadlineNotifications, setDeadlineNotifications] = useState(true);
const [opportunityNotifications, setOpportunityNotifications] = useState(true);

  const [accountMenuPage, setAccountMenuPage] = useState("main");
  const [isCheckingLogin, setIsCheckingLogin] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("awasarNepalLoggedIn");

    const savedUser = JSON.parse(localStorage.getItem("awasarNepalUser"));

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
        requirements: ["Follow the requirements provided by the organization."],
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
    const savedApplications = localStorage.getItem("awasarNepalApplications");

    return savedApplications ? JSON.parse(savedApplications) : [];
  });

  const [applicantName, setApplicantName] = useState("");

  const [applicantEmail, setApplicantEmail] = useState("");
  const [currentPage, setCurrentPage] = useState("home");

  const [exploreSearch, setExploreSearch] = useState("");
  const [exploreCategory, setExploreCategory] = useState("");
  const [exploreLocation, setExploreLocation] = useState("");

  const [showSubmitOpportunity, setShowSubmitOpportunity] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const [inviteId, setInviteId] = useState(null);
const [acceptingInvitation, setAcceptingInvitation] = useState(false);
const [invitationResult, setInvitationResult] = useState(null);

const [adminPage, setAdminPage] = useState("dashboard");
  const [opportunityFilter, setOpportunityFilter] =
  useState("pending");

  const [showInviteAdmin, setShowInviteAdmin] = useState(false);
const [inviteAdminEmail, setInviteAdminEmail] = useState("");
const [inviteAdminRole, setInviteAdminRole] = useState("Admin");

const [adminInvitations, setAdminInvitations] = useState([]);
const [loadingAdminInvitations, setLoadingAdminInvitations] = useState(false);
  const [adminFilter, setAdminFilter] = useState("pending");
  const adminEmails = [
    "yogeshgautam30664@gmail.com",
    "yogeshgautam059@gmail.com",
  ];

  const isAdmin = adminEmails.includes(loggedInEmail.toLowerCase());

  const [submittedOpportunities, setSubmittedOpportunities] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoadingSubmissions(true);

      const { data, error } = await supabase
        .from("opportunity_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading submissions:", error);
        setLoadingSubmissions(false);
        return;
      }

      const formattedSubmissions = (data || []).map((item) => ({
        ...item,
        applyLink: item.application_link,
        submittedAt: item.created_at
          ? new Date(item.created_at).toLocaleDateString()
          : "",
      }));

      setSubmittedOpportunities(formattedSubmissions);
      setLoadingSubmissions(false);
    };

    fetchSubmissions();
  }, []);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const invitationId = params.get("invite");

  if (invitationId) {
    setInviteId(invitationId);
  }
}, []);

  const loadAdminInvitations = async () => {
  try {
    setLoadingAdminInvitations(true);

    const { data, error } = await supabase
      .from("admin_invites")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin invitations load error:", error);
      return;
    }

    setAdminInvitations(data || []);
  } catch (error) {
    console.error("Admin invitations error:", error);
  } finally {
    setLoadingAdminInvitations(false);
  }
};

useEffect(() => {
  if (currentPage === "admin" && isAdmin) {
    loadAdminInvitations();
  }
}, [currentPage, isAdmin]);

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
      setLoginMessage("Mobile login is not available yet. Please use email.");
      return;
    }

    if (!email.trim() || !password.trim()) {
      setLoginMessage("Please enter your email and password.");
      return;
    }

    setLoginMessage("Logging in...");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setLoginMessage(error.message);
      return;
    }

    const userName = data.user.user_metadata?.name || data.user.email;

    setLoggedInUser(userName);
    setLoggedInEmail(data.user.email);

    localStorage.setItem("awasarNepalLoggedIn", "true");

    localStorage.setItem(
      "awasarNepalUser",
      JSON.stringify({
        name: userName,
        email: data.user.email,
      }),
    );

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
        "Your profile has been saved automatically.",
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

    const { data, error } = await supabase
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
      ])
      .select()
      .single();

    if (error) {
      console.error("Submit opportunity error:", error);

      alert("Submit Error:\n" + error.message + "\n\nCode: " + error.code);

      return;
    }

    const newSubmission = {
      ...data,
      applyLink: data.application_link,
      submittedAt: data.created_at
        ? new Date(data.created_at).toLocaleDateString()
        : new Date().toLocaleDateString(),
    };

    setSubmittedOpportunities((previous) => [newSubmission, ...previous]);

    alert(
      "Opportunity submitted successfully! It will be reviewed before publishing.",
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
    const submission = submittedOpportunities.find((item) => item.id === id);

    if (!submission) {
      alert("Submission not found.");
      return;
    }

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
          eligibility:
            "Please follow the eligibility requirements provided by the organization.",
          application_link: submission.applyLink || submission.application_link,
          image_url: null,
        },
      ]);

    if (publishError) {
      console.error("Publish opportunity error:", publishError);

      alert("Could not publish opportunity:\n" + publishError.message);

      return;
    }

    const { data: updatedSubmission, error: updateError } = await supabase
      .from("opportunity_submissions")
      .update({ status: "approved" })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Approve status update error:", updateError);

      alert(
        "Opportunity was published, but approval status could not be updated:\n" +
          updateError.message,
      );

      return;
    }

    setSubmittedOpportunities((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedSubmission,
              applyLink: updatedSubmission.application_link,
            }
          : item,
      ),
    );

    alert("Opportunity approved and published successfully! ✅");
  };

  const declineOpportunity = async (id) => {
    const { data, error } = await supabase
      .from("opportunity_submissions")
      .update({ status: "declined" })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Decline opportunity error:", error);

      alert("Could not decline opportunity:\n" + error.message);

      return;
    }

    setSubmittedOpportunities((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
              applyLink: data.application_link,
            }
          : item,
      ),
    );

    alert("Opportunity declined. ❌");
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
      eligibility: ["Check the official opportunity details for eligibility."],
      requirements: ["Follow the requirements provided by the organization."],
    }));

  const allOpportunities = [
    ...databaseOpportunities,
    ...opportunities,
    ...approvedOpportunities,
  ];

  const exploreFilteredOpportunities = allOpportunities.filter((item) => {
    const searchText = exploreSearch.toLowerCase().trim();

    const matchesSearch =
      !searchText ||
      item.title?.toLowerCase().includes(searchText) ||
      item.organization?.toLowerCase().includes(searchText) ||
      item.location?.toLowerCase().includes(searchText) ||
      item.type?.toLowerCase().includes(searchText);

    const matchesCategory =
      !exploreCategory ||
      item.type === exploreCategory ||
      item.category === exploreCategory;

    const matchesLocation =
      !exploreLocation ||
      item.location?.toLowerCase().includes(exploreLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

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
    goal,
  ) => {
    const interestText = interest.toLowerCase();
    const goalText = goal.toLowerCase();

    const scoredOpportunities = allOpportunities.map((item) => {
      let score = 0;
      const reasons = [];

      // 🎯 Category match
      if (category && item.type.toLowerCase() === category.toLowerCase()) {
        score += 40;
        reasons.push("Matches your preferred opportunity type");
      }

      // 🎓 Education match

      const itemEducation = (item.education || "Not specified").toLowerCase();

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
        (selectedLocation === "online" && itemLocation.includes("online")) ||
        (selectedLocation === "nepal" && itemLocation.includes("nepal"))
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
        opportunityText.includes(word),
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
        opportunityText.includes(word),
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
      document.getElementById("ai-results")?.scrollIntoView({
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
      (item) => item.title === opportunity.title,
    );

    if (alreadyApplied) {
      alert("You have already applied for this opportunity.");
      return;
    }

    const newApplication = {
      id: Date.now(),
      title: opportunity.title,
      organization:
        opportunity.organization || "Awasar Nepal Partner Organization",
      location: opportunity.location,
      deadline: opportunity.deadline,
      status: "Applied",
      appliedAt: new Date().toLocaleDateString(),
    };

    const updatedApplications = [...applications, newApplication];

    setApplications(updatedApplications);

    localStorage.setItem(
      "awasarNepalApplications",
      JSON.stringify(updatedApplications),
    );

    alert("Application added to your tracker successfully! 🎉");
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

    localStorage.setItem("awasarNepalUser", JSON.stringify(updatedUser));

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
      item.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });
  const openSavedOpportunity = (title) => {
    const opportunity = allOpportunities.find((item) => item.title === title);

    if (opportunity) {
      setShowDashboard(false);

      setSelectedOpportunity(getCompleteOpportunity(opportunity));
    }
  };
  const toggleSave = (title) => {
    setSavedOpportunities((previous) => {
      const updatedSaved = previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title];

      localStorage.setItem(
        "awasarNepalSavedOpportunities",
        JSON.stringify(updatedSaved),
      );

      return updatedSaved;
    });
  };
  return (

    <div className="app">
{inviteId && (
  <div className="invitation-accept-page">

    <div className="invitation-accept-card">

      <div className="invitation-accept-icon">
        📩
      </div>

      <span className="invitation-accept-label">
        AWASAR NEPAL
      </span>

      <h1>You’ve been invited</h1>

      <p>
        You have been invited to help manage Awasar Nepal.
        Sign in with the invited email address to continue.
      </p>

      <button
        className="invitation-accept-btn"
        onClick={() => {
          setShowLogin(true);
        }}
      >
        Sign In & Accept →
      </button>

      <small>
        🔐 Secure invitation · Role-based access
      </small>

    </div>

  </div>
)}
      {showAboutLanguage && (
  <div className="about-language-overlay">

    <div className="about-language-bg-circle circle-one"></div>
    <div className="about-language-bg-circle circle-two"></div>
    <div className="about-language-bg-circle circle-three"></div>

    <div className="about-language-modal">
<div className="about-language-topbar">

  <button
    className="about-language-back"
    onClick={() => {
      setShowAboutLanguage(false);
      window.scrollTo(0, 0);
    }}
  >
    ← Back
  </button>

  <button
    className="about-language-close"
    onClick={() => setShowAboutLanguage(false)}
    aria-label="Close"
  >
    ×
  </button>

</div>

      <div className="about-language-brand">
        <div className="about-language-icon">
          🌐
        </div>

        <div>
          <strong>AWASAR NEPAL</strong>
          <span>Opportunity for everyone</span>
        </div>
      </div>

      <div className="about-language-heading">
        <span className="about-language-label">
          ABOUT AWASAR NEPAL
        </span>

        <h2>Choose your language</h2>

        <p>
          आफ्नो सुविधाअनुसार भाषा छान्नुहोस्
        </p>

        <small>
          Select your preferred language to continue.
        </small>
      </div>

      <div className="about-language-options">

        {/* ENGLISH */}

        <button
          className={`about-language-option ${
            aboutLanguage === "english" ? "selected" : ""
          }`}
          onClick={() => setAboutLanguage("english")}
        >
          <div className="language-option-left">

            <div className="language-flag">
              🇬🇧
            </div>

            <div className="language-option-text">
              <h3>English</h3>
              <p>Continue in English</p>
            </div>

          </div>

          <div className="language-radio">
            {aboutLanguage === "english" && "✓"}
          </div>
        </button>


        {/* NEPALI */}

        <button
          className={`about-language-option ${
            aboutLanguage === "nepali" ? "selected" : ""
          }`}
          onClick={() => setAboutLanguage("nepali")}
        >
          <div className="language-option-left">

            <div className="language-flag">
              🇳🇵
            </div>

            <div className="language-option-text">
              <h3>नेपाली</h3>
              <p>नेपालीमा जारी राख्नुहोस्</p>
            </div>

          </div>

          <div className="language-radio">
            {aboutLanguage === "nepali" && "✓"}
          </div>
        </button>

      </div>


      <button
        className="about-language-continue"
        disabled={!aboutLanguage}
        onClick={() => {

          localStorage.setItem(
            "awasarAboutLanguage",
            aboutLanguage
          );

          setShowAboutLanguage(false);

          setCurrentPage("about");

          window.scrollTo(0, 0);
        }}
      >
        <span>
          Continue
        </span>

        <span className="continue-arrow">
          →
        </span>
      </button>


      <div className="about-language-footer">

        <span>🔒</span>

        <p>
          You can change your language anytime.
        </p>

      </div>

    </div>
  </div>
)}

      <header className="navbar">
        <a className="logo" href="#home">
          <img src={logo} alt="Awasar Nepal Logo" className="website-logo" />

          <span>
            <strong>AWASAR</strong>
            <small>NEPAL</small>
          </span>
        </a>

        <button
  className="mobile-menu-btn"
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  aria-label="Open menu"
>
  {mobileMenuOpen ? "×" : "☰"}
</button>

         <nav className={`nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>

 <a
  href="#home"
  onClick={(e) => {
    e.preventDefault();
    setCurrentPage("home");
    setMobileMenuOpen(false);

    setTimeout(() => {
      document.getElementById("home")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  }}
>
  🏠 Home
</a>

  <a
    href="#opportunities"
    onClick={() => setMobileMenuOpen(false)}
  >
    🔎 Opportunities
  </a>

  <a
    href="#categories"
    onClick={() => setMobileMenuOpen(false)}
  >
    📂 Categories
  </a>

  <a
    href="#premium"
    onClick={() => setMobileMenuOpen(false)}
  >
    ⭐ Premium
  </a>

  <button
    className="nav-about-btn"
    onClick={() => {
      setShowAboutLanguage(true);
      setMobileMenuOpen(false);
    }}
  >
    ℹ️ About
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
  onClick={() => {
  setAdminPage("dashboard");
  setCurrentPage("admin");
}}
  title="Admin Panel"
  aria-label="Admin Panel"
>
  <span className="admin-icon">👑</span>
  <span className="admin-text">Admin</span>
</button>
          )}

          {loggedInUser ? (
            <div className="user-menu-container">

              <button
  className="user-btn"
  onClick={() => {
  setShowUserMenu(!showUserMenu);
  setAccountMenuPage("main");
}}
  title={loggedInUser}
>
  <span className="user-avatar">
    👤
  </span>

  <span className="user-name">
    {loggedInUser}
  </span>

  <span className="user-arrow">
    ⌄
  </span>
</button>

{showUserMenu && (
  <div className="user-dropdown">

    {/* MAIN ACCOUNT MENU */}
   <div className="account-menu-main">

  {/* =========================
      MAIN MENU
  ========================== */}
  {accountMenuPage === "main" && (
    <>
      <button
        className="account-menu-item"
        onClick={() => setAccountMenuPage("dashboard")}
      >
        <span className="account-menu-icon">👤</span>
        <span className="account-menu-label">My Dashboard</span>
        <span className="account-menu-arrow">›</span>
      </button>

      <button
        className="account-menu-item"
        onClick={() => setAccountMenuPage("settings")}
      >
        <span className="account-menu-icon">⚙️</span>
        <span className="account-menu-label">Settings & Privacy</span>
        <span className="account-menu-arrow">›</span>
      </button>

      <button
        className="account-menu-item"
        onClick={() => setAccountMenuPage("help")}
      >
        <span className="account-menu-icon">❓</span>
        <span className="account-menu-label">Help & Support</span>
        <span className="account-menu-arrow">›</span>
      </button>

      <button
        className="account-menu-item"
        onClick={() => setAccountMenuPage("display")}
      >
        <span className="account-menu-icon">🖥️</span>
        <span className="account-menu-label">
          Display & Accessibility
        </span>
        <span className="account-menu-arrow">›</span>
      </button>

      <button
        className="account-menu-item"
        onClick={() => setAccountMenuPage("feedback")}
      >
        <span className="account-menu-icon">💬</span>
        <span className="account-menu-label">Give Feedback</span>
        <span className="account-menu-arrow">›</span>
      </button>

      <div className="account-menu-divider"></div>

      <button
        className="account-menu-item account-menu-logout"
        onClick={() => {
          setLoggedInUser("");
          setLoggedInEmail("");

          localStorage.removeItem("awasarNepalLoggedIn");
          localStorage.removeItem("awasarNepalUser");

          setShowUserMenu(false);
          setAccountMenuPage("main");

          alert("You have been logged out.");
        }}
      >
        <span className="account-menu-icon">🚪</span>
        <span className="account-menu-label">Log Out</span>
      </button>
    </>
  )}


  {/* =========================
      GIVE FEEDBACK
  ========================== */}
  {accountMenuPage === "feedback" && (
    <>
      <div className="account-submenu-header">
        <button
          className="account-submenu-back"
          onClick={() => setAccountMenuPage("main")}
        >
          ←
        </button>

        <span className="account-submenu-title">
          💬 Give Feedback
        </span>
      </div>

      <div className="account-submenu-list">

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowUserMenu(false);
            setAccountMenuPage("main");
            alert("Rate Your Experience is coming soon.");
          }}
        >
          <span>⭐</span>
          <span>Rate Your Experience</span>
        </button>

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowUserMenu(false);
            setAccountMenuPage("main");
            alert("Suggest a Feature is coming soon.");
          }}
        >
          <span>💡</span>
          <span>Suggest a Feature</span>
        </button>

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowUserMenu(false);
            setAccountMenuPage("main");
            alert("Report a Bug is coming soon.");
          }}
        >
          <span>🐛</span>
          <span>Report a Bug</span>
        </button>

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowUserMenu(false);
            setAccountMenuPage("main");
            alert("General Feedback is coming soon.");
          }}
        >
          <span>💬</span>
          <span>General Feedback</span>
        </button>

      </div>
    </>
  )}


  {/* =========================
      DASHBOARD
  ========================== */}
  {accountMenuPage === "dashboard" && (
    <>
      <div className="account-submenu-header">
        <button
          className="account-submenu-back"
          onClick={() => setAccountMenuPage("main")}
        >
          ←
        </button>

        <span className="account-submenu-title">
          👤 My Dashboard
        </span>
      </div>

      <div className="account-submenu-list">

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowEditProfile(true);
            setShowUserMenu(false);
            setAccountMenuPage("main");
          }}
        >
          <span>✏️</span>
          <span>Edit Profile</span>
        </button>

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowUserMenu(false);
            alert("Saved Opportunities is coming soon.");
          }}
        >
          <span>❤️</span>
          <span>Saved Opportunities</span>
        </button>

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowUserMenu(false);
            alert("My Applications is coming soon.");
          }}
        >
          <span>📋</span>
          <span>My Applications</span>
        </button>

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowUserMenu(false);
            alert("Recently Viewed is coming soon.");
          }}
        >
          <span>🕐</span>
          <span>Recently Viewed</span>
        </button>

        <button
          className="account-submenu-item"
          onClick={() => {
            setShowUserMenu(false);
            alert("My Deadline Alerts is coming soon.");
          }}
        >
          <span>🔔</span>
          <span>My Deadline Alerts</span>
        </button>

      </div>
    </>
  )}


{/* =========================
    SETTINGS & PRIVACY
========================== */}
{accountMenuPage === "settings" && (
  <>
    <div className="account-submenu-header">
      <button
        className="account-submenu-back"
        onClick={() => setAccountMenuPage("main")}
      >
        ←
      </button>

      <span className="account-submenu-title">
        ⚙️ Settings & Privacy
      </span>
    </div>

    <div className="account-submenu-list">

      <button
        className="account-submenu-item"
        onClick={() => setAccountMenuPage("security")}
      >
        <span>🔐</span>
        <span>Account & Security</span>
        <span className="account-menu-arrow">›</span>
      </button>

      <button
  className="account-submenu-item"
  onClick={() => {
    setShowUserMenu(false);
    setShowPrivacyModal(true);
  }}
>
  <span>👤</span>
  <span>Profile Privacy</span>
  <span className="account-menu-arrow">›</span>
</button>

      <button
  className="account-submenu-item"
  onClick={() => {
    setShowUserMenu(false);
    setShowNotificationsModal(true);
  }}
>
  <span>🔔</span>
  <span>Notifications</span>
  <span className="account-menu-arrow">›</span>
</button>

      <button
        className="account-submenu-item"
        onClick={() => setAccountMenuPage("account-management")}
      >
        <span>🗑️</span>
        <span>Account Management</span>
        <span className="account-menu-arrow">›</span>
      </button>

    </div>
  </>
)}
{/* =========================
    ACCOUNT & SECURITY
========================== */}
{accountMenuPage === "security" && (
  <>
    <div className="account-submenu-header">
      <button
        className="account-submenu-back"
        onClick={() => setAccountMenuPage("settings")}
      >
        ←
      </button>

      <span className="account-submenu-title">
        🔐 Account & Security
      </span>
    </div>

    <div className="account-submenu-list">

      <button
  className="account-submenu-item"
  onClick={() => {
    setShowUserMenu(false);
    setShowPasswordModal(true);
  }}
>
  <span>🔑</span>
  <span>Change Password</span>
</button>

     <button
  className="account-submenu-item"
  onClick={async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    setCurrentUserEmail(user.email || "");
    setShowUserMenu(false);
    setShowEmailPhoneModal(true);
  }}
>
  <span>📧</span>
  <span>Email & Phone</span>
  <span className="account-menu-arrow">›</span>
</button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Login & Security settings are coming soon.");
        }}
      >
        <span>🔒</span>
        <span>Login & Security</span>
      </button>

    </div>
  </>
)}
{/* =========================
    PROFILE PRIVACY
========================== */}
{accountMenuPage === "privacy" && (
  <>
    <div className="account-submenu-header">
      <button
        className="account-submenu-back"
        onClick={() => setAccountMenuPage("settings")}
      >
        ←
      </button>

      <span className="account-submenu-title">
        👤 Profile Privacy
      </span>
    </div>

    <div className="account-submenu-list">

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Profile Visibility settings are coming soon.");
        }}
      >
        <span>👁️</span>
        <span>Profile Visibility</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Personal Information settings are coming soon.");
        }}
      >
        <span>🪪</span>
        <span>Personal Information</span>
      </button>

    </div>
  </>
)}
{/* =========================
    NOTIFICATIONS
========================== */}
{accountMenuPage === "notifications" && (
  <>
    <div className="account-submenu-header">
      <button
        className="account-submenu-back"
        onClick={() => setAccountMenuPage("settings")}
      >
        ←
      </button>

      <span className="account-submenu-title">
        🔔 Notifications
      </span>
    </div>

    <div className="account-submenu-list">

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Opportunity Alerts settings are coming soon.");
        }}
      >
        <span>🎯</span>
        <span>Opportunity Alerts</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Application Updates settings are coming soon.");
        }}
      >
        <span>📋</span>
        <span>Application Updates</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Email Notifications settings are coming soon.");
        }}
      >
        <span>📧</span>
        <span>Email Notifications</span>
      </button>

    </div>
  </>
)}
{/* =========================
    ACCOUNT MANAGEMENT
========================== */}
{accountMenuPage === "account-management" && (
  <>
    <div className="account-submenu-header">
      <button
        className="account-submenu-back"
        onClick={() => setAccountMenuPage("settings")}
      >
        ←
      </button>

      <span className="account-submenu-title">
        🗑️ Account Management
      </span>
    </div>

    <div className="account-submenu-list">

      <button
  className="account-submenu-item"
  onClick={async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const accountData = {
      account: {
        email: user.email || "",
        userId: user.id || "",
        createdAt: user.created_at || "",
      },
      profile: user.user_metadata || {},
    };

    const fileContent = JSON.stringify(accountData, null, 2);

    const blob = new Blob([fileContent], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "awasar-nepal-my-data.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setShowUserMenu(false);

    alert("Your Awasar Nepal account data has been downloaded.");
  }}
>
  <span>⬇️</span>
  <span>Download My Data</span>
</button>
<button
  className="account-submenu-item account-menu-danger"
  onClick={() => {
    setShowUserMenu(false);
    setShowDeleteAccountModal(true);
  }}
>
  <span>🗑️</span>
  <span>Delete Account</span>
</button>
     
    </div>
  </>
)}

{/* =========================
    HELP & SUPPORT
========================== */}
{accountMenuPage === "help" && (
  <>
    <div className="account-submenu-header">
      <button
        className="account-submenu-back"
        onClick={() => setAccountMenuPage("main")}
      >
        ←
      </button>

      <span className="account-submenu-title">
        ❓ Help & Support
      </span>
    </div>

    <div className="account-submenu-list">

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Help Center is coming soon.");
        }}
      >
        <span>❓</span>
        <span>Help Center</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Frequently Asked Questions are coming soon.");
        }}
      >
        <span>📖</span>
        <span>Frequently Asked Questions (FAQ)</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Contact Support is coming soon.");
        }}
      >
        <span>📩</span>
        <span>Contact Support</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Report a Problem is coming soon.");
        }}
      >
        <span>🐛</span>
        <span>Report a Problem</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("How Awasar Nepal Works is coming soon.");
        }}
      >
        <span>📚</span>
        <span>How Awasar Nepal Works</span>
      </button>

    </div>
  </>
)}
{/* =========================
    DISPLAY & ACCESSIBILITY
========================== */}
{accountMenuPage === "display" && (
  <>
    <div className="account-submenu-header">
      <button
        className="account-submenu-back"
        onClick={() => setAccountMenuPage("main")}
      >
        ←
      </button>

      <span className="account-submenu-title">
        🖥️ Display & Accessibility
      </span>
    </div>

    <div className="account-submenu-list">

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Appearance settings are coming soon.");
        }}
      >
        <span>🌙</span>
        <span>Appearance</span>
        <span className="account-menu-arrow">›</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Language settings are coming soon.");
        }}
      >
        <span>🌐</span>
        <span>Language</span>
        <span className="account-menu-arrow">›</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Text Size settings are coming soon.");
        }}
      >
        <span>🔤</span>
        <span>Text Size</span>
        <span className="account-menu-arrow">›</span>
      </button>

      <button
        className="account-submenu-item"
        onClick={() => {
          setShowUserMenu(false);
          alert("Accessibility settings are coming soon.");
        }}
      >
        <span>♿</span>
        <span>Accessibility</span>
        <span className="account-menu-arrow">›</span>
      </button>

    </div>
  </>
 )}
         </div>
       </div>
)}

{showDeleteAccountModal && (
  <div className="delete-account-overlay">

    <div className="delete-account-modal">

      <div className="delete-account-header">

        <div className="delete-account-icon">
          🗑️
        </div>

        <button
          className="delete-account-close"
          onClick={() => setShowDeleteAccountModal(false)}
          aria-label="Close"
        >
          ×
        </button>

      </div>

      <div className="delete-account-body">

        <h3>Delete Account</h3>

        <p className="delete-account-warning">
          Are you sure you want to delete your Awasar Nepal account?
        </p>

        <div className="delete-account-info">
          <span>⚠️</span>

          <p>
            Account deletion is a permanent action. Your account
            information may no longer be available after deletion.
          </p>
        </div>

        <div className="delete-account-actions">

          <button
            type="button"
            className="delete-account-cancel"
            onClick={() => setShowDeleteAccountModal(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            className="delete-account-confirm"
            onClick={() => {
              alert(
                "Account deletion is not available yet. Your account has not been deleted."
              );
            }}
          >
            Delete Account
          </button>

        </div>

      </div>

    </div>

  </div>
)}

      {showPasswordModal && (
  <div className="password-modal-overlay">
    <div className="email-phone-modal">

      <div className="email-phone-modal-header">
        <div>
          <h3>🔐 Change Password</h3>
          <p>Update your password to keep your account secure.</p>
        </div>

        <button
          className="password-modal-close"
          onClick={() => setShowPasswordModal(false)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="password-form-group">
        <label>New Password</label>

        <div className="password-input-wrapper">
          
<input
  type={showNewPassword ? "text" : "password"}
  placeholder="Enter new password"
  className="password-modal-input"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
/>
          <button
  type="button"
  className="password-eye-btn"
  onClick={() => setShowNewPassword(!showNewPassword)}
  aria-label={showNewPassword ? "Hide password" : "Show password"}
>
  {showNewPassword ? "🙈" : "👁"}
</button>

        </div>
      </div>

      <div className="password-form-group">
        <label>Confirm New Password</label>

        <div className="password-input-wrapper">

        <input
  type={showConfirmPassword ? "text" : "password"}
  placeholder="Confirm new password"
  className="password-modal-input"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
/>  
          <button
  type="button"
  className="password-eye-btn"
  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
>
  {showConfirmPassword ? "🙈" : "👁"}
</button>
        </div>
      </div>

      <p className="password-requirement">
        Password must be at least 6 characters.
      </p>

      <button
  className="password-modal-save"
  onClick={async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please enter and confirm your new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password changed successfully!");

    setNewPassword("");
    setConfirmPassword("");
    setShowPasswordModal(false);
  }}
>
  Change Password
</button>
        
      <button
        type="button"
        className="password-modal-cancel"
        onClick={() => setShowPasswordModal(false)}
      >
        Cancel
      </button>

    </div>
  </div>
)}

            </div>
          ) : (
            <>
              <button className="login-btn" onClick={() => setShowLogin(true)}>
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
                Scholarships, jobs, internships, training, competitions and more
                — discover opportunities that match your goals.
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

              <div className="hero-actions">
                <button
                  className="hero-primary-btn"
                  onClick={() => setCurrentPage("opportunities")}
                >
                  🔎 Explore Opportunities
                </button>

                <button
                  className="hero-secondary-btn"
                  onClick={() => setShowAIFinder(true)}
                >
                  🤖 Find My Opportunity
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
                left: "6%",
              }}
            ></div>

            <div
              className="awasar-particle blue"
              style={{
                top: "28%",
                right: "8%",
                animationDelay: "2s",
              }}
            ></div>

            <div
              className="awasar-particle gold"
              style={{
                bottom: "25%",
                left: "10%",
                animationDelay: "4s",
              }}
            ></div>

            <div
              className="awasar-particle blue"
              style={{
                bottom: "10%",
                right: "15%",
                animationDelay: "6s",
              }}
            ></div>
            <div className="section-heading">
              <div>
                <span className="eyebrow">DISCOVER</span>
                <h2>Opportunities for you</h2>
              </div>
              <button
                className="explore-all-btn"
                onClick={() => setShowAllOpportunities(!showAllOpportunities)}
              >
                {showAllOpportunities ? "Show Less ↑" : "Explore All →"}
              </button>
            </div>

            <div className="filters">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="SCHOLARSHIP">Scholarships</option>
                <option value="JOB">Jobs</option>
                <option value="INTERNSHIP">Internships</option>
                <option value="TRAINING">Training</option>
                <option value="COMPETITION">Competitions</option>
                <option value="BUSINESS">Business</option>
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
                <span className="premium-badge">🤖 AI POWERED MATCHING</span>

                <h2>Opportunities matched for you.</h2>

                <p>
                  Based on your education, location, interests and goals, here
                  are your best matches.
                </p>
              </div>

              <div className="ai-results-grid">
                {aiResults.map((item, index) => (
                  <article
                    className="ai-result-card"
                    key={item.id || item.title}
                  >
                    <div className="ai-result-top">
                      <div className="ai-result-icon">{item.icon}</div>

                      <span className="ai-match-score">
                        {item.aiScore}% Match
                      </span>
                    </div>

                    <span className="opportunity-type">{item.type}</span>

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

                      {item.aiReasons.slice(0, 3).map((reason, reasonIndex) => (
                        <span key={reasonIndex}>✓ {reason}</span>
                      ))}
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
                left: "10%",
              }}
            ></div>

            <div
              className="awasar-particle red"
              style={{
                top: "35%",
                right: "8%",
                animationDelay: "3s",
              }}
            ></div>

            <div
              className="awasar-particle gold"
              style={{
                bottom: "20%",
                left: "20%",
                animationDelay: "5s",
              }}
            ></div>

            <div
              className="awasar-particle blue"
              style={{
                bottom: "12%",
                right: "18%",
                animationDelay: "7s",
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

                <p>Get helpful feedback to improve your CV and resume.</p>

                <span className="premium-status">Coming Soon</span>
              </article>

              <article className="premium-card">
                <div className="premium-icon">🎯</div>

                <h3>Personalized Matches</h3>

                <p>Get opportunity recommendations based on your interests.</p>

                <span className="premium-status">Coming Soon</span>
              </article>

              <article className="premium-card">
                <div className="premium-icon">❤️</div>

                <h3>Saved Opportunities</h3>

                <p>Save opportunities and keep track of the ones you love.</p>

                <strong className="saved-count">
                  {savedOpportunities.length} Saved
                </strong>
              </article>
            </div>

            <div className="premium-bottom">
              <h3>More powerful features are coming soon 🚀</h3>

              <button>Get Premium</button>
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
        ) : currentPage === "admin" ? (

  <main className="admin-dashboard-page">

    {/* Admin Sidebar */}
    <aside className="admin-sidebar">

      <div className="admin-sidebar-brand">
        <div className="admin-brand-icon">👑</div>

        <div>
          <strong>AWASAR</strong>
          <span>ADMIN</span>
        </div>
      </div>

      <div className="admin-sidebar-menu">

        <button
          className={adminPage === "dashboard" ? "active" : ""}
          onClick={() => setAdminPage("dashboard")}
        >
          📊
          <span>Dashboard</span>
        </button>

        <button
          className={adminPage === "opportunities" ? "active" : ""}
          onClick={() => setAdminPage("opportunities")}
        >
          🎯
          <span>Opportunities</span>
        </button>

        <button
          className={adminPage === "team" ? "active" : ""}
          onClick={() => setAdminPage("team")}
        >
          👥
          <span>Team & Access</span>
        </button>

        <button
          className={adminPage === "invitations" ? "active" : ""}
          onClick={() => setAdminPage("invitations")}
        >
          📩
          <span>Invitations</span>
        </button>

        <button
          className={adminPage === "settings" ? "active" : ""}
          onClick={() => setAdminPage("settings")}
        >
          ⚙️
          <span>Settings</span>
        </button>

      </div>

      <button
        className="admin-back-website"
        onClick={() => {
          setCurrentPage("home");
          window.scrollTo(0, 0);
        }}
      >
        ← Back to Website
      </button>

    </aside>


    {/* Admin Main Content */}
    <section className="admin-main-content">

      <div className="admin-topbar">

        <div>
          <span className="admin-eyebrow">
            AWASAR NEPAL CONTROL CENTER
          </span>

          <h1>
            {adminPage === "dashboard" && "Admin Dashboard"}
            {adminPage === "opportunities" && "Opportunity Management"}
            {adminPage === "team" && "Team & Access"}
            {adminPage === "invitations" && "Admin Invitations"}
            {adminPage === "settings" && "Admin Settings"}
          </h1>

          <p>
            Manage Awasar Nepal from one secure workspace.
          </p>
        </div>

        <div className="admin-user-badge">
          <span>👑</span>

          <div>
            <strong>{loggedInUser || "Admin"}</strong>
            <small>Owner</small>
          </div>
        </div>

      </div>


      {/* Dashboard */}
      {adminPage === "dashboard" && (

        <div className="admin-dashboard-content">

          <div className="admin-welcome-card">

            <div>
              <span>WELCOME BACK 👋</span>

              <h2>
                Awasar Nepal Control Center
              </h2>

              <p>
                Monitor opportunities, submissions and your
                administration team from here.
              </p>
            </div>

            <div className="admin-welcome-icon">
              🇳🇵
            </div>

          </div>


          <div className="admin-overview-grid">

            <div className="admin-overview-card">
              <span className="overview-icon">🎯</span>

              <div>
                <small>Total Opportunities</small>
                <strong>{allOpportunities.length}</strong>
              </div>
            </div>


            <div className="admin-overview-card">
              <span className="overview-icon">🟡</span>

              <div>
                <small>Pending Submissions</small>
                <strong>
                  {
                    submittedOpportunities.filter(
                      (item) => item.status === "pending"
                    ).length
                  }
                </strong>
              </div>
            </div>


            <div className="admin-overview-card">
              <span className="overview-icon">✅</span>

              <div>
                <small>Published</small>
                <strong>
                  {
                    submittedOpportunities.filter(
                      (item) => item.status === "approved"
                    ).length
                  }
                </strong>
              </div>
            </div>


            <div className="admin-overview-card">
              <span className="overview-icon">👥</span>

              <div>
                <small>Admin Invitations</small>
                <strong>
                  {
                    adminInvitations.filter(
                      (invite) => invite.status === "pending"
                    ).length
                  }
                </strong>
              </div>
            </div>

          </div>


          <div className="admin-dashboard-grid">

            <div className="admin-panel-card">

              <div className="admin-card-heading">

                <div>
                  <span>CONTENT</span>
                  <h3>Opportunity Management</h3>
                </div>

                <button
                  onClick={() => setAdminPage("opportunities")}
                >
                  View All →
                </button>

              </div>

              <p>
                Review submitted opportunities and manage
                published content.
              </p>

            </div>


            <div className="admin-panel-card">

              <div className="admin-card-heading">

                <div>
                  <span>TEAM</span>
                  <h3>Team & Access</h3>
                </div>

                <button
                  onClick={() => setAdminPage("team")}
                >
                  Manage →
                </button>

              </div>

              <p>
                Control Admin and Editor access to Awasar Nepal.
              </p>

            </div>

          </div>

        </div>

      )}


      {/* Opportunities */}
      {adminPage === "opportunities" && (

        <div className="admin-section-page">

          <div className="admin-section-title">

            <div>
              <span>CONTENT MANAGEMENT</span>

              <h2>Opportunity Management</h2>

              <p>
                Review and manage opportunities submitted to
                Awasar Nepal.
              </p>
              <div className="admin-opportunity-tabs">

  <button
    className={
      opportunityFilter === "pending"
        ? "active"
        : ""
    }
    onClick={() => setOpportunityFilter("pending")}
  >
    🟡 Pending
    <span>
      {
        submittedOpportunities.filter(
          (item) => item.status === "pending"
        ).length
      }
    </span>
  </button>

  <button
    className={
      opportunityFilter === "approved"
        ? "active"
        : ""
    }
    onClick={() => setOpportunityFilter("approved")}
  >
    ✅ Approved
    <span>
      {
        submittedOpportunities.filter(
          (item) => item.status === "approved"
        ).length
      }
    </span>
  </button>

  <button
    className={
      opportunityFilter === "declined"
        ? "active"
        : ""
    }
    onClick={() => setOpportunityFilter("declined")}
  >
    ❌ Declined
    <span>
      {
        submittedOpportunities.filter(
          (item) => item.status === "declined"
        ).length
      }
    </span>
  </button>

</div>

<div className="admin-opportunity-list">

  {submittedOpportunities
    .filter(
      (item) => item.status === opportunityFilter
    )
    .length === 0 ? (

    <div className="admin-empty-opportunities">
      <div>📭</div>
      <h3>
        No {opportunityFilter} opportunities
      </h3>
      <p>
        There are currently no opportunities in this
        section.
      </p>
    </div>

  ) : (

    submittedOpportunities
      .filter(
        (item) => item.status === opportunityFilter
      )
      .map((item) => (

        <div
          className="admin-opportunity-card"
          key={item.id}
        >

          <div className="admin-opportunity-icon">
            {item.icon || "📌"}
          </div>

          <div className="admin-opportunity-info">

            <div className="admin-opportunity-top">

              <span className="admin-opportunity-category">
                {item.category || item.type || "OPPORTUNITY"}
              </span>

              <span
                className={
                  "admin-status-badge " +
                  opportunityFilter
                }
              >
                {opportunityFilter.toUpperCase()}
              </span>

            </div>

            <h3>
              {item.title}
            </h3>

            <p>
              {item.organization ||
                "Organization not specified"}
            </p>

            <div className="admin-opportunity-meta">

              <span>
                📍 {item.location || "Nepal"}
              </span>

              <span>
                📅 {item.deadline || "No deadline"}
              </span>

            </div>

          </div>

          <div className="admin-opportunity-actions">

            <button
              className="admin-view-btn"
              onClick={() => {
                setSelectedOpportunity(item);
              }}
            >
              View
            </button>

            {opportunityFilter === "pending" && (
              <>
                <button
                  className="admin-approve-btn"
                  onClick={() => approveOpportunity(item.id)}
                >
                  ✓ Approve
                </button>

                <button
                  className="admin-decline-btn"
                  onClick={() => declineOpportunity(item.id)}
                >
                  Decline
                </button>
              </>
            )}

          </div>

        </div>

      ))

  )}

</div>
            </div>

            <button
              className="admin-primary-action"
              onClick={() => setAdminPage("dashboard")}
            >
              ← Dashboard
            </button>

          </div>


    

      </div>

      )}


      {/* Team */}
      {adminPage === "team" && (

        <div className="admin-section-page">

          <div className="admin-section-title">

            <div>
              <span>TEAM & ACCESS</span>

              <h2>Admin Management</h2>

              <p>
                Manage administrators and their permissions.
              </p>
            </div>

            <button
              className="admin-primary-action"
              onClick={() => setShowInviteAdmin(true)}
            >
              + Invite Admin
            </button>

          </div>


          <div className="admin-role-grid">

            <div className="admin-role-card owner-role">
              <span>👑</span>

              <h3>Owner</h3>

              <p>
                Full access to the entire Awasar Nepal
                administration system.
              </p>

              <strong>FULL ACCESS</strong>
            </div>


            <div className="admin-role-card">
              <span>🛡️</span>

              <h3>Admin</h3>

              <p>
                Full management of opportunities and
                submissions.
              </p>

              <strong>FULL MANAGEMENT</strong>
            </div>


            <div className="admin-role-card">
              <span>✏️</span>

              <h3>Editor</h3>

              <p>
                Create and edit opportunity content without
                access to team security settings.
              </p>

              <strong>CONTENT MANAGEMENT</strong>
            </div>

          </div>


          <div className="admin-team-panel">

            <div className="admin-team-heading">

              <div>
                <span>ACCESS CONTROL</span>
                <h3>Current Team</h3>
              </div>

            </div>

            <div className="admin-member-card">

              <div className="admin-member-avatar">
                👑
              </div>

              <div className="admin-member-info">
                <strong>Website Owner</strong>
                <span>Owner · Full Access</span>
              </div>

              <span className="admin-role-badge owner-badge">
                OWNER
              </span>

            </div>

          </div>

        </div>

      )}


      {/* Invitations */}
      {adminPage === "invitations" && (

        <div className="admin-section-page">

          <div className="admin-section-title">

            <div>
              <span>TEAM & ACCESS</span>

              <h2>Admin Invitations</h2>

              <p>
                Invite trusted people to help manage Awasar Nepal.
              </p>
            </div>

            <button
              className="admin-primary-action"
              onClick={() => setShowInviteAdmin(true)}
            >
              + Invite Admin
            </button>

          </div>


          <div className="admin-invitation-list-page">

  <div className="admin-invitation-summary">
    <div>
      <span className="invitation-summary-icon">📩</span>
      <div>
        <small>Pending Invitations</small>
        <strong>
          {
            adminInvitations.filter(
              (invite) => invite.status === "pending"
            ).length
          }
        </strong>
      </div>
    </div>

    <div>
      <span className="invitation-summary-icon">✅</span>
      <div>
        <small>Accepted</small>
        <strong>
          {
            adminInvitations.filter(
              (invite) => invite.status === "accepted"
            ).length
          }
        </strong>
      </div>
    </div>

    <div>
      <span className="invitation-summary-icon">❌</span>
      <div>
        <small>Cancelled</small>
        <strong>
          {
            adminInvitations.filter(
              (invite) => invite.status === "cancelled"
            ).length
          }
        </strong>
      </div>
    </div>
  </div>

  <div className="admin-invitation-table-card">

    <div className="admin-invitation-table-heading">
      <div>
        <span>INVITATION MANAGEMENT</span>
        <h3>All Invitations</h3>
      </div>
    </div>

    {adminInvitations.length === 0 ? (

      <div className="admin-empty-opportunities">
        <div>📭</div>
        <h3>No invitations yet</h3>
        <p>
          Create an invitation to add someone to your
          Awasar Nepal administration team.
        </p>
      </div>

    ) : (

      <div className="admin-invitation-list">

        {adminInvitations.map((invite) => (

          <div
            className="admin-invitation-row"
            key={invite.id}
          >

            <div className="admin-invitation-avatar">
              {invite.role === "admin" ? "🛡️" : "✏️"}
            </div>

            <div className="admin-invitation-details">

              <strong>{invite.email}</strong>

              <span>
                {invite.role === "admin"
                  ? "Admin · Full Management"
                  : "Editor · Content Management"}
              </span>

              <small>
                Created{" "}
                {invite.created_at
                  ? new Date(
                      invite.created_at
                    ).toLocaleDateString()
                  : "Recently"}
              </small>

            </div>

            <span
              className={
                "admin-invitation-status " +
                invite.status
              }
            >
              {invite.status}
            </span>

            {invite.status === "pending" && (

              <button
                className="admin-cancel-invitation-btn"
                onClick={async () => {

                  const confirmed = window.confirm(
                    "Cancel this invitation?"
                  );

                  if (!confirmed) return;

                  const { error } = await supabase
                    .from("admin_invites")
                    .update({
                      status: "cancelled",
                    })
                    .eq("id", invite.id);

                  if (error) {
                    console.error(
                      "Cancel invitation error:",
                      error
                    );

                    alert(
                      `Could not cancel invitation:\n${error.message}`
                    );

                    return;
                  }

                  setAdminInvitations((prev) =>
                    prev.map((item) =>
                      item.id === invite.id
                        ? {
                            ...item,
                            status: "cancelled",
                          }
                        : item
                    )
                  );

                }}
              >
                Cancel
              </button>

            )}

          </div>

        ))}

      </div>

    )}

  </div>

</div>

        </div>

      )}


      {/* Settings */}
      {adminPage === "settings" && (

        <div className="admin-section-page">

          <div className="admin-section-title">

            <div>
              <span>SYSTEM</span>

              <h2>Admin Settings</h2>

              <p>
                Manage administration preferences and security.
              </p>
            </div>

          </div>


          <div className="admin-settings-card">

            <div>
              <strong>🔐 Security</strong>

              <p>
                Admin access is protected by Supabase
                authentication and role-based permissions.
              </p>
            </div>

            <span className="settings-status">
              Protected
            </span>

          </div>


          <div className="admin-settings-card">

            <div>
              <strong>🇳🇵 Awasar Nepal</strong>

              <p>
                Administration system for the Awasar Nepal
                opportunity platform.
              </p>
            </div>

            <span className="settings-status">
              Active
            </span>

          </div>

        </div>

      )}

    </section>

  </main>

      ) : currentPage === "opportunities" ? (
        <main className="explore-page">
          <section className="explore-hero">
            <button
              className="explore-back-btn"
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo(0, 0);
              }}
            >
              ← Back to Home
            </button>

            <span className="eyebrow">AWASAR NEPAL OPPORTUNITIES</span>

            <h1>
              Find your next
              <span> opportunity.</span>
            </h1>

            <p>
              Explore scholarships, jobs, internships, training, competitions
              and business opportunities in one place.
            </p>

            <div className="explore-search-box">
              <span>🔍</span>

              <input
                type="text"
                placeholder="Search opportunities, organizations or locations..."
                value={exploreSearch}
                onChange={(e) => setExploreSearch(e.target.value)}
              />
            </div>
          </section>

          <section className="explore-content">
            <div className="explore-heading">
              <div>
                <span className="eyebrow">DISCOVER</span>

                <h2>Opportunities for you</h2>

                <p>{exploreFilteredOpportunities.length} opportunities found</p>
              </div>
            </div>

            <div className="explore-filters">
              <select
                value={exploreCategory}
                onChange={(e) => setExploreCategory(e.target.value)}
              >
                <option value="">All Categories</option>

                <option value="SCHOLARSHIP">🎓 Scholarships</option>

                <option value="JOB">💼 Jobs</option>

                <option value="INTERNSHIP">💻 Internships</option>

                <option value="TRAINING">📚 Training</option>

                <option value="COMPETITION">🏆 Competitions</option>

                <option value="BUSINESS">🚀 Business</option>
              </select>

              <select
                value={exploreLocation}
                onChange={(e) => setExploreLocation(e.target.value)}
              >
                <option value="">📍 All Locations</option>

                <option value="Nepal">🇳🇵 Nepal</option>

                <option value="Kathmandu">📍 Kathmandu</option>

                <option value="Lalitpur">📍 Lalitpur</option>

                <option value="International">🌍 International</option>

                <option value="Online">🌐 Online</option>
              </select>

              {(exploreSearch || exploreCategory || exploreLocation) && (
                <button
                  className="explore-clear-btn"
                  onClick={() => {
                    setExploreSearch("");
                    setExploreCategory("");
                    setExploreLocation("");
                  }}
                >
                  Clear Filters ✕
                </button>
              )}
            </div>

            {exploreFilteredOpportunities.length === 0 ? (
              <div className="explore-empty">
                <div>🔎</div>

                <h3>No opportunities found</h3>

                <p>Try another search or change your filters.</p>
              </div>
            ) : (
              <div className="explore-grid">
                {exploreFilteredOpportunities.map((item) => (
                  <article className="explore-card" key={item.id || item.title}>
                    <div className="explore-card-top">
                      <div className="explore-card-icon">
                        {item.icon || "📌"}
                      </div>

                      <span className="explore-match">
                        {item.match || "New"}
                      </span>
                    </div>

                    <span className="explore-type">{item.type}</span>

                    <h3>{item.title}</h3>

                    <p className="explore-organization">
                      🏢 {item.organization || "Awasar Nepal Partner"}
                    </p>

                    <div className="explore-card-info">
                      <span>📍 {item.location}</span>

                      <span
                        className={`deadline ${
                          getDeadlineStatus(item.deadline).status
                        }`}
                      >
                        ⏰ {getDeadlineStatus(item.deadline).text}
                      </span>
                    </div>

                    <p className="explore-description">{item.description}</p>

                    <div className="explore-card-footer">
                      <button
                        className={`save ${
                          savedOpportunities.includes(item.title) ? "saved" : ""
                        }`}
                        onClick={() => toggleSave(item.title)}
                      >
                        {savedOpportunities.includes(item.title) ? "♥" : "♡"}
                      </button>

                      <button
                        className="explore-view-btn"
                        onClick={() => {
                          setSelectedOpportunity(getCompleteOpportunity(item));
                        }}
                      >
                        View Opportunity →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      ) : (
  <main className="about-page">

    {aboutLanguage === "english" ? (
      <>
        {/* ================= ENGLISH ABOUT PAGE ================= */}

        <section className="about-hero">
          <span className="about-badge">
            🇳🇵 Built for Nepal · Made for everyone
          </span>

          <h1>
            Discover opportunities.
            <br />
            Build your future.
          </h1>

          <p>
            Awasar Nepal helps students, graduates, job seekers and young
            professionals discover scholarships, jobs, internships, training,
            competitions and other opportunities in one place.
          </p>
        </section>


        {/* ABOUT AWASAR NEPAL */}

        <section className="about-section">
          <div className="about-content">

            <div>
              <span className="section-label">
                ABOUT AWASAR NEPAL
              </span>

              <h2>
                Opportunities should be easier to find.
              </h2>

              <p>
                Finding the right opportunity can be difficult when
                information is scattered across different websites,
                social media pages and organizations.
              </p>

              <p>
                Awasar Nepal is built to make that process simpler.
                We bring different types of opportunities together so
                users can spend less time searching and more time
                building their future.
              </p>

              <p>
                Our goal is to create a simple and useful platform where
                people in Nepal can discover opportunities that match
                their interests, education and goals.
              </p>
            </div>


            {/* WHO IS IT FOR */}

            <div className="about-highlight">

              <div className="highlight-card">
                <span>🎓</span>

                <h3>For Students</h3>

                <p>
                  Find scholarships, competitions, internships and
                  learning opportunities.
                </p>
              </div>


              <div className="highlight-card">
                <span>💼</span>

                <h3>For Job Seekers</h3>

                <p>
                  Discover jobs and career opportunities that match
                  your goals.
                </p>
              </div>


              <div className="highlight-card">
                <span>🚀</span>

                <h3>For Young People</h3>

                <p>
                  Explore training, startup programs and other
                  opportunities for growth.
                </p>
              </div>

            </div>
          </div>
        </section>


        {/* OUR MISSION */}

        <section className="about-section about-mission">

          <span className="section-label">
            OUR MISSION
          </span>

          <h2>
            Make opportunities easier to discover.
          </h2>

          <p>
            Our mission is simple: make useful opportunities more
            accessible to people across Nepal.
          </p>


          <div className="mission-grid">

            <div className="mission-card">
              <span>🔎</span>

              <h3>Easy to Discover</h3>

              <p>
                Search and explore opportunities without checking
                many different platforms.
              </p>
            </div>


            <div className="mission-card">
              <span>🎯</span>

              <h3>Better Matching</h3>

              <p>
                Find opportunities based on your interests,
                education and goals.
              </p>
            </div>


            <div className="mission-card">
              <span>🇳🇵</span>

              <h3>Made for Nepal</h3>

              <p>
                A platform designed with the needs of Nepali
                students and opportunity seekers in mind.
              </p>
            </div>

          </div>
        </section>


        {/* FOUNDER */}

        <section className="about-founder">

          <div className="founder-card">

            <div className="founder-icon">
              <img
                src={founderPhoto}
                alt="Yogesh Gautam"
              />
            </div>

            <div>

              <span className="section-label">
                FOUNDER & CREATOR
              </span>

              <h2>
                Yogesh Gautam
              </h2>

              <p>
                Awasar Nepal was created with the vision of making
                opportunities easier to discover for people in Nepal.
              </p>

              <p>
                The platform aims to bring useful opportunities
                together and make them easier to find, explore
                and access.
              </p>

            </div>

          </div>

        </section>


        {/* ENGLISH CTA */}

        <section className="about-cta">

          <h2>
            Your next opportunity could be one search away.
          </h2>

          <p>
            Explore opportunities and find something that matches
            your goals.
          </p>

          <button
            className="primary-btn"
            onClick={() => setCurrentPage("opportunities")}
          >
            Explore Opportunities →
          </button>

          <button
            className="about-language-change-btn"
            onClick={() => setShowAboutLanguage(true)}
          >
            🌐 Change Language
          </button>

        </section>

      </>

    ) : (

      <>
        {/* ================= NEPALI ABOUT PAGE ================= */}

        <section className="about-hero">

          <span className="about-badge">
            🇳🇵 नेपालका लागि निर्मित · सबैका लागि अवसर
          </span>

          <h1>
            अवसरहरू खोज्नुहोस्।
            <br />
            आफ्नो भविष्य निर्माण गर्नुहोस्।
          </h1>

          <p>
            Awasar Nepal ले विद्यार्थी, स्नातक, रोजगारी खोज्ने तथा
            युवाहरूलाई छात्रवृत्ति, रोजगारी, इन्टर्नशिप, तालिम,
            प्रतियोगिता तथा अन्य अवसरहरू एउटै ठाउँमा खोज्न मद्दत गर्छ।
          </p>

        </section>


        {/* ABOUT AWASAR NEPAL */}

        <section className="about-section">

          <div className="about-content">

            <div>

              <span className="section-label">
                अवसर नेपालबारे
              </span>

              <h2>
                अवसरहरू खोज्न अझ सजिलो हुनुपर्छ।
              </h2>

              <p>
                विभिन्न वेबसाइट, सामाजिक सञ्जाल तथा संस्थाहरूमा
                जानकारी छरिएर हुँदा आफूलाई उपयुक्त अवसर खोज्न
                गाह्रो हुन सक्छ।
              </p>

              <p>
                Awasar Nepal यही प्रक्रियालाई सरल बनाउन बनाइएको हो।
                विभिन्न प्रकारका अवसरहरूलाई एउटै ठाउँमा ल्याएर
                प्रयोगकर्ताले खोजीमा कम समय र आफ्नो भविष्य
                निर्माणमा बढी समय दिन सकून् भन्ने हाम्रो उद्देश्य हो।
              </p>

              <p>
                तपाईंको रुचि, शिक्षा तथा लक्ष्यसँग मिल्ने अवसरहरू
                सजिलै खोज्न र अन्वेषण गर्न सकिने सरल तथा उपयोगी
                प्लेटफर्म बनाउनु हाम्रो लक्ष्य हो।
              </p>

            </div>


            {/* WHO IS IT FOR */}

            <div className="about-highlight">

              <div className="highlight-card">

                <span>🎓</span>

                <h3>
                  विद्यार्थीहरूका लागि
                </h3>

                <p>
                  छात्रवृत्ति, प्रतियोगिता, इन्टर्नशिप तथा
                  सिकाइका अवसरहरू खोज्नुहोस्।
                </p>

              </div>


              <div className="highlight-card">

                <span>💼</span>

                <h3>
                  रोजगारी खोज्नेहरूका लागि
                </h3>

                <p>
                  तपाईंको लक्ष्यसँग मिल्ने रोजगारी तथा
                  करियरका अवसरहरू खोज्नुहोस्।
                </p>

              </div>


              <div className="highlight-card">

                <span>🚀</span>

                <h3>
                  युवाहरूका लागि
                </h3>

                <p>
                  तालिम, स्टार्टअप कार्यक्रम तथा विकासका
                  अन्य अवसरहरू खोज्नुहोस्।
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* OUR MISSION */}

        <section className="about-section about-mission">

          <span className="section-label">
            हाम्रो उद्देश्य
          </span>

          <h2>
            अवसरहरू भेट्टाउन अझ सजिलो बनाउनु।
          </h2>

          <p>
            हाम्रो उद्देश्य सरल छ: नेपालभरिका मानिसहरूका लागि
            उपयोगी अवसरहरू अझ सजिलै पहुँचयोग्य बनाउनु।
          </p>


          <div className="mission-grid">

            <div className="mission-card">

              <span>🔎</span>

              <h3>
                सजिलै खोज्न सकिने
              </h3>

              <p>
                धेरै फरक प्लेटफर्महरू जाँच नगरी अवसरहरू
                खोज्नुहोस् र अन्वेषण गर्नुहोस्।
              </p>

            </div>


            <div className="mission-card">

              <span>🎯</span>

              <h3>
                सही अवसरसँग राम्रो मिलान
              </h3>

              <p>
                तपाईंको रुचि, शिक्षा तथा लक्ष्यका आधारमा
                अवसरहरू खोज्नुहोस्।
              </p>

            </div>


            <div className="mission-card">

              <span>🇳🇵</span>

              <h3>
                नेपालका लागि निर्मित
              </h3>

              <p>
                नेपाली विद्यार्थी तथा अवसर खोज्नेहरूको
                आवश्यकतालाई ध्यानमा राखेर बनाइएको प्लेटफर्म।
              </p>

            </div>

          </div>

        </section>


        {/* FOUNDER */}

        <section className="about-founder">

          <div className="founder-card">

            <div className="founder-icon">

              <img
                src={founderPhoto}
                alt="योगेश गौतम"
              />

            </div>

            <div>

              <span className="section-label">
                संस्थापक तथा निर्माता
              </span>

              <h2>
                योगेश गौतम
              </h2>

              <p>
                नेपालका मानिसहरूले विभिन्न अवसरहरू सजिलै खोज्न
                र भेट्टाउन सकून् भन्ने दृष्टिकोणका साथ
                Awasar Nepal निर्माण गरिएको हो।
              </p>

              <p>
                उपयोगी अवसरहरूलाई एउटै ठाउँमा ल्याएर तिनीहरूलाई
                खोज्न, बुझ्न र पहुँच गर्न अझ सजिलो बनाउनु
                यस प्लेटफर्मको मुख्य उद्देश्य हो।
              </p>

            </div>

          </div>

        </section>


        {/* NEPALI CTA */}

        <section className="about-cta">

          <h2>
            तपाईंको अर्को अवसर केवल एक खोजी टाढा हुन सक्छ।
          </h2>

          <p>
            अवसरहरू हेर्नुहोस् र तपाईंको लक्ष्यसँग मिल्ने
            अवसर खोज्नुहोस्।
          </p>

          <button
            className="primary-btn"
            onClick={() => setCurrentPage("opportunities")}
          >
            अवसरहरू हेर्नुहोस् →
          </button>

          <button
            className="about-language-change-btn"
            onClick={() => setShowAboutLanguage(true)}
          >
            🌐 भाषा परिवर्तन गर्नुहोस्
          </button>

        </section>

      </>
    )}

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
              <div className="detail-icon">{selectedOpportunity.icon}</div>

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
                {(Array.isArray(selectedOpportunity.eligibility)
                  ? selectedOpportunity.eligibility
                  : [selectedOpportunity.eligibility]
                ).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="detail-section">
              <h3>Requirements</h3>

              <ul className="requirements">
                {(Array.isArray(selectedOpportunity.requirements)
                  ? selectedOpportunity.requirements
                  : selectedOpportunity.requirements
                    ? [selectedOpportunity.requirements]
                    : [
                        "Please follow the requirements provided by the organization.",
                      ]
                ).map((item, index) => (
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
                  const applyLink = selectedOpportunity?.applyLink;

                  if (!applyLink || applyLink === "#") {
                    alert(
                      "Official application link is not available for this opportunity.",
                    );
                    return;
                  }

                  handleApply(selectedOpportunity);

                  window.open(applyLink, "_blank", "noopener,noreferrer");
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
              <div className="login-logo">➕</div>

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

              <button type="submit" className="submit-opportunity-submit">
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
              <div className="login-logo">👑</div>

              <h2>Admin Panel</h2>

              <p>Review submitted opportunities before publishing them.</p>
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

            <div className="admin-management">
  <div className="admin-management-header">
    <div>
      <span className="admin-section-label">TEAM & ACCESS</span>
      <h3>👥 Admin Management</h3>
      <p>
        Manage who can access the Awasar Nepal admin panel.
      </p>
    </div>

    <button
      className="invite-admin-btn"
      onClick={() => setShowInviteAdmin(true)}
    >
      ➕ Invite Admin
    </button>
  </div>

  <div className="current-admins">
    <h4>Current Admins</h4>

    <div className="admin-member-card">
      <div className="admin-member-avatar">👑</div>

      <div className="admin-member-info">
        <strong>Website Owner</strong>
        <span>Owner · Full Access</span>
      </div>

      <span className="admin-role-badge owner-badge">
        OWNER
      </span>
    </div>
  </div>

  <div className="pending-admin-invitations">
    <div className="pending-invite-heading">
      <h4>Pending Invitations</h4>

      <span>
        {adminInvitations.filter(
          (invite) => invite.status === "pending"
        ).length}
      </span>
    </div>

    {adminInvitations.filter(
      (invite) => invite.status === "pending"
    ).length === 0 ? (
      <div className="no-admin-invitations">
        📭 No pending invitations
      </div>
    ) : (
      <div className="admin-invitation-list">
        {adminInvitations
          .filter((invite) => invite.status === "pending")
          .map((invite) => (
            <div
              className="admin-invitation-card"
              key={invite.id}
            >
              <div>
                <strong>{invite.email}</strong>
                <span>{invite.role}</span>
              </div>

              <button
                className="cancel-invite-btn"
                onClick={() => {
                  const updated = adminInvitations.filter(
                    (item) => item.id !== invite.id
                  );

                  setAdminInvitations(updated);

                  localStorage.setItem(
                    "awasarNepalAdminInvitations",
                    JSON.stringify(updated)
                  );
                }}
              >
                Cancel
              </button>
            </div>
          ))}
      </div>
    )}
  </div>
</div>

            <div className="admin-list">
              {loadingSubmissions && (
                <p className="admin-empty">⏳ Loading submissions...</p>
              )}

              <div className="admin-stats">
                <div className="admin-stat pending-stat">
                  <strong>
                    {
                      submittedOpportunities.filter(
                        (item) => item.status === "pending",
                      ).length
                    }
                  </strong>
                  <span>🟡 Pending</span>
                </div>

                <div className="admin-stat approved-stat">
                  <strong>
                    {
                      submittedOpportunities.filter(
                        (item) => item.status === "approved",
                      ).length
                    }
                  </strong>
                  <span>✅ Approved</span>
                </div>

                <div className="admin-stat declined-stat">
                  <strong>
                    {
                      submittedOpportunities.filter(
                        (item) => item.status === "declined",
                      ).length
                    }
                  </strong>
                  <span>❌ Declined</span>
                </div>
              </div>

              {submittedOpportunities.filter(
                (item) => item.status === adminFilter,
              ).length === 0 ? (
                <p className="admin-empty">
                  🎉 No pending opportunities to review.
                </p>
              ) : (
                submittedOpportunities
                  .filter((item) => item.status === adminFilter)
                  .map((item) => (
                    <div className="admin-opportunity-card" key={item.id}>
                      <div className="admin-opportunity-top">
                        <div>
                          <span className="opportunity-type">
                            {item.category}
                          </span>

                          <h3>{item.title}</h3>

                          <p>🏢 {item.organization}</p>
                        </div>
                      </div>

                      <div className="admin-opportunity-info">
                        <span>📍 {item.location}</span>

                        <span>📅 {item.deadline}</span>
                      </div>

                      <p className="admin-description">{item.description}</p>

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
                              }),
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

      {showInviteAdmin && (
        <div className="login-overlay">
          <div className="admin-invite-modal">

            <button
              className="login-close"
              onClick={() => {
                setShowInviteAdmin(false);
                setInviteAdminEmail("");
                setInviteAdminRole("Admin");
              }}
            >
              ×
            </button>

            <div className="admin-invite-icon">
              👥
            </div>

            <h2>Invite New Admin</h2>

            <p className="admin-invite-description">
              Send an invitation to someone you trust to help manage
              Awasar Nepal.
            </p>

            <label>Email Address</label>

            <input
              type="email"
              placeholder="admin@example.com"
              value={inviteAdminEmail}
              onChange={(e) => setInviteAdminEmail(e.target.value)}
            />


<div className="admin-role-info-box">
  <div className="admin-role-info-icon">
    🔐
  </div>

  <div>
    <strong>Secure role-based access</strong>
    <span>
      Admin gets full management access. Editor can manage
      opportunity content but cannot manage team security.
    </span>
  </div>
</div>

            <label>Role</label>

            <select
              value={inviteAdminRole}
              onChange={(e) => setInviteAdminRole(e.target.value)}
            >
              <option value="Admin">
                Admin — Full Management
              </option>

              <option value="Editor">
                Editor — Opportunity Management
              </option>
            </select>

            <button
  className="send-admin-invite-btn"
  onClick={async () => {
    const email = inviteAdminEmail.trim().toLowerCase();

    if (!email) {
      alert("Please enter an email address.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in.");
        return;
      }

      const { data, error } = await supabase
        .from("admin_invites")
        .insert([
          {
            email: email,
            role: inviteAdminRole.toLowerCase(),
            invited_by: user.id,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Invitation error:", error);

        alert(
  `Invitation failed:\n${error.message}\nCode: ${error.code || "N/A"}`
);
        return;
      }

      setAdminInvitations((prev) => [data, ...prev]);

      setInviteAdminEmail("");
      setInviteAdminRole("Admin");
      setShowInviteAdmin(false);

      alert("Admin invitation created successfully! 🎉");
    } catch (error) {
      console.error("Unexpected invitation error:", error);
      alert("Something went wrong. Please try again.");
    }
  }}
>
  📩 Create Invitation
</button>

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

            <div className="login-logo">🤖</div>

            <h2>AI Opportunity Finder</h2>

            <p>
              Tell us about yourself and we’ll find opportunities that match
              you.
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
                  aiGoal,
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
                    {JSON.parse(localStorage.getItem("awasarNepalUser"))
                      ?.phone || "Not available"}
                  </strong>
                </div>
              </div>

              <button
                className="edit-profile-btn"
                onClick={() => {
                  const savedUser = JSON.parse(
                    localStorage.getItem("awasarNepalUser"),
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
                    (item) => item.title === title,
                  );

                  if (!opportunity) return null;
{/* Latest Awasar Nepal update */}
                  return (

                
                    <div className="saved-item" key={title}>
                      <div>
                        <strong>{opportunity.title}</strong>

                        <small>📍 {opportunity.location}</small>
                      </div>

                      <button
                        className="saved-view-btn"
                        onClick={() => {
                          setShowDashboard(false);

                          setSelectedOpportunity(
                            getCompleteOpportunity(opportunity),
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
                  <div className="saved-item" key={application.id}>
                    <div>
                      <strong>{application.title}</strong>

                      <small>{application.organization}</small>
                    </div>

                    <span>{application.status}</span>
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

                localStorage.removeItem("awasarNepalLoggedIn");
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

            <div className="login-logo">👤</div>

            <h2>Edit Profile</h2>

            <p>Update your Awasar Nepal profile information.</p>

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

              <button type="submit" className="login-submit">
                Save Changes →
              </button>
            </form>
          </div>
        </div>
      )}

      {showEmailPhoneModal && (
  <div className="password-modal-overlay">
    <div className="email-phone-modal">

      <div className="email-phone-modal-header">

        <div className="email-phone-modal-title-row">
          <div className="email-phone-modal-icon">
            📧
          </div>

          <div>
            <h3>Email & Phone</h3>
            <p>Manage your account contact information.</p>
          </div>
        </div>

        <button
          className="email-phone-modal-close"
          onClick={() => setShowEmailPhoneModal(false)}
          aria-label="Close"
        >
          ×
        </button>

      </div>

      <div className="email-phone-modal-body">

        {/* EMAIL */}

        <div className="contact-info-card">

          <div className="contact-info-icon">
            📧
          </div>

          <div className="contact-info-content">
            <span className="contact-info-label">
              Email Address
            </span>

            <span className="contact-info-value">
              {currentUserEmail || "No email available"}
            </span>
          </div>

          <span className="contact-verified">
            ✓ Verified
          </span>

        </div>


        {/* PHONE */}

        <div className="contact-info-card">

          <div className="contact-info-icon">
            📱
          </div>

          <div className="contact-info-content">

            <span className="contact-info-label">
              Phone Number
            </span>

            <span className="contact-info-value">
              Not added
            </span>

          </div>

        </div>

        <div className="contact-coming-soon">
          <span className="contact-coming-soon-icon">
            ℹ️
          </span>

          <span>
            Phone number management will be available soon.
          </span>
        </div>


        <button
          type="button"
          className="email-phone-modal-action"
          onClick={() => setShowEmailPhoneModal(false)}
        >
          Done
        </button>

      </div>

    </div>
  </div>
)}

{showNotificationsModal && (
  <div className="password-modal-overlay">

    <div className="notifications-modal">

      <div className="notifications-modal-header">

        <div className="notifications-title-row">
          <div className="notifications-icon">
            🔔
          </div>

          <div>
            <h3>Notifications</h3>
            <p>Choose which updates you want to receive.</p>
          </div>
        </div>

        <button
          className="notifications-modal-close"
          onClick={() => setShowNotificationsModal(false)}
          aria-label="Close"
        >
          ×
        </button>

      </div>

      <div className="notifications-modal-body">

        {/* DEADLINE ALERTS */}

        <div className="notification-setting-card">

          <div className="notification-setting-icon">
            ⏰
          </div>

          <div className="notification-setting-content">
            <strong>Deadline Alerts</strong>

            <p>
              Get reminders when an opportunity deadline is approaching.
            </p>
          </div>

          <button
            type="button"
            className={`notification-toggle ${
              deadlineNotifications ? "active" : ""
            }`}
            onClick={() =>
              setDeadlineNotifications(!deadlineNotifications)
            }
            aria-label="Toggle deadline notifications"
          >
            <span className="notification-toggle-knob"></span>
          </button>

        </div>


        {/* OPPORTUNITY UPDATES */}

        <div className="notification-setting-card">

          <div className="notification-setting-icon">
            🎯
          </div>

          <div className="notification-setting-content">
            <strong>Opportunity Updates</strong>

            <p>
              Receive updates about new opportunities matching your interests.
            </p>
          </div>

          <button
            type="button"
            className={`notification-toggle ${
              opportunityNotifications ? "active" : ""
            }`}
            onClick={() =>
              setOpportunityNotifications(!opportunityNotifications)
            }
            aria-label="Toggle opportunity notifications"
          >
            <span className="notification-toggle-knob"></span>
          </button>

        </div>


        <div className="notifications-info-box">
          <span>🔔</span>

          <p>
            You can change these notification preferences anytime
            from your account settings.
          </p>
        </div>


        <button
          type="button"
          className="notifications-done-btn"
          onClick={() => setShowNotificationsModal(false)}
        >
          Done
        </button>

      </div>

    </div>

  </div>
)}

{showPrivacyModal && (
  <div className="password-modal-overlay">

    <div className="privacy-modal">

      {/* HEADER */}
      <div className="privacy-modal-header">

        <div className="privacy-title-row">
          <div className="privacy-icon">
            🔒
          </div>

          <div>
            <h3>Profile Privacy</h3>
            <p>Control who can see your profile information.</p>
          </div>
        </div>

        <button
          className="privacy-modal-close"
          onClick={() => setShowPrivacyModal(false)}
          aria-label="Close"
        >
          ×
        </button>

      </div>


      {/* BODY */}
      <div className="privacy-modal-body">

        <div className="privacy-setting-card">

          <div className="privacy-setting-icon">
            👤
          </div>

          <div className="privacy-setting-content">
            <strong>Private Profile</strong>

            <p>
              Keep your profile information private from other users.
            </p>
          </div>

          <button
            type="button"
            className={`privacy-toggle ${
              profilePrivate ? "active" : ""
            }`}
            onClick={() => setProfilePrivate(!profilePrivate)}
            aria-label="Toggle private profile"
          >
            <span className="privacy-toggle-knob"></span>
          </button>

        </div>


        <div className="privacy-info-box">
          <span>🛡️</span>

          <p>
            When your profile is private, other users won't be able
            to view your profile information.
          </p>
        </div>


        <button
          type="button"
          className="privacy-done-btn"
          onClick={() => setShowPrivacyModal(false)}
        >
          Done
        </button>

      </div>

    </div>

  </div>
)}


      {showLogin && (
        <div className="login-overlay">
          <div className="login-modal">
            <button className="login-close" onClick={() => setShowLogin(false)}>
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

              {loginMessage && <p className="login-message">{loginMessage}</p>}

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
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setSignupPhone(e.target.value)}
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
          <img src={logo} alt="Awasar Nepal Logo" className="website-logo" />
          <div>
            <strong>AWASAR NEPAL</strong>
            <small>Your opportunity starts here.</small>
          </div>
        </div>
        <p>© 2026 Awasar Nepal. Made with purpose in Nepal 🇳🇵</p>
      </footer>
    </div>
  );
}

export default App;
