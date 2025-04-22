'use client';
import React, { useState } from 'react';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [resetCode, setResetCode] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (resetCode.length !== 6 || isNaN(Number(resetCode))) {
            alert('Please enter a valid 6-digit reset code.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/verify-reset-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resetCode }),
            });

            if (response.ok) {
                alert('Reset code verified successfully!');
                // Redirect to the password reset page
                router.push('/new_password');
            } else {
                alert('Invalid reset code. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#212026]">
            <div className="h-screen flex max-md:flex-col justify-center items-center content-center w-full">
                {/* Form Section */}
                <div className="flex flex-col h-2/3 w-1/3 max-md:h-fit max-md:p-5 max-md:w-full bg-black shadow-[0_0_15px_black]">
                    <div className="flex w-full justify-start">
                        <IoArrowBackCircleOutline
                            className="text-3xl cursor-pointer hover:text-white hover:drop-shadow-[0_0_10px_white] arrow-btn m-2"
                            onClick={() => router.back()} // Navigate back
                        />
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center w-full h-full content-center rounded-lg">
                        <div className="leading-10">
                            <h1 className="text-5xl font-[700] font-Poppins text-center">Reset Password</h1>
                            <p className="text-l text-center font text-center">Enter the 6-digit code sent to your email</p>
                        </div>

                        <div className="flex flex-col w-full content-center items-center justify-center">
                            <div className="flex flex-col justify-center items-center content-center mt-10 w-full">
                                <div className="flex justify-start w-2/3">
                                    <label htmlFor="resetCode" className="text-[#d9d9D9]">Reset Code</label>
                                </div>
                                <input
                                    type="text"
                                    name="resetCode"
                                    id="resetCode"
                                    value={resetCode}
                                    onChange={(e) => setResetCode(e.target.value)}
                                    aria-label="Reset Code"
                                    className="bg-white rounded-lg h-10 w-2/3 text-black px-2"
                                    maxLength={6}
                                    pattern="\d*"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-10 w-fit bg-[#717171] rounded-md p-1 px-20 ${
                                loading ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-[#464646]'
                            }`}
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                    </form>
                </div>

                {/* Info Section */}
                <div className="flex h-2/3 w-1/3 flex-col max-md:h-1/2 max-md:p-5 max-md:w-full content-center items-center justify-between bg-[#717171] shadow-[0_0_15px_black]">
                    <h1 className="mt-8 text-4xl font-serif">
                        <span className="text-[#2eabff] capitalize">find</span>My<span className="text-[#2eabff] capitalize inline-block">tech</span>
                    </h1>
                    <h1 className="text-5xl font-[700] font-Poppins text-center">Hello user</h1>
                    <p className="text-2xl font text-center w-3/4">Enter the reset code sent to your email to continue</p>
                    <Link href={'/Sign_in'}>
                        <button className="border-btn w-fit p-2 px-8 cursor-pointer">Sign in</button>
                    </Link>
                    <div className="h-1/4"></div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;