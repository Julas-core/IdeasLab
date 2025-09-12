import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

// Simulate the AI finding a trending topic
const trendingTopics = [
  "Sustainable Packaging",
  "AI for Personal Finance",
  "Remote Team Collaboration",
  "Mental Wellness Apps",
  "Hyperlocal Delivery",
  "Personalized Nutrition",
  "Gamified Education",
  "Circular Economy Fashion",
];

// Mock data generation functions
const generateMockIdea = (keyword: string) => ({
    idea_title: `AI-Powered ${keyword} Platform`,
    problem: `People interested in ${keyword} lack a centralized, easy-to-use solution.`,
    solution: `A comprehensive platform that uses AI to provide personalized ${keyword} recommendations and resources.`,
    market: `Enthusiasts and professionals in the ${keyword} space.`,
});

const generateMockAnalysis = (idea: any) => ({
  problem: `A deeper look into the problem of '${idea.problem}'. It seems to affect ${idea.market} significantly.`,
  opportunity: `There is a huge opportunity to solve this with '${idea.solution}'. The market is ripe for disruption.`,
  targetAudience: `The primary target audience is ${idea.market}, specifically those who struggle with this daily.`,
  competitors: "Current competitors are slow and expensive. Key players include LegacyCorp and OldTech Inc.",
  revenuePotential: "High potential for a subscription-based model, with projected ARR of $5M in 3 years.",
  risks: "Market adoption could be slow. Technological hurdles may arise.",
  whyNow: "Recent advancements in technology and a shift in consumer behavior make this the perfect time.",
});

const generateMockTrends = (idea: any) => ({
    googleTrends: [
        { name: idea.idea_title.split(" ")[0], interest: Math.floor(Math.random() * 100) },
        { name: "competitor A", interest: Math.floor(Math.random() * 100) },
        { name: "competitor B", interest: Math.floor(Math.random() * 100) },
    ],
    redditMentions: [
        { name: idea.idea_title.split(" ")[0], mentions: Math.floor(Math.random() * 500) },
        { name: "related topic", mentions: Math.floor(Math.random() * 500) },
    ]
});

const generateMockGoToMarket = (idea: any) => ({
    landingPageCopy: {
        headline: `The Ultimate Solution for ${idea.problem}`,
        subheadline: `With ${idea.idea_title}, you can finally achieve your goals without the hassle.`,
        cta: "Get Started for Free",
    },
    brandNameSuggestions: ["Solutionify", `${idea.idea_title.split(" ")[0]}Hub`, "NextGen Solutions"],
    adCreativeIdeas: [
        `A video showing someone struggling with '${idea.problem}' and then finding relief with '${idea.solution}'.`,
        `A carousel ad on Instagram showcasing key features.`,
    ]
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // The AI now picks its own topic
    const keyword = trendingTopics[Math.floor(Math.random() * trendingTopics.length)];

    const idea = generateMockIdea(keyword);
    const analysis = generateMockAnalysis(idea);
    const trends = generateMockTrends(idea);
    const goToMarket = generateMockGoToMarket(idea);

    const responseData = {
        idea,
        analysis,
        trends,
        goToMarket,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})