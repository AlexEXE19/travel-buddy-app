"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  User,
  Phone,
  Globe,
  Wallet,
  Crown,
  LogOut,
} from "lucide-react";
import { useEffect } from "react";


const mockUser = {
  firstName: "John",
  lastName: "Doe",
  phone: "+1 (555) 123-4567",
  gender: "Male",
  nationality: "United States",
  budget: 5000,
  subscriptionStatus: "Premium",
};

export default function ProfilePage() {
  useEffect(() => {
  
    const fetchProfile = async () => {
      const res = await fetch("http://localhost:8080/api/v1/profile/", {
        method: "GET",
        credentials: "include",
      });

   if (res.status === 401) {
  alert("Session expired. Please log in again.");
  window.location.href = "/login";
  return;
}

      const data = await res.json();

      console.log(JSON.stringify(data));
    };

      try {
    fetchProfile();

    }
    catch(error: any){
      console.error(error)

    }

  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              TravelBuddy
            </span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                {mockUser.firstName} {mockUser.lastName}
              </CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-accent text-accent-foreground"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  {mockUser.subscriptionStatus}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">
                      {mockUser.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">
                      {mockUser.gender || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium text-foreground">
                      {mockUser.nationality || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                  <Wallet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Travel Budget
                    </p>
                    <p className="font-medium text-foreground">
                      {mockUser.budget
                        ? `$${mockUser.budget.toLocaleString()}`
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Link href="/profile/create">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
