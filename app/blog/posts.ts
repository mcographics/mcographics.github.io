export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  displayDate: string;
  category: string;
  readingTime: string;
  featured: boolean;
  paragraphs: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "welcome-to-majestic-creations",
    title: "Welcome to the Majestic Creations Journal",
    description: "A new place for project stories, development notes, creative experiments, and the ideas behind the work.",
    date: "2026-08-25",
    displayDate: "August 25, 2026",
    category: "Studio Journal",
    readingTime: "3 min read",
    featured: true,
    paragraphs: [
      "Majestic Creations has always been about turning ideas into something real. This journal is a place to document that process—the experiments that work, the lessons found in the ones that do not, and the decisions that shape each project along the way.",
      "Here I will share development updates, behind-the-scenes notes, explorations in artificial intelligence, application design, multimedia production, and reflections on building independent creative technology.",
      "The portfolio shows the finished work. The journal will tell the story behind it: where an idea began, what it took to build, what changed during development, and what may come next.",
      "This is only the beginning. New articles will appear as the projects evolve, and each entry will offer a closer look at the purpose, process, and technology behind Majestic Creations.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
