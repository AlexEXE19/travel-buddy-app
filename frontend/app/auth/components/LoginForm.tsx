"use client";

import { login } from "../actions/login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  return (
    <form action={login}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </CardFooter>
    </form>
  );
}
