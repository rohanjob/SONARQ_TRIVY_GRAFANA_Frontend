import "./globals.css";

export const metadata = {
  title: "SSP Books | Premium Online Courses & Learning Platform",
  description: "Discover top-rated courses in Web Development, Data Science, Cloud, DevOps, and more. Learn from industry experts at SSP Books.",
  keywords: "online courses, web development, data science, cloud computing, programming, SSP Books",
  openGraph: {
    title: "SSP Books | Premium Online Courses",
    description: "Master in-demand skills with expert-led courses. Join 200K+ learners.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
