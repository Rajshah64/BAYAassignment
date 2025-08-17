import Link from "next/link";
import { Rocket, Github, ExternalLink, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-center w-full px-4 py-12">
        <div className="w-full max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="group flex items-center space-x-3 transition-all duration-200 hover:scale-105"
              >
                <div className="relative">
                  <Rocket className="h-6 w-6 text-primary transition-colors group-hover:text-primary/80" />
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Cosmic Event Tracker
                  </span>
                  <span className="text-xs text-muted-foreground -mt-0.5">
                    Discover the Universe
                  </span>
                </div>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Track Near-Earth Objects and cosmic events using NASA APIs
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">
                Resources
              </h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="https://api.nasa.gov/"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NASA API
                    <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://cneos.jpl.nasa.gov/"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CNEOS Database
                    <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Project</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="https://github.com/Rajshah64/BAYAassignment"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    Source Code
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              &copy; 2024 Cosmic Event Tracker. Built with
              <span className="font-medium text-foreground">Next.js</span>
              and
              <span className="font-medium text-foreground">NASA APIs</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
