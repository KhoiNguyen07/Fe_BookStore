import React, { useEffect, useRef } from "react";
import {
  IoChatbubbleEllipsesOutline,
  IoChevronDown,
  IoHappyOutline,
  IoAttachOutline,
  IoCloseOutline,
  IoSendOutline
} from "react-icons/io5";
import { RiRobotLine } from "react-icons/ri";
import "./geminiCustom.scss";

const GeminiCustom = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadScript = (src, id) => {
      if (document.getElementById(id)) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.id = id;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.body.appendChild(s);
      });
    };

    // Load third-party libs then import our scoped script
    let cleanupFn = null;
    (async () => {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/emoji-mart@latest/dist/browser.js",
          "emoji-mart-script"
        );
      } catch (e) {
        // non-fatal
      }
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/sweetalert2@11.17.2/dist/sweetalert2.all.min.js",
          "sweetalert2-script"
        );
      } catch (e) {
        // non-fatal
      }

      try {
        const mod = await import("./geminiScript");
        if (mod && mod.default && rootRef.current) {
          cleanupFn = await mod.default(rootRef.current);
        } else if (mod && mod.initGemini && rootRef.current) {
          cleanupFn = await mod.initGemini(rootRef.current);
        }
      } catch (err) {
        // ignore for now
      }
    })();

    return () => {
      if (typeof cleanupFn === "function") cleanupFn();
    };
  }, []);

  return (
    <div className="gemini-custom-root" ref={rootRef}>
      <button
        id="chatbot-toggler"
        className="chatbot-toggler text-white"
        aria-label="Open chatbot"
      >
        <IoChatbubbleEllipsesOutline className="text-2xl" />
      </button>

      {/* Compact popup skeleton (hidden until toggled) */}
      <div className="chatbot-popup" role="dialog" aria-hidden="true">
        <div className="chat-header">
          <div className="header-info">
            <RiRobotLine className="chatbot-logo text-3xl" />
            <h3 className="logo-text">Assistant</h3>
          </div>
          <button
            id="close-chatbot"
            className="close-button"
            aria-label="Close chatbot"
          >
            <IoChevronDown className="text-xl" />
          </button>
        </div>

        <div className="chat-body" />

        <div className="chat-footer">
          <form className="chat-form">
            <textarea className="message-input" placeholder="Message..." />
            <div className="chat-controls">
              <button
                type="button"
                id="send-message"
                className="control-button send-button"
              >
                <IoSendOutline className="text-xl" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeminiCustom;
