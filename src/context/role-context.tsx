"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole, Profile } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface RoleContextType {
  currentRole: UserRole;
  currentProfile: Profile;
  switchRole: (role: UserRole) => void;
  registerUser: (data: {
    fullName: string;
    email: string;
    role: UserRole;
    phone?: string;
    institutionId?: string;
    id?: string;
  }) => Profile;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  signOut: () => Promise<void>;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const INITIAL_EMPTY_PROFILE: Profile = {
  id: "",
  email: "",
  full_name: "",
  role: "donor",
  phone: null,
  institution_id: null,
  verification_status: "verified",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
};

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>("donor");
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [hasRealSession, setHasRealSession] = useState(false);

  const [currentProfile, setCurrentProfile] = useState<Profile>(INITIAL_EMPTY_PROFILE);

  useEffect(() => {
    try {
      const supabase = createClient();

      // 1. Initial session check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const role = (meta.role as UserRole) || "donor";
          const userEmail = session.user.email || "";
          const fullName = meta.full_name || userEmail.split("@")[0] || "User";

          setHasRealSession(true);
          setIsAuthenticated(true);
          setIsDemoMode(false);
          setCurrentRole(role);
          setCurrentProfile({
            id: session.user.id,
            email: userEmail,
            full_name: fullName,
            role: role,
            phone: meta.phone || null,
            institution_id: meta.institution_id || null,
            verification_status: "verified",
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          setHasRealSession(false);
          setIsAuthenticated(false);
          setCurrentProfile({
            id: "guest",
            email: "",
            full_name: "Guest Visitor",
            role: "donor",
            phone: null,
            institution_id: null,
            verification_status: "pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        setIsLoadingAuth(false);
      });

      // 2. Listen for real-time auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const role = (meta.role as UserRole) || "donor";
          const userEmail = session.user.email || "";
          const fullName = meta.full_name || userEmail.split("@")[0] || "User";

          setHasRealSession(true);
          setIsAuthenticated(true);
          setIsDemoMode(false);
          setCurrentRole(role);
          setCurrentProfile({
            id: session.user.id,
            email: userEmail,
            full_name: fullName,
            role: role,
            phone: meta.phone || null,
            institution_id: meta.institution_id || null,
            verification_status: "verified",
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          setHasRealSession(false);
          setIsAuthenticated(false);
          setCurrentProfile({
            id: "guest",
            email: "",
            full_name: "Guest Visitor",
            role: "donor",
            phone: null,
            institution_id: null,
            verification_status: "pending",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
        setIsLoadingAuth(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.warn("Supabase auth session sync error:", err);
      setIsLoadingAuth(false);
    }
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);

    // If an authenticated real user is active, PRESERVE their real email & identity
    if (hasRealSession && currentProfile.email) {
      setCurrentProfile((prev) => ({
        ...prev,
        role: role,
      }));
      setIsDemoMode(false);
      return;
    }

    // For unauthenticated perspective preview: use generic role title without fake person names
    setIsDemoMode(false);
    setCurrentProfile({
      id: `preview-${role}`,
      email: "",
      full_name: `${role.charAt(0).toUpperCase() + role.slice(1)} Perspective`,
      role: role,
      phone: null,
      institution_id: null,
      verification_status: "verified",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    });
  };

  const registerUser = (data: {
    fullName: string;
    email: string;
    role: UserRole;
    phone?: string;
    institutionId?: string;
    id?: string;
  }): Profile => {
    const newProfile: Profile = {
      id: data.id || `user-${Date.now()}`,
      email: data.email,
      full_name: data.fullName,
      role: data.role,
      phone: data.phone || null,
      institution_id: data.institutionId || null,
      verification_status: ["government", "doctor", "institution"].includes(data.role)
        ? "pending"
        : "verified",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setHasRealSession(true);
    setIsAuthenticated(true);
    setIsDemoMode(false);
    setCurrentProfile(newProfile);
    setCurrentRole(data.role);
    return newProfile;
  };

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out error:", err);
    } finally {
      setHasRealSession(false);
      setIsAuthenticated(false);
      setIsDemoMode(false);
      setCurrentProfile({
        id: "guest",
        email: "",
        full_name: "Guest Visitor",
        role: "donor",
        phone: null,
        institution_id: null,
        verification_status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      window.location.href = "/login";
    }
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentProfile,
        switchRole,
        registerUser,
        isDemoMode,
        isAuthenticated,
        isLoadingAuth,
        signOut,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

