import React, { useState, useEffect } from 'react';
import { Rocket, Target, Shield, Home, Menu, X, Radio, Crosshair } from 'lucide-react';

const AsteroidWebsite = () => {
  const [currentPage, setCurrentPage] = useState('main');
  const [menuOpen, setMenuOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  const Navigation = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-md border-b border-orange-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('main')}>
            <Rocket className="text-orange-500" size={32} />
            <span className="text-white text-xl font-bold hidden sm:block">Asteroid Defense System</span>
            <span className="text-white text-xl font-bold sm:hidden">ADS</span>
          </div>
          
          <div className="flex space-x-2">
            <NavButton page="main" label="Home" />
            <NavButton page="education" label="Education" />
            <NavButton page="tracking" label="Tracking" />
            <NavButton page="impact" label="Impact Simulator" />
          </div>
        </div>
      </div>
    </nav>
  );

  const NavButton = ({ page, label }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        if (page === 'main') setAnimationComplete(false);
      }}
      className={`px-4 py-2 rounded-lg transition-all ${
        currentPage === page
          ? 'bg-orange-500 text-black font-semibold shadow-lg shadow-orange-500/50'
          : 'text-white hover:bg-orange-500/20'
      }`}
    >
      {label}
    </button>
  );

  const MobileNavButton = ({ page, label }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setMenuOpen(false);
        if (page === 'main') setAnimationComplete(false);
      }}
      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
        currentPage === page
          ? 'bg-orange-500 text-black font-semibold'
          : 'text-white hover:bg-orange-500/20'
      }`}
    >
      {label}
    </button>
  );

  const MainPage = () => {
    const [meteorPos, setMeteorPos] = useState({ x: -200, y: -200, opacity: 1 });
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
      if (!animationComplete) {
        let progress = 0;
        const duration = 4000;
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          progress = Math.min(elapsed / duration, 1);

          const x = -200 + progress * (window.innerWidth * 0.5 + 200);
          const y = -200 + progress * (window.innerHeight * 0.4 + 200);

          setMeteorPos({ x, y, opacity: 1 });

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setTimeout(() => {
              setAnimationComplete(true);
              setShowContent(true);
            }, 500);
          }
        };

        animate();
      } else {
        setShowContent(true);
      }
    }, []);

    return (
      <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
        animationComplete 
          ? 'bg-gradient-to-b from-gray-900 via-blue-900 to-black' 
          : 'bg-gradient-to-b from-black via-indigo-950 to-black'
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars"></div>
          <div className="stars2"></div>
          <div className="stars3"></div>
        </div>

        {!animationComplete ? (
          <div 
            className="meteor-animated"
            style={{
              left: `${meteorPos.x}px`,
              top: `${meteorPos.y}px`,
              opacity: meteorPos.opacity
            }}
          >
            <div className="meteor-core"></div>
            <div className="meteor-trail"></div>
            <div className="meteor-glow"></div>
          </div>
        ) : (
          <div className="meteor-static">
            <div className="meteor-static-core"></div>
            <div className="meteor-static-glow"></div>
          </div>
        )}

        <div className={`relative z-10 pt-24 pb-16 px-4 transition-opacity duration-1000 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Asteroid Impact
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  Defense System
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                An interactive visualization and simulation platform that enables exploration of asteroid impact scenarios, consequence prediction, and mitigation strategy evaluation using real NASA and USGS datasets.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setCurrentPage('tracking')}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all transform hover:scale-105"
                >
                  Start Tracking
                </button>
                <button 
                  onClick={() => setCurrentPage('education')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all"
                >
                  Learn More
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <FeatureCard
                icon="🌍"
                title="Real-Time Data"
                description="Integration with NASA NEO API for live asteroid tracking and orbital parameters"
              />
              <FeatureCard
                icon="📊"
                title="Impact Analysis"
                description="USGS geological data for tsunami zones, seismic activity, and terrain modeling"
              />
              <FeatureCard
                icon="🎯"
                title="Risk Assessment"
                description="Advanced algorithms to predict impact consequences and affected regions"
              />
              <FeatureCard
                icon="🛡️"
                title="Mitigation Tools"
                description="Evaluate deflection strategies and planetary defense options"
              />
            </div>

            <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-orange-500/30 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-orange-400 mb-6">The Challenge</h2>
              <div className="space-y-4 text-gray-200 text-lg leading-relaxed">
                <p>
                  Our mission is to transform raw astronomical and geological data into a powerful educational and decision-support tool for global asteroid risk management. By combining NASA Near-Earth Object data with USGS environmental datasets, we create comprehensive impact scenarios that help scientists, policymakers, and the public understand and prepare for potential threats.
                </p>
                <p>
                  The platform integrates asteroid parameters including size, velocity, composition, and trajectory with Earth-based data on topography, population density, infrastructure, and geological features. This enables precise modeling of impact effects from initial atmospheric entry through ground impact and subsequent environmental consequences.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <StatCard number="30,000+" label="Tracked Asteroids" />
                <StatCard number="2,000+" label="Near-Earth Objects" />
                <StatCard number="Real-Time" label="Data Updates" />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .stars, .stars2, .stars3 {
            position: absolute;
            width: 2px;
            height: 2px;
            background: white;
            box-shadow: ${Array.from({ length: 300 }, () => 
              `${Math.random() * 2500}px ${Math.random() * 1200}px ${Math.random() > 0.5 ? 'white' : '#a0a0ff'}`
            ).join(',')};
            animation: animStar ${50 + Math.random() * 20}s linear infinite;
          }
          .stars2 { 
            animation-delay: 1s; 
            box-shadow: ${Array.from({ length: 200 }, () => 
              `${Math.random() * 2500}px ${Math.random() * 1200}px ${Math.random() > 0.5 ? '#ffa500' : 'white'}`
            ).join(',')};
          }
          .stars3 { 
            animation-delay: 2s;
            box-shadow: ${Array.from({ length: 150 }, () => 
              `${Math.random() * 2500}px ${Math.random() * 1200}px white`
            ).join(',')};
          }
          
          @keyframes animStar {
            from { transform: translateY(0); }
            to { transform: translateY(-1200px); }
          }

          .meteor-animated {
            position: absolute;
            width: 80px;
            height: 80px;
            transition: none;
            filter: drop-shadow(0 0 30px rgba(255, 107, 0, 0.8));
          }

          .meteor-core {
            position: absolute;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, #fff 0%, #ff6b00 30%, #ff4500 100%);
            border-radius: 50%;
            box-shadow: 0 0 40px 15px rgba(255, 107, 0, 0.8), inset -10px -10px 30px rgba(0,0,0,0.3);
          }

          .meteor-trail {
            position: absolute;
            top: 50%;
            right: 100%;
            width: 300px;
            height: 6px;
            background: linear-gradient(to left, rgba(255, 107, 0, 0.9), rgba(255, 69, 0, 0.5), transparent);
            transform: translateY(-50%);
            box-shadow: 0 0 20px 4px rgba(255, 107, 0, 0.6);
          }

          .meteor-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(255, 107, 0, 0.4), transparent 70%);
            border-radius: 50%;
          }

          .meteor-static {
            position: absolute;
            top: 15%;
            right: 20%;
            width: 120px;
            height: 120px;
            animation: float 6s ease-in-out infinite;
          }

          .meteor-static-core {
            position: absolute;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle at 30% 30%, #fff 0%, #ff8c00 20%, #ff4500 50%, #8b0000 100%);
            border-radius: 50%;
            box-shadow: 0 0 60px 20px rgba(255, 107, 0, 0.6), inset -15px -15px 40px rgba(0,0,0,0.4);
          }

          .meteor-static-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(255, 107, 0, 0.3), transparent 70%);
            border-radius: 50%;
            animation: pulse 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); }
          }

          .animate-slide-up {
            animation: slideUp 1s ease-out;
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  };

  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gray-800/40 backdrop-blur-sm border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/60 hover:shadow-xl hover:shadow-orange-500/20 transition-all transform hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );

  const StatCard = ({ number, label }) => (
    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-orange-500/20 text-center">
      <div className="text-3xl font-bold text-orange-400 mb-2">{number}</div>
      <div className="text-gray-300 text-sm">{label}</div>
    </div>
  );

  const EducationPage = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black pt-24 pb-16 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="stars"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Educational Resources
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Deep dive into the science behind asteroid impacts and planetary defense
            </p>
          </div>

          {!selectedTopic ? (
            <div className="grid md:grid-cols-3 gap-8">
              <TopicCard
                icon={<Target className="w-16 h-16" />}
                title="Orbital Mechanics"
                description="Understanding how asteroids move through space under gravitational influence"
                onClick={() => setSelectedTopic('orbital')}
                gradient="from-purple-500 to-indigo-500"
              />
              <TopicCard
                icon={<Rocket className="w-16 h-16" />}
                title="Impact Physics"
                description="The brutal science of cosmic collisions and energy transfer"
                onClick={() => setSelectedTopic('impact')}
                gradient="from-red-500 to-orange-500"
              />
              <TopicCard
                icon={<Shield className="w-16 h-16" />}
                title="Deflection Strategies"
                description="Methods to protect Earth from potentially hazardous asteroids"
                onClick={() => setSelectedTopic('deflection')}
                gradient="from-green-500 to-teal-500"
              />
            </div>
          ) : (
            <>
              <button
                onClick={() => setSelectedTopic(null)}
                className="mb-8 px-6 py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 transition-all flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Topics</span>
              </button>
              {selectedTopic === 'orbital' && <OrbitalMechanicsContent />}
              {selectedTopic === 'impact' && <ImpactPhysicsContent />}
              {selectedTopic === 'deflection' && <DeflectionStrategiesContent />}
            </>
          )}
        </div>
      </div>
    );
  };

  const TopicCard = ({ icon, title, description, onClick, gradient }) => (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} p-1 rounded-2xl cursor-pointer transform hover:scale-105 transition-all hover:shadow-2xl`}
    >
      <div className="bg-gray-900 rounded-xl p-8 h-full">
        <div className="text-white mb-6">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        <div className="text-orange-400 font-semibold flex items-center space-x-2">
          <span>Explore</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );

  const OrbitalMechanicsContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30">
        <h2 className="text-4xl font-bold text-purple-400 mb-6">Understanding Orbital Mechanics</h2>
        <div className="space-y-6 text-gray-200 text-lg leading-relaxed">
          <p>
            Orbital mechanics is the science that explains how objects move through space under the influence of gravity. Every satellite, asteroid, or meteor follows a predictable path, or orbit, determined by its speed and the gravitational pull of nearby celestial bodies. When a meteor travels through space, it is constantly falling toward Earth due to gravity, but its forward velocity keeps it moving sideways, creating a curved trajectory around the planet. This balance between motion and gravity is what keeps satellites in orbit and shapes how meteors approach Earth.
          </p>
          <p>
            In our project, we use these principles to simulate how a meteor path changes as it interacts with Earth gravity and atmosphere. The visualization begins with the meteor orbital path around the Sun, showing how small changes in velocity or direction caused by natural forces or human interventions can alter its trajectory. As the meteor gets closer to Earth, its orbit bends sharply due to Earth gravitational influence, eventually leading to an impact or a near-miss depending on the initial conditions.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/30">
          <h3 className="text-2xl font-bold text-indigo-400 mb-4">Key Principles</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-start">
              <span className="text-orange-500 mr-3 text-2xl">•</span>
              <span>Objects in motion stay in motion unless acted upon by an external force</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-3 text-2xl">•</span>
              <span>Gravitational force decreases with the square of distance</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-3 text-2xl">•</span>
              <span>Orbital velocity must balance gravitational pull to maintain stable orbit</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-3 text-2xl">•</span>
              <span>Small trajectory changes early can prevent future collisions</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/60 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
          <h3 className="text-2xl font-bold text-purple-400 mb-4">Interactive Features</h3>
          <ul className="space-y-3 text-gray-200">
            <li className="flex items-start">
              <span className="text-orange-500 mr-3 text-2xl">•</span>
              <span>Adjust meteor size, mass, and velocity parameters</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-3 text-2xl">•</span>
              <span>Visualize orbital paths and gravitational interactions</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-3 text-2xl">•</span>
              <span>Calculate impact energy and crater formation</span>
            </li>
            <li className="flex items-start">
              <span className="text-orange-500 mr-3 text-2xl">•</span>
              <span>Experiment with deflection strategies in real-time</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-lg rounded-2xl p-8 border border-indigo-500/30">
        <h2 className="text-3xl font-bold text-indigo-400 mb-6">Bridging Science and Public Awareness</h2>
        <p className="text-gray-200 text-lg leading-relaxed mb-6">
          Our tool allows users to explore this process intuitively. By adjusting parameters like the meteor size, mass, and velocity, users can see how those values affect the orbit and impact outcomes. The simulation dynamically calculates impact energy, crater formation, and potential aftereffects such as seismic waves or atmospheric disturbances. Users can also experiment with deflection strategies, like kinetic impactors, and immediately see how they change the meteor orbit.
        </p>
        <p className="text-gray-200 text-lg leading-relaxed">
          Through animated orbital paths and real-time data visualization, we aim to make orbital mechanics not just understandable but engaging. This bridges the gap between complex astrophysics and public awareness, helping scientists, policymakers, and the public visualize what happens when a meteor threatens Earth and how different responses could change its fate.
        </p>
      </div>
    </div>
  );

  const ImpactPhysicsContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30">
        <h2 className="text-4xl font-bold text-red-400 mb-6">The Brutal Truth of Impact Physics</h2>
        <div className="space-y-6 text-gray-200 text-lg leading-relaxed">
          <p>
            Impact physics is the brutal truth of motion, the science of what happens when one object refuses to stop for another. It studies how energy, mass, and velocity interact when bodies collide, from car crashes on Earth to asteroids striking planets. In the case of Impactor-2025, a newly identified near-Earth asteroid, impact physics helps us understand not only how such a collision happens but also what its consequences could be for our planet.
          </p>
          <p>
            At its core, impact physics is about energy transfer. When an asteroid hits Earth, its enormous kinetic energy is instantly released as heat, shockwaves, and seismic motion. Even a small asteroid traveling at tens of kilometers per second carries energy equivalent to several nuclear bombs. The ground deforms, the atmosphere compresses, and the energy that once existed as motion becomes destruction in the form of craters, tsunamis, and firestorms.
          </p>
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-orange-500/30">
        <h3 className="text-3xl font-bold text-orange-400 mb-6">The Physics of Destruction</h3>
        <div className="space-y-4 text-gray-200 text-lg">
          <p>
            The physics behind this can be described through Newton laws. The asteroid momentum and kinetic energy determine the scale of devastation. A slightly higher velocity can mean exponentially greater energy release. When that energy meets the surface, shockwaves travel through the ground and air, spreading destruction far beyond the point of contact. The Chicxulub impact, for instance, released more energy than all nuclear weapons on Earth combined and permanently altered life on the planet.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-b from-red-900/50 to-orange-900/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
          <h4 className="text-xl font-bold text-red-400 mb-4">Energy Release</h4>
          <p className="text-gray-200 text-sm mb-4">
            Impact energy scales with velocity squared, meaning small speed increases cause exponentially greater destruction.
          </p>
          <div className="text-3xl font-bold text-orange-400">E = ½mv²</div>
        </div>

        <div className="bg-gradient-to-b from-orange-900/50 to-yellow-900/50 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30">
          <h4 className="text-xl font-bold text-orange-400 mb-4">Momentum Transfer</h4>
          <p className="text-gray-200 text-sm mb-4">
            The asteroid momentum determines how much force is transferred to Earth surface upon impact.
          </p>
          <div className="text-3xl font-bold text-orange-400">p = mv</div>
        </div>

        <div className="bg-gradient-to-b from-yellow-900/50 to-red-900/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
          <h4 className="text-xl font-bold text-yellow-400 mb-4">Shockwave Propagation</h4>
          <p className="text-gray-200 text-sm mb-4">
            Energy radiates outward as seismic waves, atmospheric shockwaves, and thermal radiation.
          </p>
          <div className="text-2xl font-bold text-orange-400">Multi-Phase</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 backdrop-blur-lg rounded-2xl p-8 border border-orange-500/30">
        <h2 className="text-3xl font-bold text-orange-400 mb-6">Interactive Modeling</h2>
        <div className="space-y-4 text-gray-200 text-lg leading-relaxed">
          <p>
            In our project, we aim to turn these abstract equations into something interactive and visual. NASA datasets provide real orbital and physical parameters for known asteroids, while the U.S. Geological Survey supplies terrain and geological information. By integrating these two sources, we can model how impacts of different sizes, speeds, and angles would affect specific regions.
          </p>
          <p>
            Our tool will allow users to adjust parameters such as asteroid mass, velocity, and entry angle, and instantly see the results: crater size, energy released, and potential zones of destruction. It is a way to make the invisible forces of physics visible and understandable to everyone, from students to policymakers.
          </p>
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-lg rounded-2xl p-8 border border-red-500/30">
        <h2 className="text-3xl font-bold text-red-400 mb-6">From Fear to Action</h2>
        <p className="text-gray-200 text-lg leading-relaxed">
          Impact physics may sound terrifying, but understanding it is the first step toward mitigation. Knowledge cannot stop an asteroid, yet it can help us prepare, turning fear into informed action before the next Impactor-2025 comes too close.
        </p>
      </div>
    </div>
  );

  const DeflectionStrategiesContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-900/50 to-teal-900/50 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30">
        <h2 className="text-4xl font-bold text-green-400 mb-6">Planetary Defense Strategies</h2>
        <div className="space-y-6 text-gray-200 text-lg leading-relaxed">
          <p>
            Scientists and space agencies worldwide are developing various strategies to deflect potentially hazardous asteroids. The key is early detection and having enough time to mount a deflection mission before the asteroid becomes an imminent threat. Unlike Hollywood movies, deflection does not require explosions or dramatic last-minute heroics. Small, gentle nudges applied years in advance can alter an asteroid trajectory enough to make it miss Earth entirely.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-2xl">🚀</div>
            <h3 className="text-2xl font-bold text-blue-400">Kinetic Impactor</h3>
          </div>
          <p className="text-gray-200 mb-4">
            This method involves crashing a spacecraft into an asteroid at high speed to change its velocity. NASA DART mission successfully demonstrated this technique in 2022 by impacting the asteroid Dimorphos.
          </p>
          <div className="flex items-center space-x-2 text-green-400 font-semibold">
            <span>✓ Proven Technology</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-2xl">🛸</div>
            <h3 className="text-2xl font-bold text-purple-400">Gravity Tractor</h3>
          </div>
          <p className="text-gray-200 mb-4">
            A spacecraft hovers near the asteroid for an extended period, using its gravitational attraction to gradually pull the asteroid off course. This slow but precise method works well for smaller asteroids.
          </p>
          <div className="flex items-center space-x-2 text-yellow-400 font-semibold">
            <span>⚡ Highly Feasible</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-lg rounded-xl p-6 border border-red-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-2xl">💥</div>
            <h3 className="text-2xl font-bold text-red-400">Nuclear Deflection</h3>
          </div>
          <p className="text-gray-200 mb-4">
            For the most dangerous scenarios, a nuclear device could be detonated near an asteroid to vaporize surface material, creating thrust that pushes the asteroid away. This is a last-resort option for large objects with short warning times.
          </p>
          <div className="flex items-center space-x-2 text-orange-400 font-semibold">
            <span>⚠️ Emergency Option</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-900/50 to-green-900/50 backdrop-blur-lg rounded-xl p-6 border border-teal-500/30">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-2xl">⚡</div>
            <h3 className="text-2xl font-bold text-teal-400">Ion Beam Shepherd</h3>
          </div>
          <p className="text-gray-200 mb-4">
            A spacecraft uses ion beams to slowly ablate material from the asteroid surface, creating thrust that alters its trajectory. This method offers precise control and works well with advance warning.
          </p>
          <div className="flex items-center space-x-2 text-cyan-400 font-semibold">
            <span>🔬 In Development</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30">
        <h2 className="text-3xl font-bold text-green-400 mb-6">The Importance of Early Detection</h2>
        <p className="text-gray-200 text-lg leading-relaxed mb-8">
          The success of any deflection strategy depends critically on how much time we have. Organizations like NASA Planetary Defense Coordination Office continuously scan the skies, cataloging near-Earth objects and calculating their orbits decades into the future. The earlier we detect a potential threat, the easier and cheaper it is to deflect.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-900/40 rounded-xl p-6 border border-green-500/40 text-center">
            <div className="text-4xl font-bold text-green-400 mb-3">10+ Years</div>
            <p className="text-gray-300">Ideal warning time for gentle deflection methods</p>
          </div>
          <div className="bg-yellow-900/40 rounded-xl p-6 border border-yellow-500/40 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-3">5-10 Years</div>
            <p className="text-gray-300">Requires more aggressive deflection approaches</p>
          </div>
          <div className="bg-red-900/40 rounded-xl p-6 border border-red-500/40 text-center">
            <div className="text-4xl font-bold text-red-400 mb-3">&lt;5 Years</div>
            <p className="text-gray-300">Limited options, maximum effort required</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/30">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6">Global Cooperation</h2>
        <p className="text-gray-200 text-lg leading-relaxed">
          Asteroid deflection is a global challenge that requires international cooperation. Space agencies from NASA, ESA, JAXA, and others work together to track threats and develop deflection technologies. The United Nations Office for Outer Space Affairs coordinates planetary defense efforts, ensuring that if a threat is detected, humanity can respond with a unified, effective plan.
        </p>
      </div>
    </div>
  );

  const TrackingPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-black pt-24 pb-16 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="stars"></div>
      </div>
    </div>
  );

  const ImpactSimulatorPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-900 to-black pt-24 pb-16 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="stars"></div>
      </div>
    </div>
  );

  return (
    <div className="font-sans antialiased">
      <Navigation />
      {currentPage === 'main' && <MainPage />}
      {currentPage === 'education' && <EducationPage />}
      {currentPage === 'tracking' && <TrackingPage />}
      {currentPage === 'impact' && <ImpactSimulatorPage />}
    </div>
  );
};

export default AsteroidWebsite;
