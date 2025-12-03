import { Project, Service } from './types';

// Raw data provided by user
export const PROJECTS: Project[] = [
    {
      "id": "project-axtech",
      "name": "Axtech Shop",
      "description": "B2B ordering app for AXTECH one of the largest LED and HVAC supplier in France",
      "icon": "/icons/sites.png",
      "tags": ["E-commerce", "B2B", "React Native"],
      "screenshots": ["/assets/screenshots/AXTECH Shop1.png", "/assets/screenshots/AXTECH Shop2.png"],
      "tech": ["React native", "Firebase", "Appsmith"],
      "url": "https://axtech.fr",
      "client": "AXTECH",
      "year": "2024",
      "featured": true
    },
    {
      "id": "project-wegrid",
      "name": "WEGRID",
      "description": "AI powered Home optimisation and energy storage device to save energy bill (website)",
      "icon": "/icons/internet.png",
      "tags": ["AI", "Energy", "Web"],
      "screenshots": ["/assets/screenshots/Wegrid.png", "/assets/screenshots/Wegrid2.png"],
      "tech": ["Framer"],
      "url": "https://wegrid.framer.website",
      "client": "WEGRID",
      "year": "2024",
      "featured": true
    },
    {
      "id": "project-thaleos",
      "name": "Thaleos",
      "description": "iOS & Android App for controlling smart home devices",
      "icon": "/icons/applications.png",
      "tags": ["Smart Home", "IoT", "Mobile App"],
      "screenshots": ["/assets/screenshots/Thaleos1.png"],
      "tech": ["Tuya IOT APIs", "Go", "Redis", "Postgres", "React"],
      "url": "https://play.google.com/store/apps/details?id=com.thaleos.app",
      "client": "Thaleos",
      "year": "2024",
      "featured": true
    },
    {
      "id": "project-wattconnect-app",
      "name": "WattConnect (App)",
      "description": "iOS & Android App for controlling smart home devices",
      "icon": "/icons/applications.png",
      "tags": ["Smart Home", "IoT", "Mobile App"],
      "screenshots": ["/assets/screenshots/Wattconnect1.png"],
      "tech": ["Tuya IOT APIs", "Go", "Redis", "Postgres", "React"],
      "url": "https://play.google.com/store/apps/details?id=com.wattconnect.app",
      "client": "WattConnect",
      "year": "2024",
      "featured": true
    },
    {
      "id": "project-youblock",
      "name": "Youblock",
      "description": "Solar energy mining device to tokenise the excess solar energy (website), (WebApp)",
      "icon": "/icons/documents.png",
      "tags": ["Blockchain", "Energy", "WebApp"],
      "screenshots": ["/assets/screenshots/Youblock1.png"],
      "tech": ["React", "HTML", "Solidity"],
      "url": "https://youblock.io",
      "client": "Youblock",
      "year": "2022",
      "featured": false
    },
    {
      "id": "project-senseplay",
      "name": "Senseplay",
      "description": "Biofeedback wearable for gaming (Hardware)",
      "icon": "/icons/images.png",
      "tags": ["Hardware", "Gaming", "Biofeedback"],
      "screenshots": ["/assets/screenshots/Senseplay1.png", "/assets/screenshots/Senseplay2.png"],
      "tech": ["Embedded C", "ESP32", "BLE", "Autocad", "UE4", "Blender"],
      "url": "https://senseplay.me",
      "client": "Senseplay",
      "year": "2020",
      "featured": false
    },
    {
      "id": "project-tokenofme",
      "name": "Tokenofme",
      "description": "Tokenisation of inner wellbeing (iOS and android app, webapp)",
      "icon": "/icons/ipod.png",
      "tags": ["Wellbeing", "Mobile App", "WebApp", "Blockchain"],
      "screenshots": ["/assets/screenshots/Tokenofme1.png"],
      "tech": ["Swift", "Kotlin", "Python", "Solidity", "WatchOS"],
      "url": "https://tokenofme.io",
      "client": "Tokenofme",
      "year": "2021",
      "featured": true
    },
    {
      "id": "project-brightme",
      "name": "BrightMe",
      "description": "An AI based matchmaking app to connect influencers with the brands (iOS, Andorid app, Website)",
      "icon": "/icons/applications.png",
      "tags": ["AI", "Matchmaking", "Mobile App", "Web"],
      "screenshots": ["/assets/screenshots/Brightme1.png", "/assets/screenshots/Brightme2.png", "/assets/screenshots/Brightme3.png"],
      "tech": ["React native", "React", "Firebase", "Framer"],
      "url": "https://brightme.io",
      "client": "BrightMe",
      "year": "2024",
      "featured": true
    },
    {
      "id": "project-instal",
      "name": "Instal",
      "description": "A platform to connect home owners with installation providers, for installing and serving of devices. (iOS,Android app, Website)",
      "icon": "/icons/sites.png",
      "tags": ["Platform", "Home Services", "Mobile App", "Web"],
      "screenshots": ["/assets/screenshots/Instal.png"],
      "tech": ["PHP", "Flutter", "VueJS", "Framer"],
      "url": "https://instalhub.fr",
      "client": "Instal",
      "year": "2024",
      "featured": true
    },
    {
      "id": "project-vibrasonix",
      "name": "Vibrasonix",
      "description": "An ecosystem of vibroacoustic technologies and devices for biofield tuning (iOS, Android App, Webshop, website)",
      "icon": "/icons/images.png",
      "tags": ["Health Tech", "Mobile App", "Webshop", "Vibroacoustic"],
      "screenshots": ["/assets/screenshots/Vibrasonix1.png", "/assets/screenshots/Vibrasonix2.png"],
      "tech": ["Flutter", "Wordpress", "Woocommerce", "Blender"],
      "url": "https://vibrasonix.shop",
      "client": "Vibrasonix",
      "year": "2020",
      "featured": true
    },
    {
      "id": "project-bezly",
      "name": "Bezly",
      "description": "A chrome plugin for creating summary amazon reviews",
      "icon": "/icons/applications.png",
      "tags": ["Browser Extension", "AI", "E-commerce Tool"],
      "screenshots": ["/assets/screenshots/Bezly.png", "/assets/screenshots/Bezly2.png"],
      "tech": ["ReactJs", "OpenAI APIs"],
      "url": "https://bezly.com",
      "client": "Bezly",
      "year": "2023",
      "featured": false
    },
    {
      "id": "project-ask-abraham",
      "name": "Ask Abraham",
      "description": "A telegram bot to interact with Abraham hicks AI trained on 1000+ public videos",
      "icon": "/icons/applications.png",
      "tags": ["AI", "Telegram Bot", "Chatbot"],
      "screenshots": ["/assets/screenshots/AskAbraham.png"],
      "tech": ["Python", "Fast API"],
      "url": null,
      "client": "Thoughtseed",
      "year": "2023",
      "featured": false
    },
    {
      "id": "project-uvyield",
      "name": "UVYield",
      "description": "An AI Based app to calculate the most optimal photovoltaic system for your home.",
      "icon": "/icons/sounds.png",
      "tags": ["AI", "Energy", "Photovoltaic", "Mobile App"],
      "screenshots": ["/assets/screenshots/UVyield1.png"],
      "tech": ["Python", "ReactJS", "FastAPI"],
      "url": null,
      "client": "N/A",
      "year": "N/A",
      "featured": false
    },
    {
      "id": "project-maximum-protocol",
      "name": "Maximum Protocol",
      "description": "An AI based portfolio management and optimisation tool for cryptocurrencies investment",
      "icon": "/icons/documents.png",
      "tags": ["AI", "Crypto", "Finance", "Portfolio Management"],
      "screenshots": ["/assets/screenshots/Maximum Protocol1.png", "/assets/screenshots/Maximum Protocol2.png", "/assets/screenshots/Maximum Protocol3.png", "/assets/screenshots/Maximum Protocol4.png"],
      "tech": ["ReactJS", "HTML", "Python"],
      "url": "https://maximumprotocol.io",
      "client": "N/A",
      "year": "N/A",
      "featured": false
    },
    {
      "id": "project-fmrl",
      "name": "FMRL",
      "description": "Frequency modulated reality lens is an image processing technique to visualise the light interference patterns",
      "icon": "/icons/images.png",
      "tags": ["Image Processing", "Visualization", "Optics"],
      "screenshots": ["/assets/screenshots/FMRL.png"],
      "tech": ["OpenCV", "Python", "Touchdesigner"],
      "url": "https://fmrl.cam",
      "client": "Thoughtseed",
      "year": "2024",
      "featured": false
    },
    {
      "id": "project-frag-das-gesetz",
      "name": "frag-das-gesetz",
      "description": "An AI Legal assistant trained on German state and federal law (RAG)",
      "icon": "/icons/documents.png",
      "tags": ["AI", "Legal Tech", "RAG", "Assistant"],
      "screenshots": ["/assets/screenshots/frag-das-gesetz1.png", "/assets/screenshots/frag-das-gesetz2.png"],
      "tech": ["Python", "React", "OpenAI"],
      "url": "https://frag-das-gesetz.de",
      "client": "Whatslegal",
      "year": "2023",
      "featured": true
    },
    {
      "id": "project-namma-music",
      "name": "Namma Music",
      "description": "A modern discography website of Sandeep Chowta's Namma Music Record Label with 50+ albums released",
      "icon": "/icons/sites.png",
      "tags": ["Music", "Discography", "Website", "CMS", "NFT"],
      "screenshots": ["/assets/screenshots/NammaMusic.png", "/assets/screenshots/NammaMusic1.png"],
      "tech": ["AWS Lightsail", "Wordpress", "Notion CMS", "NFT Series"],
      "url": "https://nammamusic.com",
      "client": "Sandeep Chowta",
      "year": "2022",
      "featured": true
    },
    {
      "id": "project-sandbox-life",
      "name": "Sandbox Life",
      "description": "Behavioral assessment platform combining AI and gamification for personal and team development.",
      "icon": "/icons/applications.png",
      "tags": ["AI", "Gamification", "HR Tech", "Assessment"],
      "screenshots": ["/assets/screenshots/Sandboxlife1.png", "/assets/screenshots/Sandboxlife2.png"],
      "tech": ["React js", "Framer", "Supabase"],
      "url": "https://sandboxlife.org",
      "client": "Valore Ventures",
      "year": "2024",
      "featured": false
    },
    {
      "id": "project-brandbook",
      "name": "Brandbook",
      "description": "An AI based Brandbook generator",
      "icon": "/icons/music.png",
      "tags": ["AI", "Brandbook", "Generator"],
      "screenshots": ["/assets/screenshots/BrandbookAI.png"],
      "tech": ["React Native (Draftbit)"],
      "url": "https://www.mybrandbookai.online/",
      "client": "Thoughtseed",
      "year": "2025",
      "featured": false
    },
    {
      "id": "project-eliteprize",
      "name": "ElitePrize",
      "description": "An online platform that hosts premium, transparent raffles where users buy tickets for a chance to win high-value luxury prizes.",
      "icon": "/icons/documents.png",
      "tags": ["WebApp", "Lottery", "DeFi", "Platform"],
      "screenshots": ["/assets/screenshots/ElitePrize.png"],
      "tech": ["Solidity", "Nextjs", "Python", "FastAPI"],
      "url": "https://luxewin-user-webapp.vercel.app/",
      "client": "Eliteprize UK",
      "year": "2024",
      "featured": false
    },
    {
      "id": "project-luxewin",
      "name": "Luxewin Protocol",
      "description": "An on-chain raffle system with a deflationary tokenomics model",
      "icon": "/icons/documents.png",
      "tags": ["Blockchain", "Lottery", "DeFi", "Tokenomics"],
      "screenshots": ["/assets/screenshots/luxewin.png"],
      "tech": ["Solidity", "Nextjs", "Python", "FastAPI"],
      "url": "https://github.com/Sheshiyer/luxewin-protocol",
      "client": "Thoughtseed",
      "year": "2024",
      "featured": false
    },
    {
      "id": "project-heyzack-smart-home",
      "name": "HeyZack - Smart Home Automation System",
      "description": "Smart Home Automation System",
      "icon": "/icons/applications.png",
      "tags": ["Smart Home", "Automation", "IoT"],
      "screenshots": ["/assets/screenshots/Heyzack1.jpeg", "/assets/screenshots/Heyzack2.png"],
      "tech": ["HEY ZACK"],
      "url": null,
      "client": "N/A",
      "year": "N/A",
      "featured": false
    },
    {
      "id": "project-symphonics-suvi-conso",
      "name": "Symphonics Suvi Conso",
      "description": "Energy consumption tracking application integrated with enedis",
      "icon": "/icons/sound.png",
      "tags": ["Energy", "Tracking", "Application", "Integration"],
      "screenshots": ["/assets/screenshots/SuviConso.png"],
      "tech": ["Python", "React", "NextJS"],
      "url": null,
      "client": "N/A",
      "year": "N/A",
      "featured": false
    },
    {
      "id": "project-automatAi",
      "name": "AutomatAi",
      "description": "AI based automation platform",
      "icon": "/icons/sound.png",
      "tags": ["AI", "Automation", "Platform"],
      "screenshots": ["/assets/screenshots/AutomatAI.png"],
      "tech": ["Python", "React", "NextJS"],
      "url": null,
      "client": "Thoughtseed",
      "year": "2025",
      "featured": false
    }
];

export const SERVICES: Service[] = [
    {
      "id": "service-brand-strategy",
      "name": "Brand Strategy",
      "description": "Develop a cohesive and compelling brand identity that resonates with your target audience and sets you apart from competitors.",
      "icon": "🎯",
      "tags": ["Strategy", "Branding", "Marketing"],
      "approach": "We start with deep market research and audience analysis to understand your unique positioning. Our collaborative workshops help define your brand voice, values, and visual identity.",
      "benefits": [
        "Consistent brand messaging across all channels",
        "Increased brand recognition and recall",
        "Stronger emotional connection with customers",
        "Clear differentiation from competitors"
      ],
      "deliverables": [
        "Brand positioning statement",
        "Brand voice and tone guidelines",
        "Visual identity system",
        "Brand implementation strategy"
      ],
      "featured": true
    },
    {
      "id": "service-growth-marketing",
      "name": "Growth Marketing",
      "description": "Data-driven strategies to expand your market reach and drive sustainable business growth.",
      "icon": "📈",
      "tags": ["Marketing", "Growth", "Analytics"],
      "approach": "We implement a metrics-focused approach that combines creative campaigns with rigorous testing and optimization. Our growth framework identifies key opportunities and eliminates bottlenecks in your customer journey.",
      "benefits": [
        "Increased customer acquisition and retention",
        "Higher conversion rates across marketing channels",
        "Optimized marketing spend and ROI",
        "Scalable growth systems that evolve with your business"
      ],
      "deliverables": [
        "Growth marketing roadmap",
        "Channel strategy and prioritization",
        "Analytics dashboard and reporting",
        "A/B testing framework and implementation"
      ],
      "featured": true
    },
    {
      "id": "service-web-development",
      "name": "Web Development",
      "description": "Custom web solutions tailored to your business needs, from responsive websites to complex web applications.",
      "icon": "💻",
      "tags": ["Development", "Web", "Technology"],
      "approach": "We follow a user-centered design process combined with agile development methodologies. Our solutions prioritize performance, accessibility, and scalability while delivering exceptional user experiences.",
      "benefits": [
        "Fast-loading, responsive websites that work on all devices",
        "Intuitive user interfaces that drive conversions",
        "Scalable architecture that grows with your business",
        "SEO-friendly code structure for better visibility"
      ],
      "deliverables": [
        "Custom website or web application",
        "Content management system integration",
        "Performance optimization",
        "Analytics implementation",
        "Maintenance and support plan"
      ],
      "featured": true
    },
    {
      "id": "service-ui-ux-design",
      "name": "UI/UX Design",
      "description": "Intuitive interfaces and seamless user experiences that delight your customers and drive business results.",
      "icon": "🎨",
      "tags": ["Design", "User Experience", "Interface"],
      "approach": "We combine user research, information architecture, and visual design to create experiences that are both beautiful and functional. Our iterative design process ensures continuous improvement based on user feedback.",
      "benefits": [
        "Increased user engagement and satisfaction",
        "Reduced friction in user journeys",
        "Higher conversion rates and customer retention",
        "Consistent experience across all touchpoints"
      ],
      "deliverables": [
        "User research and personas",
        "Information architecture",
        "Wireframes and prototypes",
        "UI design system",
        "Usability testing and recommendations"
      ],
      "featured": true
    },
    {
      "id": "service-mobile-apps",
      "name": "Mobile Apps",
      "description": "Native and cross-platform mobile applications that provide seamless experiences on iOS and Android devices.",
      "icon": "📱",
      "tags": ["Mobile", "Development", "Apps"],
      "approach": "We build mobile applications with a focus on performance, usability, and platform-specific best practices. Our expertise spans native development (iOS/Android) and cross-platform frameworks for efficient delivery.",
      "benefits": [
        "Engaging mobile experiences that users love",
        "Optimized performance and battery usage",
        "Seamless integration with device features",
        "Consistent updates and maintenance"
      ],
      "deliverables": [
        "Native or cross-platform mobile application",
        "Backend integration and API development",
        "App store optimization and submission",
        "Analytics implementation",
        "Ongoing support and updates"
      ],
      "featured": true
    },
    {
      "id": "service-ai-integration",
      "name": "AI Integration",
      "description": "Leverage artificial intelligence to automate processes, gain insights, and create personalized user experiences.",
      "icon": "🤖",
      "tags": ["AI", "Machine Learning", "Automation"],
      "approach": "We identify high-impact opportunities for AI integration within your business processes and products. Our solutions combine pre-built AI services with custom models tailored to your specific needs.",
      "benefits": [
        "Automated workflows that save time and resources",
        "Personalized user experiences that drive engagement",
        "Data-driven insights for better decision making",
        "Competitive advantage through innovation"
      ],
      "deliverables": [
        "AI strategy and roadmap",
        "Custom AI model development or integration",
        "API and system integration",
        "Performance monitoring and optimization",
        "Knowledge transfer and documentation"
      ],
      "featured": true
    }
];