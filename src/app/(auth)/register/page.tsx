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
  FileText,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        return { score: 75, label: "Good", color: "bg-blue-500" };
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
      let finalInstitutionName: string | undefined = undefined;

      // Step 1: If registering a new institution, create institution record in Supabase
      if (needsInstitution) {
        if (isRegisteringNewInst) {
          if (!newInstName.trim() || !newInstRegNo.trim()) {
            setError("Please fill in the Institution Name and Registration Number.");
            setLoading(false);
            return;
          }

          setLoadingStep("Registering new institution in Supabase database...");
          const newInst = await registerInstitutionInSupabase({
            name: newInstName.trim(),
            institution_type: newInstType,
            registration_number: newInstRegNo.trim(),
            address: newInstAddress.trim() || `${newInstCity}, ${newInstState}`,
            city: newInstCity.trim(),
            state: newInstState.trim(),
            pincode: newInstPincode.trim(),
            contact_email: trimmedEmail,
            contact_phone: trimmedPhone || "+91 94311 00000",
            capacity: Number(newInstCapacity) || 50,
          });

          if (newInst) {
            finalInstitutionId = newInst.id;
            finalInstitutionName = newInst.name;
          }
        } else if (selectedInstitutionId) {
          const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(selectedInstitutionId);
          if (isUUID) {
            finalInstitutionId = selectedInstitutionId;
            finalInstitutionName = institutionsList.find((i) => i.id === selectedInstitutionId)?.name;
          }
        }
      }

      // Step 2: Persist user account directly to Supabase Auth
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

      // Step 3: Ensure session is signed in
      setLoadingStep("Activating authorized session in Supabase...");
      try {
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: password,
        });
      } catch {
        // Non-fatal if email confirmation setting applies
      }

      // Step 4: Synchronize with application role context
      registerUser({
        fullName: trimmedFullName,
        email: trimmedEmail,
        role: role,
        phone: trimmedPhone,
        institutionId: finalInstitutionId || undefined,
        id: registeredUserId,
      });

      setRegisteredData({
        id: registeredUserId,
        email: trimmedEmail,
        role: role,
        institutionName: finalInstitutionName,
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
    <div className="space-y-4">
      <Card className="bg-white border-slate-200 text-slate-900 shadow-md">
        <CardHeader className="pb-3 text-center">
          <CardTitle className="text-base text-slate-900 font-bold">
            Portal Registration &amp; Account Provisioning
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Create a real user account backed directly by Supabase Authentication &amp; Postgres RLS
          </CardDescription>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="p-4 text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">
                  Registration Successfully Stored in Supabase!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  Your credentials and profile have been permanently saved to Supabase PostgreSQL database.
                </p>
              </div>

              {registeredData && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-left space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Supabase User ID:</span>
                    <span className="font-mono text-[11px] font-semibold text-slate-800">
                      {registeredData.id ? registeredData.id.slice(0, 18) + "..." : "Generated"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Registered Email:</span>
                    <span className="font-semibold text-slate-900">{registeredData.email}</span>
                  </div>
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Assigned Role:</span>
                    <Badge variant="outline" className="uppercase text-[10px] font-bold tracking-wider">
                      {registeredData.role}
                    </Badge>
                  </div>
                  {registeredData.institutionName && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Affiliated Institution:</span>
                      <span className="font-semibold text-indigo-700 truncate max-w-[180px]">
                        {registeredData.institutionName}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isPrivilegedRole
                  ? "Note: Official role privileges (e.g. medical or state auditor records) undergo security verification by the State Social Welfare Coordinator."
                  : "Your account session is active and authenticated."}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="w-full flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 text-xs"
                >
                  Enter Portal Dashboard
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
                <Link
                  href={`/login?email=${encodeURIComponent(registeredData?.email || "")}&registered=true`}
                  className="w-full flex-1"
                >
                  <Button variant="outline" className="w-full py-2 text-xs font-semibold">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex flex-col gap-2 animate-in fade-in-50">
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
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-1 px-3 shadow-xs"
                        >
                          Sign In with this Account &rarr;
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">
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
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">
                    Official Email Address <span className="text-rose-500">*</span>
                  </label>
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
                      placeholder="name@welfare.org"
                      className={`w-full pl-9 pr-3 py-2 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 font-medium ${
                        emailTouched && !isEmailValid
                          ? "border-amber-300 focus:ring-amber-500"
                          : "border-slate-200 focus:ring-indigo-500"
                      }`}
                    />
                  </div>
                  {emailTouched && !isEmailValid && (
                    <p className="text-[10px] text-amber-600 font-medium">Valid email required</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 94311 00000"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block">
                  Select System Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const nextRole = e.target.value as UserRole;
                    setRole(nextRole);
                    if (nextRole !== "institution") {
                      setIsRegisteringNewInst(false);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                >
                  <option value="donor">Donor (Philanthropist / Citizen Support)</option>
                  <option value="volunteer">Volunteer (Field Staff / Community Support)</option>
                  <option value="institution">Institution Superintendent (Orphanage / Senior Care Admin)</option>
                  <option value="doctor">Medical Doctor (Clinical Reviewer &amp; Health Assessments)</option>
                  <option value="ngo">NGO Representative (Program Coordinator)</option>
                  <option value="government">Government Welfare Officer (State Auditor / Inspector)</option>
                </select>
              </div>

              {/* Institution Affiliation Section */}
              {needsInstitution && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-800 font-bold flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-indigo-600" />
                      <span>Affiliated Welfare Institution</span>
                    </label>

                    {role === "institution" && (
                      <button
                        type="button"
                        onClick={() => setIsRegisteringNewInst(!isRegisteringNewInst)}
                        className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold underline cursor-pointer"
                      >
                        {isRegisteringNewInst ? "Choose Existing Institution" : "+ Register New Institution"}
                      </button>
                    )}
                  </div>

                  {!isRegisteringNewInst ? (
                    <div className="space-y-1">
                      <select
                        value={selectedInstitutionId}
                        onChange={(e) => setSelectedInstitutionId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                      >
                        {institutionsList.map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name} ({inst.city}, {inst.state} — {inst.institution_type})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500">
                        Select the registered home verified in the state welfare database.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1 border-t border-slate-200">
                      <div className="p-2 bg-indigo-50/70 rounded-lg text-[11px] text-indigo-800 font-medium flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Provide official details for the new orphanage or senior home:</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-700 font-semibold block text-[11px]">
                          Institution Official Name
                        </label>
                        <input
                          type="text"
                          required={isRegisteringNewInst}
                          value={newInstName}
                          onChange={(e) => setNewInstName(e.target.value)}
                          placeholder="e.g. Prerna Senior Citizen Ashram"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-slate-700 font-semibold block text-[11px]">
                            Home Type
                          </label>
                          <select
                            value={newInstType}
                            onChange={(e) => setNewInstType(e.target.value as InstitutionType)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-medium"
                          >
                            <option value="orphanage">Orphanage (Children)</option>
                            <option value="old_age_home">Old Age Home (Seniors)</option>
                            <option value="mixed">Mixed Care Home</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-700 font-semibold block text-[11px]">
                            Govt Reg / License #
                          </label>
                          <input
                            type="text"
                            required={isRegisteringNewInst}
                            value={newInstRegNo}
                            onChange={(e) => setNewInstRegNo(e.target.value)}
                            placeholder="REG-2026-XXXX"
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-slate-700 font-semibold block text-[11px]">
                            City
                          </label>
                          <input
                            type="text"
                            value={newInstCity}
                            onChange={(e) => setNewInstCity(e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-700 font-semibold block text-[11px]">
                            State
                          </label>
                          <input
                            type="text"
                            value={newInstState}
                            onChange={(e) => setNewInstState(e.target.value)}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-slate-700 font-semibold block text-[11px]">
                            Capacity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={newInstCapacity}
                            onChange={(e) => setNewInstCapacity(Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">
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
                      className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
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

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">
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
                      placeholder="Min. 6 chars"
                      className={`w-full pl-9 pr-9 py-2 bg-slate-50 border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 font-medium ${
                        passwordsMismatch
                          ? "border-rose-300 focus:ring-rose-500"
                          : passwordsMatch
                          ? "border-emerald-300 focus:ring-emerald-500"
                          : "border-slate-200 focus:ring-indigo-500"
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
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Password Strength:</span>
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
                <p className="text-[11px] text-rose-600 font-medium">
                  Passwords do not match
                </p>
              )}
              {passwordsMatch && (
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match!
                </p>
              )}

              {/* Verification disclaimer for privileged roles */}
              {isPrivilegedRole && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Verification Requirement:</strong> Because you are registering as an official {role.toUpperCase()}, administrative audit rights or sensitive clinical records will be subject to state verification.
                  </div>
                </div>
              )}

              {/* Social Welfare Agreement Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-600 leading-snug">
                    I confirm that the details submitted are accurate and understand that records are auditable under the Social Welfare Resource Protocol.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm"
                disabled={loading || (emailTouched && !isEmailValid) || password.length < 6 || password !== confirmPassword}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{loadingStep || "Registering Account in Supabase..."}</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5">
                    <span>Submit Official Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <div className="text-center text-xs text-slate-500 pt-1">
                Already registered?{" "}
                <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
                  Sign in to your account
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
