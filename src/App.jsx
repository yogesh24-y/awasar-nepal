import { useState } from "react";
import "./index.css";
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
    location: "🌍 International",
    deadline: "18 days left",
    match: "96%",
    description:
      "A scholarship opportunity for students who want to study and build their future internationally.",
  },
  {
    icon: "🎓",
    type: "SCHOLARSHIP",
    title: "Nepal Student Excellence Scholarship",
    location: "📍 Nepal",
    deadline: "25 days left",
    match: "92%",
    description:
      "Financial support for talented students pursuing their academic goals.",
  },
  {
    icon: "💼",
    type: "JOB",
    title: "Junior Marketing Officer",
    location: "📍 Kathmandu",
    deadline: "15 days left",
    match: "90%",
    description:
      "An opportunity for motivated individuals to start their professional career.",
  },
  {
    icon: "💼",
    type: "JOB",
    title: "Customer Support Executive",
    location: "📍 Lalitpur",
    deadline: "20 days left",
    match: "87%",
    description:
      "Join a growing team and build valuable communication and customer service skills.",
  },
  {
    icon: "💻",
    type: "INTERNSHIP",
    title: "Software Development Internship",
    location: "📍 Kathmandu",
    deadline: "12 days left",
    match: "93%",
    description:
      "Gain practical experience and develop your skills by working on real software projects.",
  },
  {
    icon: "💻",
    type: "INTERNSHIP",
    title: "Digital Marketing Internship",
    location: "🌐 Hybrid",
    deadline: "30 days left",
    match: "88%",
    description:
      "Learn digital marketing through practical projects and professional mentorship.",
  },
  {
    icon: "📚",
    type: "TRAINING",
    title: "Free Digital Skills Training",
    location: "🌐 Online",
    deadline: "25 days left",
    match: "89%",
    description:
      "Learn valuable digital skills online and improve your career opportunities.",
  },
  {
    icon: "📚",
    type: "TRAINING",
    title: "Web Development Bootcamp",
    location: "🌐 Online",
    deadline: "35 days left",
    match: "91%",
    description:
      "Learn modern web development skills from beginner to intermediate level.",
  },
  {
    icon: "🏆",
    type: "COMPETITION",
    title: "National Innovation Competition",
    location: "📍 Nepal",
    deadline: "40 days left",
    match: "85%",
    description:
      "Present your innovative ideas and compete with talented young people.",
  },
  {
    icon: "🏆",
    type: "COMPETITION",
    title: "Student Startup Challenge",
    location: "📍 Kathmandu",
    deadline: "22 days left",
    match: "90%",
    description:
      "Turn your creative business idea into a competitive startup project.",
  },
  {
    icon: "🚀",
    type: "BUSINESS",
    title: "Youth Startup Support Program",
    location: "📍 Nepal",
    deadline: "28 days left",
    match: "94%",
    description:
      "Get support and guidance to develop your startup or business idea.",
  },
  {
    icon: "🚀",
    type: "BUSINESS",
    title: "Small Business Growth Program",
    location: "🌐 Hybrid",
    deadline: "32 days left",
    match: "86%",
    description:
      "A program designed to help entrepreneurs grow and improve their businesses.",
  },
];

function App() {
  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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
const [showDashboard, setShowDashboard] = useState(false);
const [selectedOpportunity, setSelectedOpportunity] = useState(null);
const [currentPage, setCurrentPage] = useState("home");
const handleLogin = (e) => {
  e.preventDefault();

  const savedUser = JSON.parse(
    localStorage.getItem("awasarNepalUser")
  );

  if (!savedUser) {
    setLoginMessage(
      "No account found. Please create an account first."
    );
    return;
  }

  const loginValue =
    loginMethod === "email" ? email : phone;

  const accountValue =
    loginMethod === "email"
      ? savedUser.email
      : savedUser.phone;

  if (loginValue !== accountValue) {
    setLoginMessage(
      "Email or mobile number is incorrect."
    );
    return;
  }

  if (password !== savedUser.password) {
    setLoginMessage(
      "Incorrect password."
    );
    return;
  }

  setLoggedInUser(savedUser.name);
  setShowDashboard(true);

  localStorage.setItem(
    "awasarNepalLoggedIn",
    "true"
  );

  setShowLogin(false);

  alert(
    `Welcome to Awasar Nepal, ${savedUser.name}! 🎉`
  );
};

const handleSignup = (e) => {
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

  const newUser = {
    name: name,
    email: signupEmail,
    phone: signupPhone,
    password: signupPassword,
  };

  localStorage.setItem(
    "awasarNepalUser",
    JSON.stringify(newUser)
  );

  alert("Account created successfully! 🎉");

  setShowSignup(false);

  setName("");
  setSignupEmail("");
  setSignupPhone("");
  setSignupPassword("");
  setConfirmPassword("");

  setShowLogin(true);
};
const filteredOpportunities = opportunities.filter((item) => {

  const matchesSearch =
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "" ||
    item.type.toLowerCase() ===
      selectedCategory.toLowerCase().replace("s", "");

  return matchesSearch && matchesCategory;

});

  const toggleSave = (title) => {
    setSavedOpportunities((previous) =>
      previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title]
    );
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

  {loggedInUser ? (
    <button
     className="user-btn"
     onClick={() => setShowDashboard(true)}
     >
      👤 {loggedInUser}
    </button>
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

        <section className="section" id="categories">
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
          <div className="section-heading">
            <div>
              <span className="eyebrow">DISCOVER</span>
              <h2>Opportunities for you</h2>
            </div>
            <a href="#">Explore all →</a>
          </div>

          <div className="opportunity-grid">
            {filteredOpportunities.length === 0 && (
  <p className="no-results">
    😔 No opportunities found. Try another search.
  </p>
)}
            {filteredOpportunities.map((item) => (
              <article className="opportunity-card" key={item.title}>
                <div className="opportunity-top">
                  <div className="opportunity-icon">{item.icon}</div>
                  <span className="match">{item.match} Match</span>
                </div>

                <span className="opportunity-type">{item.type}</span>
                <h3>{item.title}</h3>

                <div className="opportunity-info">
                  <span>{item.location}</span>
                  <span>⏰ {item.deadline}</span>
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
  onClick={() => setSelectedOpportunity(item)}
>
  View Opportunity →
</button> 
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="premium-section" id="premium">
  <div className="premium-heading">
    <span className="premium-badge">💎 AWASAR NEPAL PREMIUM</span>

    <h2>Unlock more opportunities.</h2>

    <p>
      Get powerful tools to help you find, save and manage
      opportunities more easily.
    </p>
  </div>

  <div className="premium-grid">

    <article className="premium-card">
      <div className="premium-icon">🔔</div>

      <h3>Deadline Alerts</h3>

      <p>
        Never miss an important scholarship, job or internship deadline.
      </p>

      <span className="premium-status">Coming Soon</span>
    </article>


    <article className="premium-card">
      <div className="premium-icon">🤖</div>

      <h3>AI Opportunity Finder</h3>

      <p>
        Tell us your goals and discover opportunities that match you.
      </p>

      <span className="premium-status">Coming Soon</span>
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
          <button>Create your free profile →</button>
        </section>
      </main>
      ) : (

  <main className="about-page">

    <section className="about-hero">

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
      </button>
      <div className="detail-icon">
        {selectedOpportunity.icon}
      </div>

      <span className="opportunity-type">
        {selectedOpportunity.type}
      </span>

      <h2>
        {selectedOpportunity.title}
      </h2>

      <div className="detail-info">

        <p>
          📍 {selectedOpportunity.location}
        </p>

        <p>
          ⏰ {selectedOpportunity.deadline}
        </p>

        <p>
          🎯 {selectedOpportunity.match} Match
        </p>

      </div>

      <h3>About this opportunity</h3>

      <p className="detail-description">
        {selectedOpportunity.description}
      </p>

      <h3>Why apply?</h3>

      <ul className="requirements">
        <li>Discover new career opportunities</li>
        <li>Build valuable skills and experience</li>
        <li>Improve your future possibilities</li>
      </ul>

      <button
        className="apply-btn"
        onClick={() =>
          alert("Application feature coming soon 🚀")
        }
      >
        Apply Now →
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

      <div className="dashboard-stats">

        <div className="dashboard-stat">
          <strong>{savedOpportunities.length}</strong>
          <span>Saved Opportunities</span>
        </div>

        <div className="dashboard-stat">
          <strong>0</strong>
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

    savedOpportunities.map((item) => (

      <div
        className="saved-item"
        key={item}
      >

        <span>{item}</span>

        <button
          className="remove-saved"
          onClick={() => toggleSave(item)}
        >
          Remove
        </button>

      </div>

    ))

  )}

</div>

      <button
        className="logout-btn"
        onClick={() => {

          setLoggedInUser("");

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