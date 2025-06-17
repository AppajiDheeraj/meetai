"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

      const { 
        data: session,
    } = authClient.useSession() 

    if (session) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <p>Logged in as {session.user.name}</p>
          <Button onClick={() => authClient.signOut() }
            className="mt-4"
            variant="outline"
            size="lg"
          >
            Sign Out
          </Button>
        </div>
      )
    }
  const onSubmit = async () => {
    await authClient.signUp.email({
      name,
      email,
      password,
    }, {
      onSuccess: () => {
        window.alert("User created successfully");
      },
      onError: () => {
        window.alert("Error creating user");
      },
    }
    )
  }
  const onLogin = async () => {
    await authClient.signIn.email({
      email,
      password,
    }, {
      onSuccess: () => {
        window.alert("User signedin successfully");
      },
      onError: () => {
        window.alert("Error signing user");
      },
    }
    )
  }


  return (
    <div>
      <Input placeholder="name" value={name} onChange={(event) => {
        setName(event.target.value);
      }} />
      <Input placeholder="email" value={email} onChange={(event) => {
        setEmail(event.target.value);
      }} />
      <Input placeholder="password" type="password" value={password} onChange={(event) => {
        setPassword(event.target.value);
      }} />
      <Button
        onClick={onSubmit}
        className="mt-4"
        disabled={!name || !email || !password}
        variant="outline"
        size="lg"
      >
        Sign Up
      </Button>


      <Input placeholder="email" value={email} onChange={(event) => {
        setEmail(event.target.value);
      }} />
      <Input placeholder="password" type="password" value={password} onChange={(event) => {
        setPassword(event.target.value);
      }} />
      <Button
        onClick={onLogin}
        className="mt-4"
        disabled={!email || !password}
        variant="outline"
        size="lg"
      >
        Sign IN
      </Button>
    </div>
  );
}
