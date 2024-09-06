"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import { languages } from "@/constants";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { generateLangPlan } from "@/server/actions/user.actions";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ChoseLang = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  let selectedLang = languages.find((lang) => lang.name == selectedLanguage);
  useEffect(() => {
    console.log(selectedLang);
  }, [selectedLang]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("langName", selectedLanguage);
      formData.append("flag", selectedLang?.flag || "");
      await generateLangPlan(formData);
      router.push("/dashboard/plans");
    } catch (error) {
      console.error("Error generating language plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-4 min-h-screen bg-stone-100">
      <h1 className="text-center text-2xl font-extrabold uppercase py-8">
        Select a language that you want to learn
      </h1>
      <div className="mb-4 relative">
        <Input
          type="text"
          placeholder="Search languages"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredLanguages.map((lang) => (
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            key={lang.name}
            className="border rounded-lg p-6 cursor-pointer relative hover:shadow-lg transition-all duration-300 bg-white"
            onClick={() =>
              setSelectedLanguage((prev) =>
                prev == lang.name ? "" : lang.name
              )
            }
          >
            <div className="flex flex-col items-center justify-center h-full">
              <Image
                src={lang.flag}
                alt={lang.name}
                width={128}
                height={128}
                className="w-32 h-auto mb-4 object-contain border border-stone-200 shadow"
              />
              <p className="text-center font-semibold">{lang.name}</p>
            </div>
            {selectedLanguage === lang.name ? (
              <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            ) : (
              <div className="absolute top-2 right-2 border-2 border-gray-300 rounded-full p-1">
                <div className="w-4 h-4"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedLanguage && (
          <motion.div
            className="flex justify-end sticky bottom-4 right-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit}>
              <Button
                className="text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    AI is generating the language plan
                  </div>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ChoseLang;
