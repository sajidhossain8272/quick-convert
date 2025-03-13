"use client";

import {  FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-100 border-t border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        {/* Left: Branding / Copyright */}
        <div className="text-lg text-gray-700">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">Quick Convert</span>. All rights reserved.
        </div>

        {/* Middle: Legal Links */}
        <div className="flex items-center space-x-20 text-lg">
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Terms of Service
          </a>
        </div>

        <div className="flex items-center space-x-4 text-gray-600">
          {/* <a
            href="#"
            className="hover:text-blue-600 transition-transform transform hover:scale-110"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="hover:text-blue-600 transition-transform transform hover:scale-110"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a> */}
          <a
            href="https://github.com/sajidhossain8272/quick-convert"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-transform transform hover:scale-110"
            aria-label="GitHub"
          >
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}
