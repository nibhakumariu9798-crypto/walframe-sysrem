"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Heart,
  Stethoscope,
  Building,
  Scale,
  Shield,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";
import { UserRole, Institution, InstitutionType } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { getVerifiedInstitutions, registerInstitutionInSupabase } from "@/lib/institutions";
import { getRoleRedirectUrl } from "@/lib/auth/role-redirect";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useRole();

  // Core User Fields requested: Name, Email, Mobile Number, Password, Role
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Institution Affiliation Data (if institution role)
  const [institutionsList, setInstitutionsList] = useState<Institution[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>("");
  const [isNewInstitution, setIsNewInstitution] = useState(false);
  const [newInstName, setNewInstName] = useState("");
  const [newInstType, setNewInstType] = useState<InstitutionType>("orphanage");
  const [newInstCity, setNewInstCity] = useState("Ranchi");
  const [newInstCapacity, setNewInstCapacity] = useState(50);

  // UI States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load institutions for selection
  useEffect(() => {
    getVerifiedInstitutions().then((data) => {
      setInstitutionsList(data);
      if (data.length > 0 && !selectedInstitutionId) {
        setSelectedInstitutionId(data[0].id);
      }
    });
  }, []);

  // Validation
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // Role Definitions for "Aap Kaun Ho?"
  const roleOptions = [
    {
      id: "donor" as UserRole,
      title: "Donor / Philanthropist",
      subtitle: "Donate funds & groceries; track live impact",
      icon: Heart,
      color: "border-rose-200 bg-rose-50/50 text-rose-800",
      activeColor: "border-rose-500 bg-rose-50 ring-2 ring-rose-200",
    },
    {
      id: "institution" as UserRole,
      title: "Care Home Superintendent",
      subtitle: "Manage Orphanage or Old Age Home & admissions",
      icon: Building2,
      color: "border-sky-200 bg-sky-50/50 text-sky-800",
      activeColor: "border-sky-500 bg-sky-50 ring-2 ring-sky-200",
    },
    {
      id: "doctor" as UserRole,
      title: "Medical Doctor",
      subtitle: "Examine resident health & clinical triage",
      icon: Stethoscope,
      color: "border-teal-200 bg-teal-50/50 text-teal-800",
      activeColor: "border-teal-500 bg-teal-50 ring-2 ring-teal-200",
    },
    {
      id: "ngo" as UserRole,
      title: "NGO Representative",
      subtitle: "Coordinate welfare supplies & outreach",
      icon: Building,
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-800",
      activeColor: "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200",
    },
    {
      id: "government" as UserRole,
      title: "State Welfare Auditor",
      subtitle: "Inspect care homes & audit allocations",
      icon: Scale,
      color: "border-purple-200 bg-purple-50/50 text-purple-800",
      activeColor: "border-purple-500 bg-purple-50 ring-2 ring-purple-200",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFullName || trimmedFullName.length < 2) {
      setError("Please enter your complete official name (at least 2 characters).");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please provide a valid official email address.");
      return;
    }

    if (!trimmedPhone || trimmedPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile / contact phone number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      let finalInstitutionId: string | null = null;

      // 1. If registering a care home superintendent
      if (role === "institution") {
        if (isNewInstitution) {
          if (!newInstName.trim()) {
            throw new Error("Please enter your welfare institution / care home name.");
          }
          const newInst = await registerInstitutionInSupabase({
            name: newInstName.trim(),
            institution_type: newInstType,
            registration_number: `REG-${newInstType === "orphanage" ? "ORPH" : "OAH"}-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            capacity: Number(newInstCapacity) || 50,
            contact_email: trimmedEmail,
            contact_phone: trimmedPhone,
            address: `${newInstCity}, Jharkhand`,
            city: newInstCity.trim(),
            state: "Jharkhand",
            pincode: "834001",
          });
          if (newInst?.id) {
            finalInstitutionId = newInst.id;
          }
        } else if (selectedInstitutionId) {
          finalInstitutionId = selectedInstitutionId;
        }
      }

      // 2. Persist to Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            full_name: trimmedFullName,
            role: role,
            phone: trimmedPhone,
            institution_id: finalInstitutionId,
          },
        },
      });

      if (authError) {
        if (
          authError.message.toLowerCase().includes("already registered") ||
          authError.status === 422
        ) {
          setError(`An account with "${trimmedEmail}" is already registered in Supabase.`);
          setLoading(false);
          return;
        }
        throw authError;
      }

      // Supabase email enumeration duplicate check
      if (authData?.user && authData.user.identities && authData.user.identities.length === 0) {
        setError(`An account with "${trimmedEmail}" already exists in Supabase. Please sign in directly.`);
        setLoading(false);
        return;
      }

      // 3. Immediately activate authenticated session
      try {
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });
      } catch {
        // Non-blocking
      }

      // 4. Update role context
      registerUser({
        fullName: trimmedFullName,
        email: trimmedEmail,
        role: role,
        phone: trimmedPhone,
        institutionId: finalInstitutionId || undefined,
        id: authData?.user?.id,
      });

      // 5. DIRECT ROLE-BASED REDIRECTION as requested:
      // - Donor -> /dashboard
      // - Institution -> /institutions
      // - Doctor -> /health
      // - Government -> /dashboard
      // - NGO -> /resources
      const targetDestination = getRoleRedirectUrl(role);
      window.location.href = targetDestination;
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Failed to register account with Supabase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Centered Registration Card matching reference design */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200/90 p-8 sm:p-10 transition-all">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-600 mx-auto flex items-center justify-center text-white shadow-md shadow-blue-600/20 mb-3.5">
            <Shield className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-lg font-black text-slate-900 tracking-wider uppercase">
            CREATE OFFICIAL ACCOUNT
          </h1>
          <p className="text-[10px] font-extrabold text-blue-700 tracking-widest uppercase mt-1">
            WELFARE RESOURCE &amp; CLINICAL CARE PORTAL
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in-50">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-medium leading-relaxed">{error}</span>
              {error.toLowerCase().includes("already") && (
                <div className="mt-2">
                  <Link
                    href={`/login?email=${encodeURIComponent(email.trim())}`}
                    className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline text-xs"
                  >
                    Sign In with this Account &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* 1. Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              OFFICIAL FULL NAME *
            </label>
            <div className="relative rounded-xl border border-slate-300 bg-white hover:border-slate-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Dr. Nibha Kumari / Sister Mary"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl bg-transparent outline-none"
              />
            </div>
          </div>

          {/* 2. Email & Mobile Number Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                EMAIL ADDRESS *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-white hover:border-slate-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@welfare.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl bg-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                MOBILE NUMBER *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-white hover:border-slate-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 97983 64344"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. Password & Confirm Password Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                PASSWORD *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-white hover:border-slate-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                CONFIRM PASSWORD *
              </label>
              <div className="relative rounded-xl border border-slate-300 bg-white hover:border-slate-400 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 4. "Aap Kaun Ho?" (Select System Role) */}
          <div className="pt-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
              AAP KAUN HO? (SELECT YOUR SYSTEM ROLE) *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {roleOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = role === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRole(opt.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? opt.activeColor
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/70"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isSelected ? "bg-white shadow-xs" : "bg-slate-200/70 text-slate-600"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                        <span>{opt.title}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        {opt.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Conditional: Institution Details if Care Home Superintendent */}
          {role === "institution" && (
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 space-y-3 animate-in fade-in-50">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-sky-950">
                  Host Welfare Institution / Care Home
                </span>
                <button
                  type="button"
                  onClick={() => setIsNewInstitution(!isNewInstitution)}
                  className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  {isNewInstitution ? "Select Existing Home" : "+ Register New Care Home"}
                </button>
              </div>

              {isNewInstitution ? (
                <div className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="New Care Home / Orphanage Name"
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg text-xs outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newInstType}
                      onChange={(e) => setNewInstType(e.target.value as InstitutionType)}
                      className="px-3 py-2 bg-white border border-sky-300 rounded-lg text-xs outline-none font-medium"
                    >
                      <option value="orphanage">Orphanage (Children)</option>
                      <option value="old_age_home">Old Age Home (Elderly)</option>
                      <option value="mixed">Mixed Care Home</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Bed Capacity (e.g. 50)"
                      value={newInstCapacity}
                      onChange={(e) => setNewInstCapacity(Number(e.target.value))}
                      className="px-3 py-2 bg-white border border-sky-300 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>
              ) : (
                <select
                  value={selectedInstitutionId}
                  onChange={(e) => setSelectedInstitutionId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                >
                  {institutionsList.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} ({inst.city} - {inst.capacity} beds)
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Submit Action Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-bold py-3.5 rounded-xl text-xs tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating Account &amp; Setting Up Profile...</span>
              </>
            ) : (
              <>
                <span>Create Official Account &amp; Enter Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Footer Link to Login */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100 text-xs text-slate-500 font-medium">
          Already registered on the platform?{" "}
          <Link
            href="/login"
            className="text-blue-700 font-bold hover:text-blue-800 hover:underline block mt-1 transition-colors"
          >
            &larr; Sign In with your existing credentials
          </Link>
        </div>
      </div>

    </div>
  );
}
