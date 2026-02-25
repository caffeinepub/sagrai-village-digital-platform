import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShieldX, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccessDeniedScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <ShieldX size={40} className="text-destructive" />
      </div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-3">Access Denied</h1>
      <p className="text-muted-foreground max-w-sm mb-2">
        You don't have admin privileges to access the Control Panel.
      </p>
      <p className="text-muted-foreground text-sm max-w-sm mb-8">
        If you believe this is a mistake, please contact the village administrator.
      </p>
      <Button asChild variant="default" size="lg" className="gap-2">
        <Link to="/">
          <Home size={18} />
          Return to Home
        </Link>
      </Button>
    </div>
  );
}
