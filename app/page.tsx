import { NavHeader } from './components/nav-header'
import { SiteFooter } from './components/site-footer'
import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon, Search } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "../components/magicui/bento-grid";
import { Marquee } from "../components/magicui/marquee";
import { Globe } from "../components/magicui/globe";
import Link from 'next/link'

// Legal documents data for the marquee
const legalFiles = [
  {
    name: "contract.pdf",
    body: "Commercial lease agreement with detailed terms and conditions for property rental arrangements.",
  },
  {
    name: "case-law.pdf", 
    body: "Supreme Court ruling on intellectual property rights establishing new precedent for software patents.",
  },
  {
    name: "statute.pdf",
    body: "Updated employment law regulations covering remote work policies and digital privacy rights.",
  },
  {
    name: "brief.pdf",
    body: "Legal brief for civil litigation case involving corporate liability and damages assessment.",
  },
  {
    name: "motion.pdf",
    body: "Motion to dismiss filed in federal court with supporting case citations and legal arguments.",
  },
];

// Bento grid features
const features = [
  {
    Icon: () => <div className="opacity-0" />,
    name: "Instant Case Analysis",
    description: "AI that works with you — digest complex cases in seconds with intelligent breakdowns and citation tracking.",
    href: "/research",
    cta: "Experience it",
    className: "col-span-3 lg:col-span-3",
    background: (
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/60 [mask-image:linear-gradient(to_top,transparent_5%,#000_95%)]">
        <div className="absolute top-4 left-4 right-4 grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          
          {/* Key Issues Panel */}
          <div className="space-y-3">
            <div className="bg-white/25 backdrop-blur-md border border-white/40 rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-white rounded"></div>
                <span className="text-white text-sm font-semibold drop-shadow-md">Key Issues</span>
              </div>
              <div className="space-y-2">
                <div className="text-white/95 text-xs leading-relaxed mb-2 drop-shadow-sm">
                  Whether exceptional circumstances exist to warrant Court wardship
                </div>
                <div className="flex gap-2">
                  <button className="bg-white/25 hover:bg-white/35 text-white text-xs px-2 py-1 rounded border border-white/40 drop-shadow-sm">¶29</button>
                  <button className="bg-white/25 hover:bg-white/35 text-white text-xs px-2 py-1 rounded border border-white/40 drop-shadow-sm">¶30</button>
                  <button className="bg-white/25 hover:bg-white/35 text-white text-xs px-2 py-1 rounded border border-white/40 drop-shadow-sm">¶31</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#3F5B2D]"></div>
                <span className="text-white text-sm font-medium drop-shadow-md">Resolution</span>
              </div>
              <div className="text-white/90 text-xs mb-2 drop-shadow-sm">
                Yes - psychological risks and welfare concerns justified wardship
              </div>
              <div className="flex gap-2">
                <button className="bg-[#3F5B2D]/25 text-white text-xs px-2 py-1 rounded border border-[#3F5B2D]/40 drop-shadow-sm">¶38</button>
                <button className="bg-[#3F5B2D]/25 text-white text-xs px-2 py-1 rounded border border-[#3F5B2D]/40 drop-shadow-sm">¶39</button>
              </div>
            </div>
          </div>

          {/* Outcome Panel */}
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-[#5B7687] rounded"></div>
                <span className="text-white text-sm font-semibold drop-shadow-md">Outcome</span>
              </div>
              <div className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded mb-3 inline-block drop-shadow-sm">
                Court granted wardship application with structured care plan
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-white/50 rounded"></div>
                  <span className="text-white/95 drop-shadow-sm">Court took guardianship of A-L</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 bg-white/50 rounded"></div>
                  <span className="text-white/95 drop-shadow-sm">Placement with maternal grandmother</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-white/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80 drop-shadow-sm">Disposition:</span>
                  <button className="bg-white/25 text-white px-2 py-1 rounded border border-white/40 drop-shadow-sm">¶54</button>
                </div>
              </div>
            </div>
          </div>

          {/* Authorities Panel */}
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-[#5B7687] rounded"></div>
                <span className="text-white text-sm font-semibold drop-shadow-md">Authorities</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-white/95 text-xs font-medium mb-1 drop-shadow-sm">Legislation</div>
                  <div className="bg-white/15 backdrop-blur-sm rounded p-2">
                    <div className="text-white text-xs mb-1 drop-shadow-sm">Care of Children Act 2004</div>
                    <div className="text-white/80 text-xs mb-2 drop-shadow-sm">s 139, s 5</div>
                    <button className="bg-white/25 text-white text-xs px-2 py-1 rounded border border-white/40 drop-shadow-sm">¶42</button>
                  </div>
                </div>
                
                <div>
                  <div className="text-white/95 text-xs font-medium mb-1 drop-shadow-sm">Cases</div>
                  <div className="bg-white/15 backdrop-blur-sm rounded p-2">
                    <div className="text-white text-xs mb-1 drop-shadow-sm">Hawthorne v Cox [2008] NZFLR 1</div>
                    <div className="text-white/80 text-xs mb-2 drop-shadow-sm">Threshold for wardship</div>
                    <button className="bg-white/25 text-white text-xs px-2 py-1 rounded border border-white/40 drop-shadow-sm">¶30</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Progressive blur overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Interactive hint */}
        <div className="absolute bottom-4 left-4 right-4 text-center z-10">
          <div className="text-white text-sm backdrop-blur-md bg-black/40 rounded-lg px-4 py-2 inline-block border border-white/20">
            <span className="animate-pulse drop-shadow-lg font-medium">Click any ¶ citation to jump to that paragraph in the PDF</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: () => <div className="opacity-0" />,
    name: "Neural Case Search",
    description: "Discover relevant precedents across thousands of cases with AI that understands context, not just keywords.",
    href: "/research",
    cta: "Try it now",
    className: "col-span-3 lg:col-span-2",
    background: (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_90%)]">
        <div className="absolute top-8 left-4 right-4">
          <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-full px-4 py-3 mb-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-white/70" />
              <span className="text-white/90 text-sm font-normal">employment discrimination workplace harassment</span>
              <div className="w-px h-4 bg-white/40 animate-pulse ml-auto"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 shadow-md">
              <div className="text-white text-sm font-semibold drop-shadow-md">2023_NZFC2156</div>
              <div className="text-white/90 text-xs mt-1 drop-shadow-sm">Employment Court • Score: 0.89</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-3 shadow-md">
              <div className="text-white text-sm font-semibold drop-shadow-md">2022_NZFC4431</div>
              <div className="text-white/90 text-xs mt-1 drop-shadow-sm">Employment Court • Score: 0.84</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: Share2Icon,
    name: "Database Integration",
    description: "Connect seamlessly with Westlaw and LexisNexis for comprehensive legal research workflows.",
    href: "#",
    cta: "Coming soon", 
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_90%)]">
        <div className="absolute top-6 left-3 right-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5B7687] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold drop-shadow-md">W</span>
            </div>
            <div className="w-10 h-10 bg-[#3F5B2D] rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold drop-shadow-md">L</span>
            </div>
            <div className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/50">
              <span className="text-white text-sm font-bold drop-shadow-md">+</span>
            </div>
          </div>
          <div className="text-white/95 text-sm font-medium drop-shadow-md backdrop-blur-sm bg-white/10 rounded px-2 py-1">
            Sync research across platforms
          </div>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-2 shadow-md">
            <div className="text-white text-xs drop-shadow-sm">⚡ One-click export</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    Icon: () => <div className="opacity-0" />,
    name: "Custom Case Library",
    description: "Upload and analyze your own cases alongside our comprehensive database for personalized research.",
    className: "col-span-3 lg:col-span-2",
    href: "#",
    cta: "Coming soon",
    background: (
      <div className="absolute inset-0 [mask-image:linear-gradient(to_top,transparent_10%,#000_90%)]">
        <div className="absolute top-6 left-4 right-4">
          <div className="border-2 border-dashed border-white/60 rounded-lg p-4 mb-4 bg-white/15 backdrop-blur-md">
            <div className="text-center">
              <div className="w-10 h-10 bg-white/35 backdrop-blur-md rounded-lg mx-auto mb-2 flex items-center justify-center border border-white/50">
                <span className="text-white text-lg drop-shadow-md">📁</span>
              </div>
              <div className="text-white text-sm font-medium drop-shadow-md">Drop your PDF cases here</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm bg-white/20 backdrop-blur-md rounded-lg p-2 border border-white/30">
              <div className="w-2 h-2 rounded-full bg-[#3F5B2D]"></div>
              <span className="text-white drop-shadow-sm">Internal_Case_2024.pdf</span>
              <span className="text-[#3F5B2D] ml-auto text-lg drop-shadow-sm">✓</span>
            </div>
            <div className="flex items-center gap-3 text-sm bg-white/20 backdrop-blur-md rounded-lg p-2 border border-white/30">
              <div className="w-2 h-2 rounded-full bg-[#5B7687]"></div>
              <span className="text-white drop-shadow-sm">Client_Matter_X.pdf</span>
              <span className="text-[#5B7687] ml-auto text-lg drop-shadow-sm">⚡</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

// Testimonials data
const reviews = [
  {
    name: "Sarah Chen",
    username: "@sarahchen",
    body: "DONNA has revolutionized how I research case law. What used to take hours now takes minutes.",
    img: "https://avatar.vercel.sh/sarah",
  },
  {
    name: "Michael Rodriguez",
    username: "@mrodriguez",
    body: "The AI-powered search is incredibly accurate. It finds relevant cases I would have missed.",
    img: "https://avatar.vercel.sh/michael",
  },
  {
    name: "Emma Thompson",
    username: "@emmathompson",
    body: "As a solo practitioner, DONNA gives me the research capabilities of a large firm.",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "David Park",
    username: "@davidpark",
    body: "The multi-jurisdictional search feature is a game-changer for our international practice.",
    img: "https://avatar.vercel.sh/david",
  },
  {
    name: "Lisa Wang",
    username: "@lisawang",
    body: "DONNA's document analysis helps me prepare better arguments and spot issues earlier.",
    img: "https://avatar.vercel.sh/lisa",
  },
  {
    name: "James Miller",
    username: "@jamesmiller",
    body: "The time I save on research lets me focus more on client relationships and strategy.",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Anu Sekhon",
    username: "@anusekhon",
    body: "As a law student, DONNA helps me understand complex legal concepts and find relevant cases for my assignments.",
    img: "https://avatar.vercel.sh/anu",
  },
  {
    name: "Salonee Kumar",
    username: "@saloneekumar",
    body: "DONNA streamlines my research workflow as a law clerk. I can quickly find precedents and analyze case law efficiently.",
    img: "https://avatar.vercel.sh/salonee",
  },
  {
    name: "Gurjas Sekhon",
    username: "@gurjassekhon",
    body: "The comprehensive search capabilities make my job as a law clerk much more efficient and thorough.",
    img: "https://avatar.vercel.sh/gurjas",
  },
  {
    name: "Bradley Williams",
    username: "@bradleywilliams",
    body: "As a legal researcher, DONNA's AI-powered analysis saves me countless hours and improves the quality of my work.",
    img: "https://avatar.vercel.sh/bradley",
  },
  {
    name: "Abhay Singh",
    username: "@abhaysingh",
    body: "DONNA has been invaluable during my law studies. It helps me grasp complex legal principles and case connections.",
    img: "https://avatar.vercel.sh/abhay",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <NavHeader title="DONNA RESEARCH" />

      <main className="flex-1 pt-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-32">
            <h1 className="text-5xl md:text-7xl lg:text-8xl mb-8 font-serif max-w-6xl mx-auto leading-tight">
              <span className="text-white">AI that does the</span>{' '}
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#cae0b6] to-[#7BA05B] bg-clip-text text-transparent font-bold">
                Legal Search
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto">
            Stay in command and in the loop; focus on strategy and results.
            </p>
            <Link
              href="/research"
              className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:border-[#5B7687] hover:scale-105 transition-all duration-500 ease-out shadow-lg hover:shadow-xl"
            >
              Start Research →
            </Link>
          </div>

          {/* Video Demo Section */}
          <div className="mb-32 hidden sm:block">
            <div className="relative w-full 2xl:-mx-12">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl"
                style={{
                  aspectRatio: '1402/1080',
                }}
              >
                <source src="/search_result_video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#E0C092]/20 via-[#5B7687]/20 to-[#3F5B2D]/20 opacity-30 blur-xl -z-10 scale-105"></div>
            </div>
          </div>

          {/* Pre-Features Section */}
          <div className="mb-12 mt-60 max-w-7xl mx-auto hidden sm:block">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
                  <span className="bg-gradient-to-r from-white to-[#7BA05B] bg-clip-text text-transparent">
                    Intelligent Legal Research
                  </span>
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0">
                  Powered by advanced AI to deliver precise case analysis and comprehensive legal insights across multiple
                  jurisdictions
                </p>
              </div>
              <div className="flex-shrink-0 text-center lg:text-right">
                <Link
                  href="/research"
                  className="inline-block bg-white text-black px-6 py-3 rounded-full text-base font-medium hover:bg-gray-100 hover:scale-105 transition-all duration-300 ease-out shadow-lg hover:shadow-xl"
                >
                  Get started →
                </Link>
              </div>
            </div>
          </div>

          {/* Features Bento Grid */}
          <div className="mb-32">
            <BentoGrid>
              {features.map((feature, idx) => (
                <BentoCard key={idx} {...feature} />
              ))}
            </BentoGrid>
          </div>
        </div>

        {/* Globe Footer Section */}
        <div className="relative overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 px-6 lg:px-12 pt-32 pb-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-bold font-serif mb-6">
                  <span className="bg-gradient-to-r from-white via-[#ead3b3] to-[#7BA05B] bg-clip-text text-transparent">
                    Global Legal Research
                  </span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                  Starting with Australia and New Zealand, expanding to jurisdictions worldwide
                </p>

                <Link
                  href="/research"
                  className="mt-12 inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:border-[#5B7687] hover:scale-105 transition-all duration-500 ease-out shadow-lg hover:shadow-xl"
                >
                  Start Research →
                </Link>
              </div>

              {/* Globe Container */}
              <div className="relative flex items-center justify-center min-h-[600px] md:min-h-[800px]">
                <div className="relative w-full max-w-4xl aspect-square">
                  <Globe className="top-0" />

                  {/* Static Floating Region Nodes - Touching Globe */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* LEFT SIDE OF GLOBE - Arc Formation */}

                    {/* European Union - Coming Soon (top of arc) */}
                    <div className="absolute top-[8%] left-[2%] md:left-[8%] pointer-events-auto">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-full w-4 md:w-10 h-px bg-gradient-to-r from-gray-400/40 to-transparent"></div>
                        {/* Node */}
                        <div className="group bg-gray-500/20 backdrop-blur-md border border-gray-400/30 rounded-lg px-2 py-1 md:px-6 md:py-4 hover:bg-gray-500/30 transition-all duration-200 opacity-75">
                          <div className="text-gray-400 font-semibold text-xs md:text-base">European Union</div>
                          <div className="text-gray-300/60 text-xs md:text-sm hidden md:block">Coming Soon</div>
                          <div className="absolute -right-1 md:-right-3 top-1/2 -translate-y-1/2 w-1 h-1 md:w-3 md:h-3 bg-gray-400/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* United Kingdom - Coming Soon */}
                    <div className="absolute top-[18%] left-[20%] md:left-[3%] pointer-events-auto">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-full w-3 md:w-8 h-px bg-gradient-to-r from-gray-400/40 to-transparent"></div>
                        {/* Node */}
                        <div className="group bg-gray-500/20 backdrop-blur-md border border-gray-400/30 rounded-lg px-2 py-1 md:px-6 md:py-4 hover:bg-gray-500/30 transition-all duration-200 opacity-75">
                          <div className="text-gray-400 font-semibold text-xs md:text-base">United Kingdom</div>
                          <div className="text-gray-300/60 text-xs md:text-sm hidden md:block">Coming Soon</div>
                          <div className="absolute -right-1 md:-right-3 top-1/2 -translate-y-1/2 w-1 h-1 md:w-3 md:h-3 bg-gray-400/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Canada - Coming Soon */}
                    <div className="absolute top-[28%] left-[20%] md:left-[1%] pointer-events-auto">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-full w-3 md:w-6 h-px bg-gradient-to-r from-gray-400/40 to-transparent"></div>
                        {/* Node */}
                        <div className="group bg-gray-500/20 backdrop-blur-md border border-gray-400/30 rounded-lg px-2 py-1 md:px-6 md:py-4 hover:bg-gray-500/30 transition-all duration-200 opacity-75">
                          <div className="text-gray-400 font-semibold text-xs md:text-base">Canada</div>
                          <div className="text-gray-300/60 text-xs md:text-sm hidden md:block">Coming Soon</div>
                          <div className="absolute -right-1 md:-right-3 top-1/2 -translate-y-1/2 w-1 h-1 md:w-3 md:h-3 bg-gray-400/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* United States - Coming Soon (bottom of arc) */}
                    <div className="absolute top-[40%] left-[3%] md:left-[3%] pointer-events-auto">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-full w-3 md:w-8 h-px bg-gradient-to-r from-gray-400/40 to-transparent"></div>
                        {/* Node */}
                        <div className="group bg-gray-500/20 backdrop-blur-md border border-gray-400/30 rounded-lg px-2 py-1 md:px-6 md:py-4 hover:bg-gray-500/30 transition-all duration-200 opacity-75">
                          <div className="text-gray-400 font-semibold text-xs md:text-base">United States</div>
                          <div className="text-gray-300/60 text-xs md:text-sm hidden md:block">Coming Soon</div>
                          <div className="absolute -right-1 md:-right-3 top-1/2 -translate-y-1/2 w-1 h-1 md:w-3 md:h-3 bg-gray-400/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE OF GLOBE */}

                    {/* Asia Pacific - Coming Soon (top right) */}
                    <div className="absolute top-[20%] right-[2%] md:right-[2%] pointer-events-auto">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 right-full w-3 md:w-8 h-px bg-gradient-to-l from-gray-400/40 to-transparent"></div>
                        {/* Node */}
                        <div className="group bg-gray-500/20 backdrop-blur-md border border-gray-400/30 rounded-lg px-2 py-1 md:px-6 md:py-4 hover:bg-gray-500/30 transition-all duration-200 opacity-75">
                          <div className="text-gray-400 font-semibold text-xs md:text-base">Asia Pacific</div>
                          <div className="text-gray-300/60 text-xs md:text-sm hidden md:block">Coming Soon</div>
                          <div className="absolute -left-1 md:-left-3 top-1/2 -translate-y-1/2 w-1 h-1 md:w-3 md:h-3 bg-gray-400/60 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Australia & New Zealand - Available (Green) */}
                    <div className="absolute top-[55%] right-[2%] md:right-[2%] pointer-events-auto">
                      <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 right-full w-6 md:w-8 h-px bg-gradient-to-l from-[#3F5B2D]/60 to-transparent"></div>
                        {/* Node */}
                        <div className="group bg-[#3F5B2D]/50 backdrop-blur-md border border-[#3F5B2D]/50 rounded-lg px-3 py-2 md:px-6 md:py-4 hover:bg-[#3F5B2D]/40 transition-all duration-200 transform hover:scale-105">
                          <div className="text-[#E0C092] font-semibold text-sm md:text-base">
                            Australia & New Zealand
                          </div>
                          <div className="text-[#E0C092]/80 text-xs md:text-sm">Available Now</div>
                          <div className="absolute -left-2 md:-left-3 top-1/2 -translate-y-1/2 w-2 h-2 md:w-3 md:h-3 bg-[#3F5B2D] rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom blur effect */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-7xl mx-auto mb-32">
          <h2 className="text-3xl md:text-4xl font-medium font-serif text-center mb-16">
            Trusted by legal professionals
          </h2>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee className="[--duration:20s]">
              {firstRow.map(review => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:20s]">
              {secondRow.map(review => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black"></div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

