import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  setUser,
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submit, setSubmit] = useState("") // Selected Role
  const [errorMsg, setErrorMsg] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    setErrorMsg("");

    if (!email || !password || !submit) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    const endpoint = submit === "ADMIN" 
      ? "https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/auth/admin" 
      : "https://visitor-management-system-git-main-aidonpatraos-projects.vercel.app/api/auth/operator";

    try {
      const response = await axios.post(
        endpoint,
        { email, password, role: submit },
        { withCredentials: true }
      );
      
     
      const userData = response.data;
      if (setUser) setUser(userData);

      if (submit === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/operator");
      }
    } catch (err) {
      console.error("AXIOS ERROR:", err);
      setErrorMsg(err.response?.data?.message || "Login failed. Check your credentials.");
    }
  }
  
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="w-full min-h-96 rounded-3xl border border-sky-300/15 bg-slate-950/85 shadow-2xl shadow-sky-950/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex justify-center pt-8 font-mono text-3xl text-sky-300">Login to your account</CardTitle>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <div className="mx-10 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400 text-center font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <FieldGroup>
              <Field className="px-10 mt-4">
                <FieldLabel htmlFor="email" className="p-2 font-jakarta text-sky-300">Email</FieldLabel>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com" 
                  required 
                  className="border-slate-700 bg-slate-900/70 text-white placeholder:font-spacegrotesk placeholder:text-slate-500 focus-visible:border-sky-400 focus-visible:ring-sky-400/30 p-6" 
                />
              </Field>
              <Field className="px-10">
                <div>
                  <FieldLabel htmlFor="password" className="m-2 font-jakarta text-sky-300">Password</FieldLabel>
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="border-slate-700 bg-slate-900/70 text-white focus-visible:border-sky-400 focus-visible:ring-sky-400/30 p-6" 
                />
              </Field>
              <Field className="px-32 flex items-center " >
                <select 
                  id="role"
                  name="role"
                  value={submit} 
                  className="bg-slate-300 border-slate-600 rounded-2xl p-2 " 
                  required 
                  onChange={(e) => setSubmit(e.target.value)}
                >
                  <option value="" disabled hidden>Select Role</option>
                  <option value="OPERATOR">OPERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                {/* Direct onClick trigger added here */}
                <Button 
                  type="button" 
                  onClick={handleLogin}
                  className="bg-sky-500 py-5 text-slate-950 hover:bg-sky-300 mb-8 cursor-pointer" 
                  disabled={!submit}
                >
                  Login
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}