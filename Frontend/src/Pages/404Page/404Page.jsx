import { useNavigate } from "react-router-dom";
import "./404Page.css";
export const PageNotFoundPg = () => {
    const navigate = useNavigate();
    return (
        <main className="errPgBody">
            <div className="container">
                <h1>404</h1>
                <h2>Oops! Page not found</h2>
                <p>The page you are looking for might be under process, had its name changed, or is temporarily unavailable.
                </p>
                <button className="btn" onClick={() => { navigate("/") }}>Go to Home</button>
            </div>
        </main>
    )
}




























// <!doctype html>
// <html lang="en" class="h-full">
//  <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Doctor Profile</title>
//   <script src="https://cdn.tailwindcss.com/3.4.17"></script>
//   <script src="https://cdn.jsdelivr.net/npm/lucide@0.263.0/dist/umd/lucide.min.js"></script>
//   <script src="/_sdk/element_sdk.js"></script>
//   <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&amp;family=Outfit:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">
//   <style>
//     html, body { height: 100%; margin: 0; }
//     .font-heading { font-family: 'DM Serif Display', serif; }
//     .font-body { font-family: 'Outfit', sans-serif; }

//     @keyframes fadeUp {
//       from { opacity: 0; transform: translateY(24px); }
//       to { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes scaleIn {
//       from { opacity: 0; transform: scale(0.92); }
//       to { opacity: 1; transform: scale(1); }
//     }
//     @keyframes slideRight {
//       from { opacity: 0; transform: translateX(-20px); }
//       to { opacity: 1; transform: translateX(0); }
//     }
//     .anim-fade-up { animation: fadeUp 0.7s ease-out both; }
//     .anim-scale-in { animation: scaleIn 0.6s ease-out both; }
//     .anim-slide-right { animation: slideRight 0.5s ease-out both; }
//     .delay-1 { animation-delay: 0.1s; }
//     .delay-2 { animation-delay: 0.2s; }
//     .delay-3 { animation-delay: 0.35s; }
//     .delay-4 { animation-delay: 0.5s; }
//     .delay-5 { animation-delay: 0.65s; }
//     .delay-6 { animation-delay: 0.8s; }
//     .delay-7 { animation-delay: 0.95s; }

//     .stat-card:hover { transform: translateY(-4px); }
//     .service-pill:hover { transform: scale(1.05); }
//     .review-card:hover { box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
//   </style>
//   <style>body { box-sizing: border-box; }</style>
//   <script src="/_sdk/data_sdk.js" type="text/javascript"></script>
//  </head>
//  <body class="h-full font-body">
//   <div id="app-wrapper" class="w-full h-full overflow-auto" style="background-color: #f0f4f3;"><!-- Hero Section -->
//    <header class="relative w-full overflow-hidden" style="background: linear-gradient(135deg, #1a3c34 0%, #2d6a5a 60%, #3a8b78 100%);">
//     <div class="absolute inset-0 opacity-10">
//      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs>
//        <pattern id="grid" width="40" height="40" patternunits="userSpaceOnUse">
//         <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5" />
//        </pattern>
//       </defs> <rect width="100%" height="100%" fill="url(#grid)" />
//      </svg>
//     </div>
//     <div class="absolute top-6 right-8 opacity-[0.07]">
//      <svg width="220" height="220" viewbox="0 0 100 100" fill="white"><path d="M45 10 h10 v35 h35 v10 h-35 v35 h-10 v-35 h-35 v-10 h35z" />
//      </svg>
//     </div>
//     <div class="relative max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-8 md:gap-14"><!-- Avatar -->
//      <div class="anim-scale-in flex-shrink-0">
//       <div class="w-44 h-44 md:w-52 md:h-52 rounded-full border-4 border-white/20 shadow-2xl flex items-center justify-center overflow-hidden" style="background: linear-gradient(145deg, #4ecdc4, #2d6a5a);">
//        <img id="doctor-image" src="https://res.cloudinary.com/ddobgq8jw/image/upload/v1773728326/speciali…" alt="Doctor" style="width:100%;height:100%;object-fit:cover;" loading="lazy" onerror="console.error('Image failed:', this.src); this.style.display='none'; this.parentElement.innerHTML='<svg width=\" 90\ height="\&quot;90\&quot;" viewbox="\&quot;0" 0 100 100\ fill="\&quot;none\&quot;" xmlns="\&quot;http://www.w3.org/2000/svg\&quot;"><circle cx="\&quot;50\&quot;" cy="\&quot;35\&quot;" r="\&quot;18\&quot;" fill="\&quot;white\&quot;" opacity="\&quot;0.9\&quot;" /> <path d="\&quot;M20" 85 c20 62 35 52 50 c65 80 85\ fill="\&quot;white\&quot;" opacity="\&quot;0.9\&quot;" /> <rect x="\&quot;44\&quot;" y="\&quot;58\&quot;" width="\&quot;12\&quot;" height="\&quot;3\&quot;" rx="\&quot;1.5\&quot;" fill="\&quot;#2d6a5a\&quot;" /> <rect x="\&quot;47\&quot;" y="\&quot;55\&quot;" width="\&quot;6\&quot;" height="\&quot;9\&quot;" rx="\&quot;1\&quot;" fill="\&quot;#2d6a5a\&quot;" />';"&gt;
//       </div>
//      </div><!-- Info -->
//      <div class="text-center md:text-left text-white">
//       <div class="anim-fade-up delay-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-4" style="background: rgba(78, 205, 196, 0.25); color: #a8ede8;"><i data-lucide="shield-check" style="width:14px;height:14px;"></i> <span>Board Certified</span>
//       </div>
//       <h1 id="hero-name" class="anim-fade-up delay-2 font-heading text-4xl md:text-5xl lg:text-6xl leading-tight mb-3">Dr. Awais Anwar</h1>
//       <p id="hero-specialty" class="anim-fade-up delay-3 text-lg md:text-xl font-light mb-4" style="color: #a8ede8;">Cardiologist</p>
//       <p id="clinic-name" class="anim-fade-up delay-3 text-xs md:text-sm font-light mb-4 uppercase tracking-wide" style="color: #4ecdc4;">Kohat Medical Center</p>
//       <p id="hero-tagline" class="anim-fade-up delay-4 text-sm md:text-base max-w-lg font-light leading-relaxed" style="color: rgba(255,255,255,0.7);">Professional medical background...</p>
//       <div class="anim-fade-up delay-5 flex items-center gap-4 mt-6 justify-center md:justify-start"><button id="btn-book" onclick="document.getElementById('contact-section').scrollIntoView({behavior:'smooth'})" class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105" style="background-color: #4ecdc4; color: #1a3c34;"> <i data-lucide="calendar" style="width:16px;height:16px;"></i> Book Appointment </button> <button onclick="document.getElementById('about-section').scrollIntoView({behavior:'smooth'})" class="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border border-white/30 text-white transition-all duration-300 hover:bg-white/10"> Learn More </button>
//       </div>
//      </div>
//     </div>
//    </header><!-- Stats Bar -->
//    <section class="w-full" style="background-color: #ffffff;">
//     <div class="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
//      <div class="anim-fade-up delay-3 stat-card text-center p-4 rounded-2xl transition-all duration-300 cursor-default" style="background-color: #f0f4f3;">
//       <div class="text-3xl font-bold font-heading" style="color: #1a3c34;">
//        6
//       </div>
//       <div class="text-xs font-medium mt-1 uppercase tracking-wider" style="color: #6b8f85;">
//        Years Experience
//       </div>
//      </div>
//      <div class="anim-fade-up delay-4 stat-card text-center p-4 rounded-2xl transition-all duration-300 cursor-default" style="background-color: #f0f4f3;">
//       <div class="text-3xl font-bold font-heading" style="color: #1a3c34;">
//        1
//       </div>
//       <div class="text-xs font-medium mt-1 uppercase tracking-wider" style="color: #6b8f85;">
//        Service Offered
//       </div>
//      </div>
//      <div class="anim-fade-up delay-5 stat-card text-center p-4 rounded-2xl transition-all duration-300 cursor-default" style="background-color: #f0f4f3;">
//       <div class="text-3xl font-bold font-heading" style="color: #1a3c34;">
//        ★ 4.8
//       </div>
//       <div class="text-xs font-medium mt-1 uppercase tracking-wider" style="color: #6b8f85;">
//        Verified
//       </div>
//      </div>
//      <div class="anim-fade-up delay-6 stat-card text-center p-4 rounded-2xl transition-all duration-300 cursor-default" style="background-color: #f0f4f3;">
//       <div class="text-3xl font-bold font-heading" style="color: #1a3c34;">
//        PKR 1000
//       </div>
//       <div class="text-xs font-medium mt-1 uppercase tracking-wider" style="color: #6b8f85;">
//        Consultation Fee
//       </div>
//      </div>
//     </div>
//    </section><!-- About Section -->
//    <section id="about-section" class="w-full px-6 py-14" style="background-color: #f0f4f3;">
//     <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start"><!-- About -->
//      <div class="anim-fade-up delay-2">
//       <div class="flex items-center gap-3 mb-4">
//        <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: #4ecdc4;"><i data-lucide="user" style="width:20px;height:20px;color:#1a3c34;"></i>
//        </div>
//        <h2 class="font-heading text-2xl md:text-3xl" style="color: #1a3c34;">About Me</h2>
//       </div>
//       <p id="about-text" class="leading-relaxed text-sm md:text-base" style="color: #4a6b62;">This is the about para about the doctor.</p>
//       <div class="flex flex-wrap gap-2 mt-6">
//        <span class="service-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-default" style="background-color: #dff0ed; color: #1a3c34;"> <i data-lucide="stethoscope" style="width:13px;height:13px;"></i> Health Consultation </span> <span class="service-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-default" style="background-color: #dff0ed; color: #1a3c34;"> <i data-lucide="clipboard-check" style="width:13px;height:13px;"></i> MBBS Qualified </span>
//       </div>
//      </div><!-- Education & Awards -->
//      <div class="anim-fade-up delay-4 space-y-6">
//       <div class="p-5 rounded-2xl" style="background-color: #ffffff; box-shadow: 0 2px 16px rgba(0,0,0,0.05);">
//        <h3 class="font-heading text-lg mb-3 flex items-center gap-2" style="color: #1a3c34;"><i data-lucide="graduation-cap" style="width:18px;height:18px;color:#4ecdc4;"></i> Education</h3>
//        <ul class="space-y-3 text-sm" style="color: #4a6b62;">
//         <li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style="background-color: #4ecdc4;"></span>
//          <div>
//           <strong style="color:#1a3c34;">Metric</strong><br>
//            Shaheen Group of School and College · 2023
//          </div></li>
//         <li class="flex items-start gap-3"><span class="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style="background-color: #4ecdc4;"></span>
//          <div>
//           <strong style="color:#1a3c34;">FSc</strong><br>
//            Shaheen Group of School and College · 2025
//          </div></li>
//        </ul>
//       </div>
//       <div class="p-5 rounded-2xl" style="background-color: #ffffff; box-shadow: 0 2px 16px rgba(0,0,0,0.05);">
//        <h3 class="font-heading text-lg mb-3 flex items-center gap-2" style="color: #1a3c34;"><i data-lucide="award" style="width:18px;height:18px;color:#4ecdc4;"></i> Recognition</h3>
//        <ul class="space-y-2 text-sm" style="color: #4a6b62;">
//         <li class="flex items-center gap-2"><i data-lucide="star" style="width:14px;height:14px;color:#4ecdc4;"></i> God Medal</li>
//         <li class="flex items-center gap-2"><i data-lucide="star" style="width:14px;height:14px;color:#4ecdc4;"></i> Verified Specialist</li>
//         <li class="flex items-center gap-2"><i data-lucide="star" style="width:14px;height:14px;color:#4ecdc4;"></i> PREMIUM Plan Holder</li>
//        </ul>
//       </div>
//      </div>
//     </div>
//    </section><!-- Patient Reviews -->
//    <section class="w-full px-6 py-14" style="background-color: #ffffff;">
//     <div class="max-w-5xl mx-auto">
//      <div class="text-center mb-10 anim-fade-up">
//       <h2 class="font-heading text-2xl md:text-3xl mb-2" style="color: #1a3c34;">Consultation Service</h2>
//       <p class="text-sm" style="color: #6b8f85;">Professional health consultation</p>
//      </div>
//      <div class="grid md:grid-cols-2 gap-6">
//       <div class="anim-fade-up delay-2 p-6 rounded-2xl transition-all duration-300" style="background-color: #f0f4f3; border-left: 4px solid #4ecdc4;">
//        <div class="flex items-start justify-between mb-3">
//         <div>
//          <h3 class="font-heading text-xl" style="color: #1a3c34;">Health Consultation</h3>
//          <p class="text-xs mt-1" style="color: #6b8f85;">Professional medical advice</p>
//         </div><i data-lucide="stethoscope" style="width:24px;height:24px;color:#4ecdc4;"></i>
//        </div>
//        <p class="text-sm leading-relaxed mt-3 mb-4" style="color: #4a6b62;">qwertyuio</p>
//        <div class="flex items-center justify-between">
//         <div>
//          <p class="text-xs" style="color: #6b8f85;">Duration</p>
//          <p class="font-heading text-lg" style="color: #1a3c34;">20 mins</p>
//         </div>
//         <div>
//          <p class="text-xs" style="color: #6b8f85;">Fee</p>
//          <p class="font-heading text-lg" style="color: #2d6a5a;">PKR 1000</p>
//         </div>
//        </div>
//       </div>
//       <div class="anim-fade-up delay-4 p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between" style="background-color: #f0f4f3;">
//        <h3 class="font-heading text-lg mb-4" style="color: #1a3c34;">Ready to book?</h3><button onclick="document.getElementById('contact-section').scrollIntoView({behavior:'smooth'})" class="w-full px-4 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg" style="background-color: #4ecdc4; color: #1a3c34;"> <i data-lucide="calendar" style="width:16px;height:16px; display: inline; margin-right: 8px;"></i> Schedule Now </button>
//       </div>
//      </div>
//     </div>
//    </section><!-- Contact Section -->
//    <section id="contact-section" class="w-full px-6 py-14" style="background-color: #f0f4f3;">
//     <div class="max-w-5xl mx-auto">
//      <div class="text-center mb-10 anim-fade-up">
//       <h2 class="font-heading text-2xl md:text-3xl mb-2" style="color: #1a3c34;">Get in Touch</h2>
//       <p class="text-sm" style="color: #6b8f85;">Schedule a consultation or reach out with questions</p>
//      </div>
//      <div class="grid md:grid-cols-3 gap-5">
//       <div class="anim-fade-up delay-2 flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:shadow-md" style="background-color: #ffffff;">
//        <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style="background-color: #dff0ed;"><i data-lucide="phone" style="width:20px;height:20px;color:#2d6a5a;"></i>
//        </div>
//        <div>
//         <h4 class="font-semibold text-sm mb-1" style="color: #1a3c34;">Phone</h4>
//         <p id="contact-phone" class="text-sm" style="color: #4a6b62;">(555) 234-5678</p>
//        </div>
//       </div>
//       <div class="anim-fade-up delay-4 flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:shadow-md" style="background-color: #ffffff;">
//        <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style="background-color: #dff0ed;"><i data-lucide="mail" style="width:20px;height:20px;color:#2d6a5a;"></i>
//        </div>
//        <div>
//         <h4 class="font-semibold text-sm mb-1" style="color: #1a3c34;">Email</h4>
//         <p id="contact-email" class="text-sm" style="color: #4a6b62;">dr.mitchell@heartcare.com</p>
//        </div>
//       </div>
//       <div class="anim-fade-up delay-6 flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 hover:shadow-md" style="background-color: #ffffff;">
//        <div class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style="background-color: #dff0ed;"><i data-lucide="map-pin" style="width:20px;height:20px;color:#2d6a5a;"></i>
//        </div>
//        <div>
//         <h4 class="font-semibold text-sm mb-1" style="color: #1a3c34;">Clinic</h4>
//         <p id="contact-address" class="text-sm" style="color: #4a6b62;">450 Medical Center Blvd, Suite 300</p>
//        </div>
//       </div>
//      </div><!-- Office Hours -->
//      <div class="mt-8 p-6 rounded-2xl anim-fade-up delay-7" style="background-color: #ffffff; box-shadow: 0 2px 16px rgba(0,0,0,0.05);">
//       <h3 class="font-heading text-lg mb-4 flex items-center gap-2" style="color: #1a3c34;"><i data-lucide="clock" style="width:18px;height:18px;color:#4ecdc4;"></i> Office Hours</h3>
//       <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
//        <div class="p-3 rounded-xl text-center" style="background-color: #f0f4f3;">
//         <div class="font-semibold" style="color: #1a3c34;">
//          Mon
//         </div>
//         <div style="color: #6b8f85;">
//          9:00 AM – 9:20 AM
//         </div>
//        </div>
//        <div class="p-3 rounded-xl text-center" style="background-color: #f0f4f3;">
//         <div class="font-semibold" style="color: #1a3c34;">
//          Tue – Wed
//         </div>
//         <div style="color: #6b8f85;">
//          9:00 AM – 9:20 AM
//         </div>
//        </div>
//        <div class="p-3 rounded-xl text-center" style="background-color: #f0f4f3;">
//         <div class="font-semibold" style="color: #1a3c34;">
//          Thu – Fri
//         </div>
//         <div style="color: #6b8f85;">
//          9:00 AM – 9:20 AM
//         </div>
//        </div>
//        <div class="p-3 rounded-xl text-center" style="background-color: #f0f4f3;">
//         <div class="font-semibold" style="color: #1a3c34;">
//          Sat – Sun
//         </div>
//         <div style="color: #6b8f85;">
//          9:00 AM – 9:20 AM
//         </div>
//        </div>
//       </div>
//      </div>
//     </div>
//    </section><!-- Booking Forms Section -->
//    <section class="w-full px-6 py-14" style="background: linear-gradient(135deg, #1a3c34 0%, #2d6a5a 60%, #3a8b78 100%);">
//     <div class="max-w-5xl mx-auto">
//      <div class="text-center mb-12 anim-fade-up">
//       <h2 class="font-heading text-2xl md:text-3xl mb-2" style="color: #ffffff;">Book Your Consultation</h2>
//       <p class="text-sm" style="color: rgba(255,255,255,0.7);">Choose between in-clinic or online consultation</p>
//      </div>
//      <div class="grid md:grid-cols-2 gap-8"><!-- In-Clinic Appointment Form -->
//       <div class="anim-fade-up delay-2 p-7 rounded-2xl" style="background-color: #ffffff;">
//        <div class="flex items-center gap-3 mb-6">
//         <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: #4ecdc4;"><i data-lucide="calendar" style="width:20px;height:20px;color:#1a3c34;"></i>
//         </div>
//         <h3 class="font-heading text-xl" style="color: #1a3c34;">In-Clinic Appointment</h3>
//        </div>
//        <form id="clinic-form" onsubmit="handleClinicBooking(event)">
//         <div class="space-y-4">
//          <div><label for="clinic-name-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Full Name</label> <input type="text" id="clinic-name-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;" placeholder="Your name">
//          </div>
//          <div><label for="clinic-phone-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Phone Number</label> <input type="tel" id="clinic-phone-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;" placeholder="Your phone number">
//          </div>
//          <div><label for="clinic-email-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Email Address</label> <input type="email" id="clinic-email-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;" placeholder="your@email.com">
//          </div>
//          <div><label for="clinic-date-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Preferred Date</label> <input type="date" id="clinic-date-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;">
//          </div>
//          <div><label for="clinic-time-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Preferred Time</label> <input type="time" id="clinic-time-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;">
//          </div>
//          <div><label for="clinic-reason-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Reason for Visit</label> <textarea id="clinic-reason-input" rows="3" class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;" placeholder="Briefly describe your symptoms or concerns"></textarea>
//          </div><button type="submit" class="w-full px-4 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg" style="background-color: #4ecdc4; color: #1a3c34;"> <i data-lucide="check-circle" style="width:16px;height:16px;display:inline;margin-right:8px;"></i> Book Appointment </button>
//         </div>
//        </form>
//        <div id="clinic-success" style="display:none; margin-top:12px; padding:12px; border-radius:8px; background-color:#dff0ed; color:#1a3c34; font-size:14px; text-align:center;">
//         ✓ Your appointment request has been submitted successfully!
//        </div>
//       </div><!-- Online Consultation Form -->
//       <div class="anim-fade-up delay-4 p-7 rounded-2xl" style="background-color: #ffffff;">
//        <div class="flex items-center gap-3 mb-6">
//         <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background-color: #4ecdc4;"><i data-lucide="video" style="width:20px;height:20px;color:#1a3c34;"></i>
//         </div>
//         <h3 class="font-heading text-xl" style="color: #1a3c34;">Online Consultation</h3>
//        </div>
//        <form id="online-form" onsubmit="handleOnlineBooking(event)">
//         <div class="space-y-4">
//          <div><label for="online-name-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Full Name</label> <input type="text" id="online-name-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;" placeholder="Your name">
//          </div>
//          <div><label for="online-phone-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Phone Number</label> <input type="tel" id="online-phone-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;" placeholder="Your phone number">
//          </div>
//          <div><label for="online-email-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Email Address</label> <input type="email" id="online-email-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;" placeholder="your@email.com">
//          </div>
//          <div><label for="online-date-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Preferred Date</label> <input type="date" id="online-date-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;">
//          </div>
//          <div><label for="online-time-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Preferred Time</label> <input type="time" id="online-time-input" required class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;">
//          </div>
//          <div><label for="online-concern-input" class="block text-xs font-semibold mb-2 uppercase tracking-wide" style="color: #6b8f85;">Health Concern</label> <textarea id="online-concern-input" rows="3" class="w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2" style="border-color: #e0e0e0;" placeholder="Describe your health concern in detail"></textarea>
//          </div><button type="submit" class="w-full px-4 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-lg" style="background-color: #4ecdc4; color: #1a3c34;"> <i data-lucide="send" style="width:16px;height:16px;display:inline;margin-right:8px;"></i> Schedule Consultation </button>
//         </div>
//        </form>
//        <div id="online-success" style="display:none; margin-top:12px; padding:12px; border-radius:8px; background-color:#dff0ed; color:#1a3c34; font-size:14px; text-align:center;">
//         ✓ Your consultation request has been submitted successfully!
//        </div>
//       </div>
//      </div>
//     </div>
//    </section><!-- Footer -->
//    <footer class="w-full px-6 py-8 text-center" style="background-color: #1a3c34;">
//     <p class="text-xs" style="color: rgba(168,237,232,0.5);">© 2025 Dr. Sarah Mitchell Cardiology · All rights reserved</p>
//    </footer>
//   </div>
//   <script>
//     const defaultConfig = {
//       background_color: '#f0f4f3',
//       surface_color: '#ffffff',
//       text_color: '#1a3c34',
//       primary_action_color: '#4ecdc4',
//       secondary_action_color: '#2d6a5a',
//       font_family: 'DM Serif Display',
//       font_size: 16,
//       doctor_name: 'Dr. Awais Anwar',
//       specialty: 'Cardiologist',
//       clinic_name: 'Kohat Medical Center',
//       about_text: 'This is the about para about the doctor.',
//       phone_number: '1-300-1234567',
//       email_address: 'awaisanwarktk@gmail.com',
//       clinic_address: 'Kohat Cantt'
//     };

//     function applyConfig(config) {
//       const bg = config.background_color || defaultConfig.background_color;
//       const surface = config.surface_color || defaultConfig.surface_color;
//       const text = config.text_color || defaultConfig.text_color;
//       const primary = config.primary_action_color || defaultConfig.primary_action_color;
//       const secondary = config.secondary_action_color || defaultConfig.secondary_action_color;
//       const fontFamily = config.font_family || defaultConfig.font_family;
//       const fontSize = config.font_size || defaultConfig.font_size;

//       // Background color
//       document.getElementById('app-wrapper').style.backgroundColor = bg;

//       // Text content updates
//       document.getElementById('hero-name').textContent = config.doctor_name || defaultConfig.doctor_name;
//       document.getElementById('hero-specialty').textContent = config.specialty || defaultConfig.specialty;
//       if (document.getElementById('clinic-name')) {
//         document.getElementById('clinic-name').textContent = config.clinic_name || defaultConfig.clinic_name;
//       }
//       document.getElementById('hero-tagline').textContent = config.about_text || defaultConfig.about_text;
//       document.getElementById('about-text').textContent = config.about_text || defaultConfig.about_text;
//       document.getElementById('contact-phone').textContent = config.phone_number || defaultConfig.phone_number;
//       document.getElementById('contact-email').textContent = config.email_address || defaultConfig.email_address;
//       document.getElementById('contact-address').textContent = config.clinic_address || defaultConfig.clinic_address;

//       // Apply heading font
//       const headingStack = `${fontFamily}, serif`;
//       document.querySelectorAll('.font-heading').forEach(el => {
//         el.style.fontFamily = headingStack;
//       });

//       // Font size scaling
//       document.getElementById('hero-name').style.fontSize = `${fontSize * 3}px`;
//       document.getElementById('hero-specialty').style.fontSize = `${fontSize * 1.25}px`;
//       document.getElementById('hero-tagline').style.fontSize = `${fontSize * 0.9}px`;
//       document.getElementById('about-text').style.fontSize = `${fontSize}px`;

//       // Colors on surfaces
//       document.querySelectorAll('[style*="background-color: #ffffff"], [style*="background-color: #fff"]').forEach(el => {
//         // Only surface cards
//       });

//       // Primary action button
//       const btnBook = document.getElementById('btn-book');
//       if (btnBook) {
//         btnBook.style.backgroundColor = primary;
//         btnBook.style.color = text;
//       }

//       // Stat cards bg
//       document.querySelectorAll('.stat-card').forEach(el => {
//         el.style.backgroundColor = bg;
//       });
//       document.querySelectorAll('.stat-card .font-heading').forEach(el => {
//         el.style.color = text;
//       });

//       // Section backgrounds
//       document.querySelectorAll('#about-section, #contact-section').forEach(el => {
//         el.style.backgroundColor = bg;
//       });

//       // Service pills
//       const pillBg = primary + '22';
//       document.querySelectorAll('.service-pill').forEach(el => {
//         el.style.backgroundColor = pillBg;
//         el.style.color = text;
//       });

//       // Review cards
//       document.querySelectorAll('.review-card').forEach(el => {
//         el.style.backgroundColor = bg;
//       });

//       // Surface cards
//       document.querySelectorAll('.review-card p:last-child, .stat-card .font-heading').forEach(el => {
//         el.style.color = text;
//       });

//       // Header gradient
//       const header = document.querySelector('header');
//       if (header) {
//         header.style.background = `linear-gradient(135deg, ${text} 0%, ${secondary} 60%, ${primary}88 100%)`;
//       }

//       // Footer
//       const footer = document.querySelector('footer');
//       if (footer) footer.style.backgroundColor = text;

//       // Office hours cards
//       document.querySelectorAll('.grid-cols-2.md\\:grid-cols-4 > div, .grid.grid-cols-2 > div').forEach(el => {
//         if (el.classList.contains('p-3')) {
//           el.style.backgroundColor = bg;
//         }
//       });
//     }

//     window.elementSdk.init({
//       defaultConfig,
//       onConfigChange: async (config) => {
//         applyConfig(config);
//       },
//       mapToCapabilities: (config) => ({
//         recolorables: [
//           {
//             get: () => config.background_color || defaultConfig.background_color,
//             set: (v) => { config.background_color = v; window.elementSdk.setConfig({ background_color: v }); }
//           },
//           {
//             get: () => config.surface_color || defaultConfig.surface_color,
//             set: (v) => { config.surface_color = v; window.elementSdk.setConfig({ surface_color: v }); }
//           },
//           {
//             get: () => config.text_color || defaultConfig.text_color,
//             set: (v) => { config.text_color = v; window.elementSdk.setConfig({ text_color: v }); }
//           },
//           {
//             get: () => config.primary_action_color || defaultConfig.primary_action_color,
//             set: (v) => { config.primary_action_color = v; window.elementSdk.setConfig({ primary_action_color: v }); }
//           },
//           {
//             get: () => config.secondary_action_color || defaultConfig.secondary_action_color,
//             set: (v) => { config.secondary_action_color = v; window.elementSdk.setConfig({ secondary_action_color: v }); }
//           }
//         ],
//         borderables: [],
//         fontEditable: {
//           get: () => config.font_family || defaultConfig.font_family,
//           set: (v) => { config.font_family = v; window.elementSdk.setConfig({ font_family: v }); }
//         },
//         fontSizeable: {
//           get: () => config.font_size || defaultConfig.font_size,
//           set: (v) => { config.font_size = v; window.elementSdk.setConfig({ font_size: v }); }
//         }
//       }),
//       mapToEditPanelValues: (config) => new Map([
//         ['doctor_name', config.doctor_name || defaultConfig.doctor_name],
//         ['specialty', config.specialty || defaultConfig.specialty],
//         ['clinic_name', config.clinic_name || defaultConfig.clinic_name],
//         ['about_text', config.about_text || defaultConfig.about_text],
//         ['phone_number', config.phone_number || defaultConfig.phone_number],
//         ['email_address', config.email_address || defaultConfig.email_address],
//         ['clinic_address', config.clinic_address || defaultConfig.clinic_address]
//       ])
//     });

//     // Form handlers
//     function handleClinicBooking(event) {
//       event.preventDefault();
//       const form = document.getElementById('clinic-form');
//       const successMsg = document.getElementById('clinic-success');
      
//       const data = {
//         type: 'in-clinic',
//         name: document.getElementById('clinic-name-input').value,
//         phone: document.getElementById('clinic-phone-input').value,
//         email: document.getElementById('clinic-email-input').value,
//         date: document.getElementById('clinic-date-input').value,
//         time: document.getElementById('clinic-time-input').value,
//         reason: document.getElementById('clinic-reason-input').value,
//         submittedAt: new Date().toISOString()
//       };
      
//       // Store in localStorage for demonstration
//       const clinicBookings = JSON.parse(localStorage.getItem('clinicBookings') || '[]');
//       clinicBookings.push(data);
//       localStorage.setItem('clinicBookings', JSON.stringify(clinicBookings));
      
//       console.log('Clinic Booking Submitted:', data);
      
//       // Show success message
//       successMsg.style.display = 'block';
//       form.reset();
      
//       // Hide success message after 5 seconds
//       setTimeout(() => {
//         successMsg.style.display = 'none';
//       }, 5000);
//     }

//     function handleOnlineBooking(event) {
//       event.preventDefault();
//       const form = document.getElementById('online-form');
//       const successMsg = document.getElementById('online-success');
      
//       const data = {
//         type: 'online',
//         name: document.getElementById('online-name-input').value,
//         phone: document.getElementById('online-phone-input').value,
//         email: document.getElementById('online-email-input').value,
//         date: document.getElementById('online-date-input').value,
//         time: document.getElementById('online-time-input').value,
//         concern: document.getElementById('online-concern-input').value,
//         submittedAt: new Date().toISOString()
//       };
      
//       // Store in localStorage for demonstration
//       const onlineBookings = JSON.parse(localStorage.getItem('onlineBookings') || '[]');
//       onlineBookings.push(data);
//       localStorage.setItem('onlineBookings', JSON.stringify(onlineBookings));
      
//       console.log('Online Consultation Submitted:', data);
      
//       // Show success message
//       successMsg.style.display = 'block';
//       form.reset();
      
//       // Hide success message after 5 seconds
//       setTimeout(() => {
//         successMsg.style.display = 'none';
//       }, 5000);
//     }

//     // Initialize icons
//     lucide.createIcons();
//   </script>
//  <script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9de8affcb2ca9086',t:'MTc3Mzg4MzU3MS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script></body>
// </html>