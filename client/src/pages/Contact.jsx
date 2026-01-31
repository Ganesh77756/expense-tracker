import { useState } from "react";
import toast from "react-hot-toast";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();

    toast.success("Message sent successfully!");

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Contact <span className="text-purple-600">Us</span>
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Have questions or need help? Reach out to us and our support team will
        get back to you as soon as possible.
      </p>

      <form
        onSubmit={submit}
        className="bg-white shadow-lg p-8 rounded-xl grid gap-6 max-w-xl"
      >
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="Your full name"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none"
            placeholder="Write your message here"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Send Message
        </button>
      </form>

      <div className="mt-16 text-gray-700 text-lg">
        <p>
          📧 Email:{" "}
          <span className="text-purple-600">support@finsight.com</span>
        </p>
        <p className="mt-2">📍 Address: Pimpri Pune Maharashtra, India</p>
        <p className="mt-2">📞 Phone: +91 9284955948</p>
      </div>
    </div>
  );
};

export default Contact;
