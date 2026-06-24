import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Network,
  Code2,
  LineChart,
  Lightbulb,
  Compass,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import HexBackground from "@/components/HexBackground";
import Footer from "@/components/Footer";
import { handleSpotlight } from "@/lib/interactions";

interface Course {
  name: string;
  ects: number;
}

interface CourseGroup {
  title: string;
  icon: LucideIcon;
  gradient: string;
  courses: Course[];
}

const PROGRAM = {
  degree: "BSc in Business Administration and Information Systems",
  school: "Copenhagen Business School",
  graduated: "June 2026",
  totalEcts: 180,
};

const groups: CourseGroup[] = [
  {
    title: "Information Systems & IT",
    icon: Network,
    gradient: "from-white to-neutral-300",
    courses: [
      { name: "Introduction to Information Systems", ects: 7.5 },
      { name: "IT Project Management", ects: 7.5 },
      { name: "Computer Networks and Distributed Systems", ects: 7.5 },
      { name: "IT Change Management", ects: 7.5 },
      { name: "Analysis and Design of User-Friendly Information Systems", ects: 15 },
      { name: "IT Strategy", ects: 7.5 },
      { name: "IT Contracts", ects: 7.5 },
    ],
  },
  {
    title: "Programming & Data",
    icon: Code2,
    gradient: "from-neutral-200 to-neutral-400",
    courses: [
      { name: "Programming and Development of Smaller Systems and Databases", ects: 15 },
    ],
  },
  {
    title: "Business Economics & Finance",
    icon: LineChart,
    gradient: "from-white to-neutral-400",
    courses: [
      { name: "Business Economics (1): Managerial Economics", ects: 7.5 },
      { name: "Business Economics (2): Accounting", ects: 7.5 },
      { name: "Business Economics (3): Finance", ects: 7.5 },
      { name: "Business Economics (4): Organizational Economics", ects: 7.5 },
      { name: "Business Economics (5): Management Accounting for Decision Making and Control", ects: 7.5 },
      { name: "Macroeconomics", ects: 7.5 },
    ],
  },
  {
    title: "Organization, Strategy & Innovation",
    icon: Lightbulb,
    gradient: "from-neutral-100 to-neutral-300",
    courses: [
      { name: "Introduction to Organizational Theory", ects: 15 },
      { name: "Innovation and New Technology", ects: 7.5 },
    ],
  },
  {
    title: "Electives",
    icon: Compass,
    gradient: "from-neutral-200 to-neutral-500",
    courses: [
      { name: "Introduction to Marketing", ects: 7.5 },
      { name: "Forecasting in Business and Economics", ects: 7.5 },
    ],
  },
  {
    title: "Methods & Thesis",
    icon: ScrollText,
    gradient: "from-white to-neutral-300",
    courses: [
      { name: "Theory of Scientific Method", ects: 7.5 },
      { name: "Academic Integrity Course", ects: 0 },
      { name: "Bachelor Project (Thesis)", ects: 15 },
    ],
  },
];

const totalCourses = groups.reduce((sum, group) => sum + group.courses.length, 0);

const stats: { label: string; value: string | number }[] = [
  { label: "Degree", value: "BSc" },
  { label: "ECTS", value: PROGRAM.totalEcts },
  { label: "Courses", value: totalCourses },
  { label: "Graduated", value: PROGRAM.graduated },
];

const Kurser = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    const previousTitle = document.title;
    document.title = "Courses · Anders Adalberth Andersen";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <HexBackground />
      <div className="grain" aria-hidden="true" />

      <div className="relative z-10">
        {/* Top bar */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-background/70 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-semibold tracking-tight transition-opacity hover:opacity-80">
              Anders<span className="text-muted-foreground">.</span>
            </Link>
            <Link
              to="/"
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Back to home
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="container px-5 pb-10 pt-14 sm:px-8 sm:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow mb-3">Education</span>
            <h1 className="section-heading text-4xl font-bold sm:text-5xl">University courses</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Every course from my {PROGRAM.degree} at {PROGRAM.school} — listed without
              grades, just the ground I covered.
            </p>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl px-4 py-5 text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Course groups */}
        <section className="container px-5 pb-20 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {groups.map((group) => {
              const Icon = group.icon;
              const groupEcts = group.courses.reduce((sum, course) => sum + course.ects, 0);
              return (
                <div
                  key={group.title}
                  onMouseMove={handleSpotlight}
                  className="glass-card spotlight flex flex-col rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`hex-clip flex h-11 w-11 shrink-0 items-center justify-center bg-gradient-to-br ${group.gradient} text-neutral-900 shadow-lg`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold leading-tight">{group.title}</h2>
                      <p className="text-xs text-muted-foreground">
                        {group.courses.length} {group.courses.length === 1 ? "course" : "courses"} ·{" "}
                        {groupEcts} ECTS
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2.5">
                    {group.courses.map((course) => (
                      <li
                        key={course.name}
                        className="flex items-center justify-between gap-3 border-t border-white/5 pt-2.5 first:border-t-0 first:pt-0"
                      >
                        <span className="text-sm leading-snug text-foreground/85">{course.name}</span>
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                          {course.ects > 0 ? `${course.ects} ECTS` : "Pass"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Master note */}
          <div className="mx-auto mt-8 max-w-5xl">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Currently continuing with the{" "}
                <span className="font-medium text-foreground">
                  MSc in Business Administration and Information Systems (IT Management &amp;
                  Business Economics)
                </span>{" "}
                at Copenhagen Business School.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Kurser;
