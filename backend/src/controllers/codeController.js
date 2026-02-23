const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
    javascript: { language: "javascript", version: "18.15.0" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
};

function getFileExtension(language) {
    const extensions = { javascript: "js", python: "py", java: "java" };
    return extensions[language] || "txt";
}

export async function executeCode(req, res) {
    try {
        const { language, code } = req.body;

        if (!language || !code) {
            return res.status(400).json({ success: false, error: "Language and code are required" });
        }

        const languageConfig = LANGUAGE_VERSIONS[language];
        if (!languageConfig) {
            return res.status(400).json({ success: false, error: `Unsupported language: ${language}` });
        }

        const response = await fetch(`${PISTON_API}/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: languageConfig.language,
                version: languageConfig.version,
                files: [
                    {
                        name: `main.${getFileExtension(language)}`,
                        content: code,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            console.error("Piston API error:", response.status, errorText);
            return res.status(502).json({
                success: false,
                error: `Code execution service error (${response.status})`,
            });
        }

        const data = await response.json();
        const output = data.run.output || "";
        const stderr = data.run.stderr || "";

        if (stderr) {
            return res.json({ success: false, output, error: stderr });
        }

        res.json({ success: true, output: output || "No output" });
    } catch (error) {
        console.error("Error in executeCode controller:", error.message);
        res.status(500).json({ success: false, error: `Failed to execute code: ${error.message}` });
    }
}
