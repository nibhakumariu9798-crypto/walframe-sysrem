"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Building2,
  MapPin,
  Sparkles,
  Stethoscope,
  Heart,
  HandHeart,
  Scale,
  Shield,
  HelpCircle,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRole } from "@/context/role-context";
import { UserRole, Institution, InstitutionType } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { getVerifiedInstitutions, registerInstitutionInSupabase } from "@/lib/institutions";

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useRole();

  // Core User Data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("donor");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Institution Affiliation Data
  const [institutionsList, setInstitutionsList] = useState<Institution[]>([]);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>("");
  const [isRegisteringNewInst, setIsRegisteringNewInst] = useState(false);

  // New Institution Details
  const [newInstName, setNewInstName] = useState("");
  const [newInstType, setNewInstType] = useState<InstitutionType>("orphanage");
  const [newInstRegNo, setNewInstRegNo] = useState("");
  const [newInstCity, setNewInstCity] = useState("Ranchi");
  const [newInstState, setNewInstState] = useState("Jharkhand");
  const [newInstAddress, setNewInstAddress] = useState("");
  const [newInstPincode, setNewInstPincode] = useState("834001");
  const [newInstCapacity, setNewInstCapacity] = useState(50);

  // Interactive UI States
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredData, setRegisteredData] = useState<{
    id?: string;
    email: string;
    role: string;
    institutionName?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load verified institutions on mount
  useEffect(() => {
    getVerifiedInstitutions().then((data) => {
      setInstitutionsList(data);
      if (data.length > 0 && !selectedInstitutionId) {
        setSelectedInstitutionId(data[0].id);
      }
    });
  }, []);

  // Real-time email validation
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const emailTouched = email.length > 0;
  const isEmailValid = isValidEmail(email);

  // Real-time password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-slate-200" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Good", color: "bg-sky-500" };
      case 4:
        return { score: 100, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 10, label: "Very Weak", color: "bg-rose-500" };
    }
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const needsInstitution = ["institution", "doctor", "volunteer", "ngo"].includes(role);
  const isPrivilegedRole = ["government", "doctor", "institution"].includes(role);

  const roleDefinitions = [
    {
      id: "donor" as UserRole,
      title: "Donor / Philanthropist",
      desc: "Sponsor groceries, clothes, and medicines with live delivery tracking.",
      icon: Heart,
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      id: "institution" as UserRole,
      title: "Care Home Superintendent",
      desc: "Manage orphanage or old age home bed capacity, stock & resident admissions.",
      icon: Building2,
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    },
    {
      id: "doctor" as UserRole,
      title: "Medical Practitioner",
      desc: "Log confidential resident vitals and evaluate non-diagnostic risk scores.",
      icon: Stethoscope,
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      id: "volunteer" as UserRole,
      title: "Field Volunteer",
      desc: "Assist care homes with grocery distributions and educational events.",
      icon: HandHeart,
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      id: "ngo" as UserRole,
      title: "NGO Representative",
      desc: "Coordinate welfare outreach, bulk supplies, and sponsor campaigns.",
      icon: Building,
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      id: "government" as UserRole,
      title: "State Welfare Auditor",
      desc: "Inspect certified institutions, audit allocations & verify licenses.",
      icon: Scale,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
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

    if (!isEmailValid) {
      setError("Please provide a valid official email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (!agreeTerms) {
      setError("Please acknowledge the social welfare data integrity agreement.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      let finalInstitutionId: string | null = null;
      let finalInstitutionName = "";

      // 1. If user is creating a new institution on the fly
      if (role === "institution" && isRegisteringNewInst) {
        setLoadingStep("Registering new welfare institution in Supabase...");
        if (!newInstName.trim()) {
          throw new Error("Please provide the official name of the welfare institution.");
        }
        if (!newInstRegNo.trim()) {
          throw new Error("Please provide the government registration / license number.");
        }

        const newInst = await registerInstitutionInSupabase({
          name: newInstName.trim(),
          institution_type: newInstType,
          registration_number: newInstRegNo.trim(),
          capacity: Number(newInstCapacity) || 50,
          contact_email: trimmedEmail,
          contact_phone: trimmedPhone || "+91 94311 00000",
          address: newInstAddress.trim() || `${newInstCity}, ${newInstState}`,
          city: newInstCity.trim(),
          state: newInstState.trim(),
          pincode: newInstPincode.trim(),
        });

        if (newInst?.id) {
          finalInstitutionId = newInst.id;
          finalInstitutionName = newInst.name;
        }
      } else if (needsInstitution && selectedInstitutionId) {
        const isUUID =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
            selectedInstitutionId
          );
        if (isUUID) {
          finalInstitutionId = selectedInstitutionId;
          finalInstitutionName =
            institutionsList.find((i) => i.id === selectedInstitutionId)?.name || "";
        }
      }

      // 2. Persist user account directly to Supabase Auth
      setLoadingStep("Saving user credentials to Supabase Auth...");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: password,
        options: {
          data: {
            full_name: trimmedFullName,
            role: role,
            phone: trimmedPhone || null,
            institution_id: finalInstitutionId,
          },
        },
      });

      if (authError) {
        if (
          authError.message.toLowerCase().includes("already registered") ||
          authError.status === 422
        ) {
          setError(`An account with ${trimmedEmail} is already registered in Supabase.`);
          setLoading(false);
          return;
        }
        throw authError;
      }

      const registeredUserId = authData?.user?.id;

      // 3. Ensure session is signed in
      setLoadingStep("Activating authorized session in Supabase...");
      try {
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });
      } catch {
        // Non-fatal if email confirmation is required
      }

      // 4. Synchronize with application role context
      registerUser({
        fullName: trimmedFullName,
        email: trimmedEmail,
        role: role,
        phone: trimmedPhone || undefined,
        institutionId: finalInstitutionId || undefined,
        id: registeredUserId,
      });

      setRegisteredData({
        id: registeredUserId,
        email: trimmedEmail,
        role: role,
        institutionName: finalInstitutionName || undefined,
      });

      setSuccess(true);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Failed to register account with Supabase.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Government Context, Trust & Role Guidance */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Government Branding Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>National Welfare Network</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Official Portal Registration
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              Join the centralized digital management infrastructure for certified orphanages, senior citizen care facilities, visiting doctors, and social philanthropists across India.
            </p>
          </div>

          {/* Key Platform Capabilities / Trust Points */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certified Governance Standards</span>
            </h2>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Role-Based Isolation:</strong> Sensitive clinical vitals are encrypted and accessible exclusively to doctors and authorized superintendents under PostgreSQL RLS.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Zero-Leakage Logistics:</strong> Every kilogram of grain, carton of medicine, and donation rupee is traceable in real time from pledge to resident disbursement.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Predictive Stock Replenishment:</strong> AI demand forecasting monitors seasonal census patterns to prevent medicine and food stockouts.
                </span>
              </div>
            </div>
          </div>

          {/* Security & Official Helpline Card */}
          <div className="bg-gradient-to-br from-sky-50/70 to-blue-50/50 rounded-2xl p-5 border border-sky-100 space-y-3">
            <div className="flex items-center gap-2 text-sky-900 font-bold text-xs">
              <Shield className="w-4 h-4 text-sky-600" />
              <span>Official Verification Notice</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Accounts registered under <strong>Superintendent</strong>, <strong>Medical Doctor</strong>, or <strong>Government Auditor</strong> roles undergo administrative verification by the State Social Welfare Directorate.
            </p>
            <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Helpline: +91 94311 00000</span>
              <span className="text-sky-700 font-semibold">welfare.coordinator@gov.in</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: The High-Quality Registration Form */}
        <div className="lg:col-span-7">
          <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/5 p-6 sm:p-8">
            <CardContent className="p-0">
              
              {success ? (
                /* Success View */
                <div className="p-4 text-center space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-900 text-xl">
                      Account Registered Successfully!
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                      Your official credentials and role profile have been permanently provisioned and secured in the Supabase PostgreSQL database.
                    </p>
                  </div>

                  {registeredData && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2.5 text-xs max-w-md mx-auto">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">User Profile ID:</span>
                        <span className="font-mono text-[11px] font-semibold text-slate-800">
                          {registeredData.id ? registeredData.id.slice(0, 18) + "..." : "Generated"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Official Email:</span>
                        <span className="font-semibold text-slate-900">{registeredData.email}</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="text-slate-500 font-medium">Assigned Role:</span>
                        <Badge variant="outline" className="uppercase text-[10px] font-extrabold tracking-wider bg-white border-slate-300 text-slate-800">
                          {registeredData.role}
                        </Badge>
                      </div>
                      {registeredData.institutionName && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Affiliated Home:</span>
                          <span className="font-semibold text-sky-800 truncate max-w-[200px]">
                            {registeredData.institutionName}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                    {isPrivilegedRole
                      ? "Administrative audit rights and medical logs are protected under Row Level Security and subject to verification."
                      : "Your authenticated session is active. You can now access your role dashboard."}
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                    <Button
                      onClick={() => router.push("/dashboard")}
                      className="w-full flex-1 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2.5 text-xs shadow-sm cursor-pointer"
                    >
                      Enter Portal Dashboard
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                    <Link
                      href={`/login?email=${encodeURIComponent(registeredData?.email || "")}&registered=true`}
                      className="w-full flex-1"
                    >
                      <Button variant="outline" className="w-full py-2.5 text-xs font-semibold cursor-pointer">
                        Go to Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Form Header */}
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      Account Provisioning Form
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter your verified details below to initialize your credentials.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col gap-2 animate-in fade-in-50">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                        <span className="font-medium leading-relaxed">{error}</span>
                      </div>
                      {error.toLowerCase().includes("already registered") && (
                        <div className="pt-1">
                          <Link href={`/login?email=${encodeURIComponent(email.trim())}`}>
                            <Button
                              type="button"
                              size="sm"
                              className="bg-sky-700 hover:bg-sky-800 text-white text-xs py-1 px-3 shadow-xs cursor-pointer"
                            >
                              Sign In with this Email &rarr;
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 1: Interactive Role Selector Grid */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 block flex items-center justify-between">
                      <span>1. Select Your Operational Role <span className="text-rose-500">*</span></span>
                      <span className="text-[11px] font-normal text-slate-500">Determines your portal permissions</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {roleDefinitions.map((item) => {
                        const Icon = item.icon;
                        const isSelected = role === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              setRole(item.id);
                              if (item.id !== "institution") {
                                setIsRegisteringNewInst(false);
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                              isSelected
                                ? "bg-sky-50/70 border-sky-600 ring-2 ring-sky-500/20 shadow-xs"
                                : "bg-slate-50/70 hover:bg-slate-100/70 border-slate-200 text-slate-700"
                            }`}
                          >
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-sky-700 text-white shadow-xs"
                                  : "bg-white text-slate-600 border border-slate-200"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0 pr-4">
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <span className="truncate">{item.title}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                                {item.desc}
                              </p>
                            </div>

                            {isSelected && (
                              <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-sky-700 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* STEP 2: Personal & Contact Information */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-900 block">
                      2. Personal &amp; Contact Details
                    </label>

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        Official Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (error) setError(null);
                          }}
                          placeholder="e.g. Dr. Nibha Kumari / Sister Mary"
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white font-medium transition-all"
                        />
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-slate-700 block">
                            Official Email <span className="text-rose-500">*</span>
                          </label>
                          {emailTouched && isEmailValid && (
                            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Valid
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              if (error) setError(null);
                            }}
                            placeholder="name@welfare.gov.in"
                            className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 font-medium focus:bg-white transition-all ${
                              emailTouched && !isEmailValid
                                ? "border-amber-300 focus:ring-amber-500"
                                : "border-slate-200 focus:ring-sky-600"
                            }`}
                          />
                        </div>
                        {emailTouched && !isEmailValid && (
                          <p className="text-[10px] text-amber-600 font-medium">Valid email address required</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 block">
                          Contact Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 94311 00000"
                            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white font-medium transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STEP 3: Dynamic Institution Affiliation Section */}
                  {needsInstitution && (
                    <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-sky-700" />
                          <span>3. Affiliated Welfare Institution</span>
                        </label>

                        {role === "institution" && (
                          <button
                            type="button"
                            onClick={() => setIsRegisteringNewInst(!isRegisteringNewInst)}
                            className="text-[11px] text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
                          >
                            {isRegisteringNewInst ? "← Select Existing Institution" : "+ Register New Care Home"}
                          </button>
                        )}
                      </div>

                      {!isRegisteringNewInst ? (
                        <div className="space-y-1.5">
                          <select
                            value={selectedInstitutionId}
                            onChange={(e) => setSelectedInstitutionId(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600 font-medium cursor-pointer shadow-2xs"
                          >
                            {institutionsList.map((inst) => (
                              <option key={inst.id} value={inst.id}>
                                {inst.name} ({inst.city}, {inst.state} — {inst.institution_type})
                              </option>
                            ))}
                          </select>
                          <p className="text-[10px] text-slate-500">
                            Select the officially verified orphanage or elderly care home in the state registry.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-2 border-t border-sky-100">
                          <div className="p-2.5 bg-white border border-sky-100 rounded-lg text-[11px] text-sky-900 font-medium flex items-center gap-2">
                            <Building className="w-4 h-4 text-sky-700 flex-shrink-0" />
                            <span>Provide official details for the new orphanage or senior home:</span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-700 block">
                              Institution Official Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required={isRegisteringNewInst}
                              value={newInstName}
                              onChange={(e) => setNewInstName(e.target.value)}
                              placeholder="e.g. Prerna Senior Citizen Ashram"
                              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 font-medium"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700 block">
                                Home Type <span className="text-rose-500">*</span>
                              </label>
                              <select
                                value={newInstType}
                                onChange={(e) => setNewInstType(e.target.value as InstitutionType)}
                                className="w-full px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium cursor-pointer"
                              >
                                <option value="orphanage">Orphanage (Children)</option>
                                <option value="old_age_home">Old Age Home (Seniors)</option>
                                <option value="mixed">Mixed Care Home</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700 block">
                                Govt License / Reg # <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required={isRegisteringNewInst}
                                value={newInstRegNo}
                                onChange={(e) => setNewInstRegNo(e.target.value)}
                                placeholder="REG-2026-XXXX"
                                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700 block">
                                City
                              </label>
                              <input
                                type="text"
                                value={newInstCity}
                                onChange={(e) => setNewInstCity(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700 block">
                                State
                              </label>
                              <input
                                type="text"
                                value={newInstState}
                                onChange={(e) => setNewInstState(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-700 block">
                                Bed Capacity
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={newInstCapacity}
                                onChange={(e) => setNewInstCapacity(Number(e.target.value))}
                                className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STEP 4: Password & Security */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold text-slate-900 block">
                      {needsInstitution ? "4. Account Password & Credentials" : "3. Account Password & Credentials"}
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 block">
                          Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (error) setError(null);
                            }}
                            placeholder="Min. 6 chars"
                            className="w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white font-medium transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-700 block">
                          Confirm Password <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (error) setError(null);
                            }}
                            placeholder="Re-enter password"
                            className={`w-full pl-9 pr-9 py-2 text-xs bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 font-medium focus:bg-white transition-all ${
                              passwordsMismatch
                                ? "border-rose-300 focus:ring-rose-500"
                                : passwordsMatch
                                ? "border-emerald-300 focus:ring-emerald-500"
                                : "border-slate-200 focus:ring-sky-600"
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {password.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Security Strength:</span>
                          <span className="font-semibold text-slate-700">{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${strength.color}`}
                            style={{ width: `${strength.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Real-time Match Indicator */}
                    {passwordsMismatch && (
                      <p className="text-[11px] text-rose-600 font-semibold">
                        Passwords do not match
                      </p>
                    )}
                    {passwordsMatch && (
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match!
                      </p>
                    )}
                  </div>

                  {/* Verification disclaimer for privileged roles */}
                  {isPrivilegedRole && (
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>Verification Protocol:</strong> As an official <strong>{role.toUpperCase()}</strong>, your account permissions will undergo security review under the Social Welfare Resource Protocol.
                      </div>
                    </div>
                  )}

                  {/* Terms Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600 cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-snug">
                        I confirm that the details provided are accurate and agree to abide by the <strong>Social Welfare Data Integrity and Protection Protocol</strong>.
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    disabled={loading || (emailTouched && !isEmailValid) || password.length < 6 || password !== confirmPassword}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{loadingStep || "Registering Account in Supabase..."}</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>Submit Official Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>

                  <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                    Already registered?{" "}
                    <Link href="/login" className="text-sky-700 font-bold hover:underline">
                      Sign in to your account
                    </Link>
                  </div>

                </form>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
