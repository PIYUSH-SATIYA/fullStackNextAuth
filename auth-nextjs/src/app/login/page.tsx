"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);
            await axios.post("/api/users/login", user);
            console.log("login success");
            toast.success("login success");
            router.push("/profile");
        } catch (error: any) {
            console.log("login failed", error.message);
            toast.error(error.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const forgotPassword = async () => {
        try {
            const email = user.email;
            if (!email) {
                toast.error("Please enter your email address");
                return; // Add return to stop execution
            }

            setLoading(true);
            // Fix: Send email in request body
            const response = await axios.post("/api/users/forgotpassword", {
                email,
            });
            toast.success("Password reset email sent! Check your inbox.");

            return response;
        } catch (error: any) {
            console.log("Forgot password failed", error.message);
            toast.error(
                error.response?.data?.error || "Failed to send reset email"
            );

            return { message: error.message, status: false };
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>{loading ? "processing" : "Login"}</h1>
            <hr />
            <label htmlFor="email">email</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                type="email"
                id="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="email"
            />
            <label htmlFor="password">password</label>
            <input
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                type="password"
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                placeholder="password"
            />

            <button
                onClick={onLogin}
                disabled={loading}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50"
            >
                {loading ? "Processing..." : "Login here"}
            </button>
            <button
                onClick={forgotPassword}
                disabled={loading}
                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50"
            >
                {loading ? "Sending..." : "Forgot Password?"}
            </button>
            <Link href="/signup">Visit Signup Page </Link>
        </div>
    );
}

export default LoginPage;
