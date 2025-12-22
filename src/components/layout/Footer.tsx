import { BookOpen, Leaf, Heart, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <BookOpen className="h-7 w-7 text-primary" />
                <Leaf className="h-3 w-3 text-success absolute -bottom-0.5 -right-0.5" />
              </div>
              <span className="font-display text-xl font-bold">
                Edu<span className="text-primary">Cycle</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Connecting students with books they need, reducing waste, and making education accessible for everyone.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Recycle className="h-4 w-4 text-success" />
                <span>Eco-friendly</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Heart className="h-4 w-4 text-secondary" />
                <span>Student-first</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search-books" className="text-muted-foreground hover:text-primary transition-colors">
                  Find Books
                </Link>
              </li>
              <li>
                <Link to="/notes" className="text-muted-foreground hover:text-primary transition-colors">
                  Notes & PDFs
                </Link>
              </li>
              <li>
                <Link to="/student-impact" className="text-muted-foreground hover:text-primary transition-colors">
                  Your Impact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-bold text-sm mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 EduCycle. Made with 💚 for students everywhere.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Leaf className="h-3 w-3 text-success" />
            <span>Every book reused saves a tree</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
