import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (!form.email || !form.password) {
        setErr("Email and password are required");
      } else {
        await login(form.email, form.password);
        nav("/");
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Login failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Welcome back</h1>
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          
            
            <Input
           label="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={err && !form.email ? "Enter your email" : ""}
          />
         
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={err && !form.password ? "Enter your password" : ""}
          />
          {err && form.email && form.password && (
            <p className="text-xs text-red-600">{err}</p>
          )}
          <Button variant="primary" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-600">
          No account? <Link to="/register" className="underline">Create one</Link>
        </p>
      </Card>
    </div>
    // <div className="min-h-screen grid lg:grid-cols-2">
    //   {/* left-section */}
    //   <div className="flex flex-col flex-col justify-center items-center p-6 sm:p-12">
    //     <div className=" w-full max-w-md space-y-8">
    //       <div className="text-center mb-8">
    //         <div className="flex flex-col items-center gap-2 group">
    //           <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
    //           <p className="text-base-content/60">Sign in to your account</p>

    //         </div>
    //       </div>
    //       <form onSubmit={onSubmit} className="space-y-6">
    //         <div className="form-control">
    //           <label className="label">
    //             <span className="label-text font-medium">Email</span>
    //           </label>
    //           <div className="relative">
    //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    //               <Mail className="h-5 w-5 text-base-content/40" />
    //             </div>
    //             <input
    //               type="email"
    //               className={`input input-bordered w-full pl-10`}
    //               placeholder="you@example.com"
    //               value={form.email}
    //               onChange={(e) => setForm({ ...form, email: e.target.value })}
    //             />
    //           </div>
    //         </div>

    //         <div className="form-control">
    //           <label className="label">
    //             <span className="label-text font-medium">Password</span>
    //           </label>
    //           <div className="relative">
    //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    //               <Lock className="h-5 w-5 text-base-content/40" />
    //             </div>
    //             <input
    //               type={showPassword ? "text" : "password"}
    //               className={`input input-bordered w-full pl-10`}
    //               placeholder="••••••••"
    //               value={form.password}
    //               onChange={(e) => setForm({ ...form, password: e.target.value })}
    //             />
    //             <button
    //               type="button"
    //               className="absolute inset-y-0 right-0 pr-3 flex items-center"
    //               onClick={() => setShowPassword(!showPassword)}
    //             >
    //               {showPassword ? (
    //                 <EyeOff className="h-5 w-5 text-base-content/40" />
    //               ) : (
    //                 <Eye className="h-5 w-5 text-base-content/40" />
    //               )}
    //             </button>
    //           </div>
    //         </div>
    //         <button type="submit" className="btn btn-primary w-full" >
    //             "Sign in"
    //         </button>

    //       </form>
    //     </div>

    //   </div>

    // </div>
  );
}