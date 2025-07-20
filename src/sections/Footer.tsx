import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 px-6 transition-colors">
      <div className="max-w-7xl mx-auto flex gap-[24px] flex-wrap items-center justify-center text-gray-800 dark:text-gray-200">
        All right reserved by{" "}
        <a
          href="https://0x.company"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          0x Code Limited
        </a>
      </div>
    </footer>
  );
};

export default Footer;
