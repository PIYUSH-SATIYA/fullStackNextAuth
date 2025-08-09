"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"email" | "reset">("email");
    const [reset, setReset] = useState(false);
    const [error, setError] = useState(false);

    // Check if there's a token in URL (user clicked email link)
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            setStep("reset");
        }
    }, []);

    const sendResetEmail = async () => {
        try {
            if (!email) {
                toast.error("Please enter your email");
                return;
            }

            setLoading(true);
            // Same route, just sending email
            await axios.post("/api/users/forgotpassword", { email });
            toast.success("Password reset email sent! Check your inbox.");
        } catch (error: any) {
            toast.error(
                error.response?.data?.error || "Failed to send reset email"
            );
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        try {
            if (password !== confirmPassword) {
                toast.error("Passwords don't match");
                return;
            }

            if (password.length < 6) {
                toast.error("Password must be at least 6 characters");
                return;
            }

            setLoading(true);
            // Same route, but sending token and password
            await axios.post("/api/users/forgotpassword", {
                token,
                password,
            });

            setReset(true);
            toast.success("Password reset successfully!");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error: any) {
            setError(true);
            toast.error(error.response?.data?.error || "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    if (reset) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl mb-4 text-green-600">
                    Password Reset Successfully!
                </h1>
                <p className="mb-4">Redirecting to login...</p>
                <Link href="/login" className="text-blue-500 underline">
                    Go to Login Now
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl mb-4 text-red-600">Reset Failed</h1>
                <p className="mb-4">
                    The reset link may be expired or invalid.
                </p>
                <Link href="/login" className="text-blue-500 underline">
                    Back to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {step === "email" ? (
                // Step 1: Enter email to receive reset link
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl mb-4">Forgot Password</h1>
                    <p className="mb-4 text-gray-600">
                        Enter your email to receive a password reset link
                    </p>

                    <input
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />

                    <button
                        onClick={sendResetEmail}
                        disabled={loading}
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    <Link href="/login" className="text-blue-500 underline">
                        Back to Login
                    </Link>
                </div>
            ) : (
                // Step 2: Reset password with token
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl mb-4">Reset Password</h1>

                    <h2 className="p-2 bg-orange-500 text-black mb-4">
                        {token ? "Valid Reset Link" : "No token found"}
                    </h2>

                    {token && (
                        <>
                            <input
                                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New Password"
                            />
                            <input
                                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm Password"
                            />
                            <button
                                onClick={resetPassword}
                                disabled={loading}
                                className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 disabled:opacity-50"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </>
                    )}

                    <Link href="/login" className="text-blue-500 underline">
                        Back to Login
                    </Link>
                </div>
            )}
        </div>
    );
}
