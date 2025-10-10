import React from "react";
import { useLanguage } from "~/contexts/LanguageProvider";
import Button from "~/components/Button/Button";

const Contact = () => {
  const { t } = useLanguage();
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t("homepage.contact.nameRequired");
    if (!form.email.trim()) e.email = t("homepage.contact.emailRequired");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = t("homepage.contact.emailInvalid");
    if (!form.message.trim()) e.message = t("homepage.contact.messageRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // simulate send
    setTimeout(() => {
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    }, 600);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">
          {t("homepage.contact.title")}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          {t("homepage.contact.subtitle")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* left: map */}
          <div className="rounded-lg overflow-hidden border border-gray-200 h-96">
            <iframe
              title="Location map"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d250930.26606079115!2d106.77119637812503!3d10.673758106117626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1760558633562!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* right: form */}
          <div>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <input
                placeholder={t("homepage.contact.name")}
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                className={`w-full border border-gray-300 px-4 py-3 text-sm placeholder-gray-500 ${
                  errors.name ? "ring-1 ring-red-400" : ""
                }`}
              />

              <input
                placeholder={t("homepage.contact.email")}
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                className={`w-full border border-gray-300 px-4 py-3 text-sm placeholder-gray-500 ${
                  errors.email ? "ring-1 ring-red-400" : ""
                }`}
              />

              <textarea
                placeholder={t("homepage.contact.message")}
                rows={8}
                value={form.message}
                onChange={(e) =>
                  setForm((s) => ({ ...s, message: e.target.value }))
                }
                className={`w-full border border-gray-300 px-4 py-3 text-sm placeholder-gray-500 align-top ${
                  errors.message ? "ring-1 ring-red-400" : ""
                }`}
              />

              <div className="w-full border">
                <Button content={t("homepage.contact.send")} w="w-full" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
