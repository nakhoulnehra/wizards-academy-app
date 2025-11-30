import React, { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import contactImg from "../assets/images/des.png";
import "../styles/contact.css";
import useAuthStore from "../store/authStore";
import {
  createSupportRequest,
  getSupportRequests,
  replyToSupportRequest,
} from "../services/supportService";

export default function ContactPage() {
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const user = useAuthStore((s) => s.user);

  // Form state (for non-admin)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Admin inbox state
  const [requests, setRequests] = useState([]);
  const [loadingInbox, setLoadingInbox] = useState(false);
  const [inboxError, setInboxError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [reply, setReply] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  // Toast state (global for the page)
  // { type: "success" | "error", message: string } or null
  const [toast, setToast] = useState(null);

  // helper to show toast + auto-hide
  const showToast = (type, message) => {
    setToast({ type, message });
    // auto hide after 4s
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // If user is logged in and not admin, pre-fill name/email
  useEffect(() => {
    if (!isAdmin && user) {
      setFormData((prev) => ({
        ...prev,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.email || "",
      }));
    }
  }, [isAdmin, user]);

  // Load inbox for admins
  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      try {
        setLoadingInbox(true);
        setInboxError("");
        const data = await getSupportRequests();
        setRequests(data);
        if (data.length > 0 && !selectedId) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error(err);
        setInboxError(err.message || "Failed to load messages");
        showToast("error", err.message || "Failed to load messages");
      } finally {
        setLoadingInbox(false);
      }
    };

    load();
  }, [isAdmin]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await createSupportRequest(formData);

      // reset form (keep logged-in user's name/email if available)
      setFormData({
        name: user
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
          : "",
        email: user?.email || "",
        message: "",
      });

      showToast(
        "success",
        "Thank you for your message! We'll get back to you soon."
      );
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err.message || "Failed to send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRequest = requests.find((r) => r.id === selectedId) || null;

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedRequest || !reply.trim()) return;

    try {
      setSendingReply(true);
      await replyToSupportRequest(selectedRequest.id, reply.trim());
      setReply("");
      showToast("success", "Reply recorded (no email sent).");
    } catch (err) {
      console.error(err);
      showToast(
        "error",
        err.message || "Failed to record reply. Please try again."
      );
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="app-root">
      <Navbar />

      <main className="contact-page">
        {/* Animated Background Elements */}
        <div className="contact-bg-elements">
          <div className="bg-circle circle-1"></div>
          <div className="bg-circle circle-2"></div>
          <div className="bg-circle circle-3"></div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`contact-toast contact-toast--${toast.type}`}>
            <span>{toast.message}</span>
            <button
              type="button"
              className="contact-toast__close"
              onClick={() => setToast(null)}
            >
              ×
            </button>
          </div>
        )}

        <div className="container">
          <div className="contact-header">
            <h1 className="contact-title">
              {isAdmin ? (
                "Support Inbox"
              ) : (
                <>
                  Get In <span className="gradient-text">Touch</span>
                </>
              )}
            </h1>
            <p className="contact-subtitle">
              {isAdmin
                ? "View and reply to messages sent by parents and players."
                : "Ready to join the Wizards family? We're here to answer all your questions and help you start your football journey."}
            </p>
          </div>

          {!isAdmin ? (
            // ─────────────────────
            // CLIENT / GUEST VIEW
            // ─────────────────────
            <div className="contact-content">
              {/* Left: form */}
              <div className="contact-form-section">
                <div className="form-card">
                  <h3>Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Your Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your interests or questions..."
                        rows="5"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="btn btn--primary btn--full"
                      disabled={submitting}
                    >
                      {submitting ? "Sending..." : "Send Message"}
                      <span className="btn-arrow">→</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Right: info card (same as before) */}
              <div className="contact-info-section">
                <div className="info-card">
                  <div className="contact-image-container">
                    <img
                      src={contactImg}
                      alt="Football training"
                      className="contact-image"
                    />
                    <div className="image-overlay"></div>
                  </div>

                  <div className="contact-details">
                    <h4>Contact Information</h4>

                    <div className="contact-item">
                      <div className="contact-icon">📞</div>
                      <div className="contact-text">
                        <strong>Phone Number</strong>
                        <span>76878913</span>
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">📧</div>
                      <div className="contact-text">
                        <strong>Email Address</strong>
                        <span>johnmilan556@gmail.com</span>
                      </div>
                    </div>

                    <div className="contact-item">
                      <div className="contact-icon">🕒</div>
                      <div className="contact-text">
                        <strong>Response Time</strong>
                        <span>Within 24 hours</span>
                      </div>
                    </div>

                    {/* your social icons block remains here */}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // ─────────────────────
            // ADMIN VIEW
            // ─────────────────────
            <div
              className="contact-content"
              style={{ gridTemplateColumns: "1.1fr 1.2fr" }}
            >
              {/* Left: list of messages */}
              <div className="contact-form-section">
                <div className="form-card">
                  <h3>Incoming Messages</h3>
                  {loadingInbox && <p>Loading messages…</p>}
                  {inboxError && (
                    <p style={{ color: "#ff7b7b" }}>{inboxError}</p>
                  )}
                  {!loadingInbox && !inboxError && requests.length === 0 && (
                    <p>No messages yet.</p>
                  )}

                  {!loadingInbox && requests.length > 0 && (
                    <ul className="support-list">
                      {requests.map((r) => (
                        <li
                          key={r.id}
                          className={`support-list-item ${
                            r.id === selectedId ? "is-active" : ""
                          }`}
                          onClick={() => {
                            setSelectedId(r.id);
                            setReply("");
                          }}
                        >
                          <div className="support-list-item-main">
                            <span className="support-list-email">
                              {r.email}
                            </span>
                            <span className="support-list-subject">
                              {r.subject || "No subject / name"}
                            </span>
                          </div>
                          <span className="support-list-date">
                            {new Date(r.createdAt).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Right: message + reply */}
              <div className="contact-info-section">
                <div className="info-card">
                  {selectedRequest ? (
                    <>
                      <h4>Message details</h4>
                      <p>
                        <strong>From:</strong> {selectedRequest.email}
                      </p>
                      {selectedRequest.subject && (
                        <p>
                          <strong>Name / subject:</strong>{" "}
                          {selectedRequest.subject}
                        </p>
                      )}
                      <p>
                        <strong>Received:</strong>{" "}
                        {new Date(selectedRequest.createdAt).toLocaleString()}
                      </p>

                      <div
                        style={{
                          marginTop: "1rem",
                          padding: "1rem",
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: "12px",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {selectedRequest.message}
                      </div>

                      <form
                        onSubmit={handleSendReply}
                        style={{ marginTop: "1.5rem" }}
                      >
                        <label
                          htmlFor="reply"
                          style={{
                            display: "block",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Reply (logged only, no email)
                        </label>
                        <textarea
                          id="reply"
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          rows="4"
                          style={{
                            width: "100%",
                            borderRadius: "10px",
                            padding: "0.75rem",
                          }}
                          placeholder="Type your reply to this parent..."
                        />
                        <button
                          type="submit"
                          className="btn btn--primary btn--full"
                          style={{ marginTop: "1rem" }}
                          disabled={sendingReply || !reply.trim()}
                        >
                          {sendingReply ? "Sending…" : "Save Reply"}
                        </button>
                      </form>
                    </>
                  ) : (
                    <p>Select a message on the left to view details.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
