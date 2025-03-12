
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-7xl font-bold text-primary">404</h1>
          <div className="h-1 w-24 bg-primary/30 mx-auto my-6 rounded-full"></div>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button asChild>
            <a href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
