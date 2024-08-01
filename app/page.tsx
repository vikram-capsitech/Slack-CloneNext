"use client";

import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Image from "next/image";
import logo from "@/public/wings.svg";
import MainBannerImg from "@/public/assets/mainBanner.jpg";
import RealTimeChatImg from "@/public/assets/realTimeChat.jpg";
import EasyFileShareImg from "@/public/assets/easyFileSharing.jpg";
import GroupChatImg from "@/public/assets/groupChat.jpg";
import { useEffect, useState } from "react";

const font = Poppins({
  subsets: ["latin"],
  weight: ["500"],
});

export default function Home() {
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);

  useEffect(() => {
    // Automatically hide the welcome card after 4 seconds
    const timer = setTimeout(() => {
      setShowWelcomeCard(false);
    }, 1000);

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {showWelcomeCard && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-50">
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-10/11 max-w-md">
            <div className="flex items-center justify-between flex-col">
              <h2 className="text-[80px]">👋</h2>
              <span className="text-lg font-semibold text-gray-800">
                Welcome to Scraawl !
              </span>
              <div className="bg-yellow-200 text-gray-800 p-1 rounded-md flex items-center space-x-1">
                <span className="text-1xl">⚠️</span>
                <span className="text-sm font-medium">
                  Note: This is a beta version
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header Section */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-2 px-2">
          <div className="flex items-center">
            <Image src={logo} alt="Logo" className="h-8 w-8 mr-3" />
            <span className="text-2xl font-semibold text-gray-900">
              Scraawl
            </span>
          </div>
          <nav>
            <span className="text-sm text-gray-600 bg-yellow-100 px-2 py-1 rounded-lg font-semibold animate-pulse">
              Beta Version
            </span>
          </nav>
          <div>
            <LoginButton mode="model" asChild>
              <Button
                className="px-5 py-1 h-8 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700"
                variant={"secondary"}
                size={"lg"}
              >
                Sign in
              </Button>
            </LoginButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-100 py-14">
        <div className="container mx-auto px-6 text-center">
          <div className="relative">
            <Image
              src={MainBannerImg}
              alt="Main Banner"
              className="mx-auto rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 py-4 bg-gradient-to-t from-gray-100 via-gray-100 to-transparent rounded-lg">
              <h1
                className={`text-4xl font-bold text-gray-900 mb-4 ${font.className}`}
              >
                Stay Connected with Scraawl
              </h1>
              <p className="text-gray-700 mb-8">
                Connect with your team and make communication easier and more
                effective.
              </p>
              <LoginButton
                mode="model"
                asChild
                redirectUri="/auth/register"
                type="register"
              >
                <Button
                  className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
                  variant={"secondary"}
                  size={"lg"}
                >
                  Create Account
                </Button>
              </LoginButton>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Features</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                <Image
                  src={RealTimeChatImg}
                  alt="Feature 1"
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Real-time Messaging
                </h3>
                <p className="text-gray-700">
                  Send and receive messages in real-time with our fast and
                  reliable chat system.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                <Image
                  src={EasyFileShareImg}
                  alt="Feature 2"
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  File Sharing
                </h3>
                <p className="text-gray-700">
                  Easily share files with your team and keep your documents
                  organized.
                </p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                <Image
                  src={GroupChatImg}
                  alt="Feature 3"
                  width={100}
                  height={100}
                  className="mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Group Chats
                </h3>
                <p className="text-gray-700">
                  Create group chats to collaborate with multiple team members
                  at once.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Used Section */}
      <section className="bg-gray-200 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Technology Used
          </h2>
          <p className="text-gray-700 mt-4">
            Our chat application leverages a robust tech stack to deliver a
            secure and seamless experience. We build with{" "}
            <strong>Next.js</strong> for server-side rendering and optimized
            performance, and use <strong>Node.js</strong> alongside{" "}
            <strong>Prisma</strong> for efficient database interactions with{" "}
            <strong>MongoDB</strong>. Security is a top priority, incorporating{" "}
            <strong>bcryptjs</strong> for password hashing,{" "}
            <strong>crypto</strong> for encryption, and{" "}
            <strong>nodemailer</strong> for reliable email notifications.
            Authentication is streamlined with <strong>Google</strong> and{" "}
            <strong>GitHub</strong> login options. Rigorous{" "}
            <strong>security checks</strong> are in place to ensure data
            protection and user privacy.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">
            &copy; 2024 Scraawl. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
