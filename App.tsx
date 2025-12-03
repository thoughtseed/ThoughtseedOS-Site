import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Marquee from './components/Marquee';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import ProjectShowcase from './components/ProjectShowcase';
import AuroraBackground from './components/AuroraBackground';
import SoundController from './components/SoundController';
import TuyaSection from './components/TuyaSection';
import PhilosophySection from './components/PhilosophySection';
import { PROJECTS, SERVICES } from './constants';
import { ArrowRight, Mail, Instagram, Twitter, Linkedin, MapPin } from 'lucide-react';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Form State
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: 'Web Development',
    message: ''
  });

  // Toggle Theme
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  // Initial Theme Set
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Custom Cursor Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `New Inquiry from ${formState.name} - ${formState.projectType}`;
    const body = `Name: ${formState.name}%0D%0AEmail: ${formState.email}%0D%0AProject Type: ${formState.projectType}%0D%0A%0D%0AMessage:%0D%0A${formState.message}`;
    window.location.href = `mailto:wave@thoughtseed.io?subject=${subject}&body=${body}`;
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 relative ${isDark ? 'text-white' : 'text-neo-black'}`}>

      {/* GLOBAL DYNAMIC BACKGROUND - AURORA */}
      <div className="fixed inset-0 z-0 bg-[#f8f9fa] dark:bg-[#020010] transition-colors duration-500">
        <AuroraBackground isDark={isDark} />
      </div>

      {/* SOUND ENGINE */}
      <SoundController isMuted={isMuted} />

      {/* Custom Cursor */}
      <div
        className="fixed w-6 h-6 rounded-full border border-white bg-neo-lime/80 mix-blend-difference pointer-events-none z-[100] hidden md:block transition-transform duration-100 ease-out shadow-[0_0_15px_rgba(204,255,0,0.8)]"
        style={{ left: mousePosition.x - 12, top: mousePosition.y - 12 }}
      />
      <div
        className="fixed w-2 h-2 rounded-full bg-white pointer-events-none z-[100] hidden md:block transition-all duration-75 ease-out"
        style={{ left: mousePosition.x - 4, top: mousePosition.y - 4 }}
      />

      <Navbar isDark={isDark} toggleTheme={toggleTheme} isMuted={isMuted} toggleSound={toggleSound} />

      <main className="relative z-10 pt-0">
        {/* HERO SECTION - NEW COSMIC PORTAL */}
        <HeroSection />

        <div className="border-y border-gray-300/20 dark:border-white/10 bg-white/20 dark:bg-black/20 backdrop-blur-md">
          <Marquee items={['Strategy', 'Design', 'Development', 'Growth', 'Innovation', 'Future']} speed="slow" className="text-neo-black dark:text-white" />
        </div>

        {/* WORK SECTION (Horizontal Scroll) */}
        {/* Transparent background to let aurora show through */}
        <div id="work" className="relative">
          <ProjectShowcase projects={PROJECTS} />
        </div>

        <div className="bg-neo-lime text-black py-4 border-y-4 border-black relative z-10">
          <Marquee items={['React', 'TypeScript', 'Node.js', 'Python', 'Solidity', 'AWS', 'Design', 'AI']} direction="right" speed="fast" className="text-black" />
        </div>

        {/* TUYA PARTNER SECTION - IMMERSIVE 3D */}
        <TuyaSection />

        {/* SERVICES SECTION - IMMERSIVE */}
        <ServicesSection services={SERVICES} />

        {/* PHILOSOPHY - RESTORED WITH CORE BRAND SLOGAN */}
        <PhilosophySection />

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 relative">
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="flex flex-col justify-between backdrop-blur-md bg-white/30 dark:bg-black/20 p-8 rounded-lg border border-gray-300 dark:border-white/5">
                <div>
                  <h2 className="text-6xl md:text-8xl font-black uppercase mb-8 leading-none text-neo-black dark:text-white">Let's <br /><span className="text-neo-lime drop-shadow-[0_0_10px_#ccff00]">Talk</span></h2>
                  <p className="font-mono text-gray-700 dark:text-gray-300 mb-8">
                    Have a project in mind? We'd love to hear about it. Send us a message and we'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-lg font-bold uppercase text-neo-black dark:text-white">
                    <div className="w-12 h-12 bg-white/10 flex items-center justify-center rounded-full border border-gray-400 dark:border-white/10">
                      <Mail size={20} className="text-neo-cyan" />
                    </div>
                    <a href="mailto:wave@thoughtseed.io" className="hover:text-neo-lime transition-colors">wave@thoughtseed.io</a>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <a href="https://www.instagram.com/thoughtseed.io/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-gray-400 dark:border-white/20 flex items-center justify-center rounded-full hover:bg-neo-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                      <Instagram size={20} />
                    </a>
                    <a href="https://x.com/Thoughtseed11" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-gray-400 dark:border-white/20 flex items-center justify-center rounded-full hover:bg-neo-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                      <Twitter size={20} />
                    </a>
                    <a href="https://www.linkedin.com/company/thought-seed-labs?originalSubdomain=in" target="_blank" rel="noopener noreferrer" className="w-12 h-12 border border-gray-400 dark:border-white/20 flex items-center justify-center rounded-full hover:bg-neo-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6 bg-white/50 dark:bg-white/5 p-8 border border-gray-300 dark:border-white/10 backdrop-blur-md rounded-lg shadow-2xl">
                <div className="flex flex-col">
                  <label className="font-mono font-bold uppercase text-xs mb-2 text-gray-600 dark:text-gray-400">Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="bg-transparent border-b border-gray-400 dark:border-white/20 py-4 focus:outline-none focus:border-neo-lime transition-colors text-neo-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                    placeholder="YOUR NAME"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-mono font-bold uppercase text-xs mb-2 text-gray-600 dark:text-gray-400">Email</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="bg-transparent border-b border-gray-400 dark:border-white/20 py-4 focus:outline-none focus:border-neo-lime transition-colors text-neo-black dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                    placeholder="EMAIL ADDRESS"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-mono font-bold uppercase text-xs mb-2 text-gray-600 dark:text-gray-400">Project Type</label>
                  <select
                    value={formState.projectType}
                    onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                    className="bg-transparent border-b border-gray-400 dark:border-white/20 py-4 focus:outline-none focus:border-neo-lime transition-colors text-neo-black dark:text-white appearance-none rounded-none"
                  >
                    <option className="bg-white dark:bg-black text-black dark:text-white" value="Web Development">Web Development</option>
                    <option className="bg-white dark:bg-black text-black dark:text-white" value="Mobile App">Mobile App</option>
                    <option className="bg-white dark:bg-black text-black dark:text-white" value="AI Integration">AI Integration</option>
                    <option className="bg-white dark:bg-black text-black dark:text-white" value="Brand Strategy">Brand Strategy</option>
                    <option className="bg-white dark:bg-black text-black dark:text-white" value="IoT / Hardware">IoT / Hardware</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="font-mono font-bold uppercase text-xs mb-2 text-gray-600 dark:text-gray-400">Message</label>
                  <textarea
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="bg-transparent border-b border-gray-400 dark:border-white/20 py-4 focus:outline-none focus:border-neo-lime transition-colors text-neo-black dark:text-white resize-none placeholder-gray-500 dark:placeholder-gray-600"
                    placeholder="TELL US ABOUT YOUR IDEA"
                  ></textarea>
                </div>

                <button type="submit" className="bg-neo-black dark:bg-white text-white dark:text-black w-full py-4 font-black uppercase text-xl hover:bg-neo-lime hover:text-black dark:hover:bg-neo-lime transition-colors flex justify-center items-center gap-2 group mt-4 shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_#ccff00]">
                  <span className="group-hover:mr-2 transition-all">Send Message</span> <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white/80 dark:bg-black/80 backdrop-blur-xl text-neo-black dark:text-white py-12 border-t border-gray-300 dark:border-white/10 relative z-10">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="text-left max-w-md">
            <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">Thoughtseed</h3>
            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 font-mono text-xs leading-relaxed mb-4">
              <MapPin size={16} className="shrink-0 mt-1" />
              <p>
                WeWork 38/1A, Salarpuria symbiosis, Arekere village, Begur hobli, Bannerghatta Road, Bannerghatta Road, Bangalore, Bangalore South, Karnataka, India, 560076
              </p>
            </div>
            <p className="font-mono text-gray-500 text-xs">© {new Date().getFullYear()} All Rights Reserved.</p>
          </div>
          <div className="font-mono text-xs text-gray-500 flex flex-col items-end">
            <span>DESIGNED IN THE VOID</span>
            <span className="text-neo-lime mt-2 drop-shadow-[0_0_5px_#ccff00] bg-black px-1">BANGALORE • INDIA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;