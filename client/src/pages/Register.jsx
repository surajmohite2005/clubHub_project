import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (!form.name || !form.email || !form.password) {
        setErr("All fields are required");
      } else {
        await register(form);
        nav("/");
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Registration failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center mb-6">Create your account</h1>
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Full name"
            placeholder="Enter Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={err && !form.name ? "Enter your name" : ""}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={err && !form.email ? "Enter a valid email" : ""}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={err && !form.password ? "Enter a password" : ""}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </Select>

          {err && form.name && form.email && form.password && (
            <p className="text-xs text-red-600">{err}</p>
          )}
          <Button variant="primary" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="underline">Login</Link>
        </p>
      </Card>
    </div>
  );
}