import { useState } from "react";

export const useCopyText = () => {
  const [setCopied] = useState(false);
  const handleCopy = async (value) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        // fallback cho http hoặc browser cũ
        const textArea = document.createElement("textarea");
        textArea.value = value;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed: ", err);
    }
  };
  return {
    handleCopy
  };
};
