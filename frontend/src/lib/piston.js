// Code execution via backend proxy (avoids CORS/auth issues with direct Piston API calls)

import axiosInstance from "./axios";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to execute
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const supportedLanguages = ["javascript", "python", "java"];

    if (!supportedLanguages.includes(language)) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await axiosInstance.post("/api/code/execute", {
      language,
      code,
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.message || "Failed to execute code";
    return {
      success: false,
      error: errorMessage,
    };
  }
}