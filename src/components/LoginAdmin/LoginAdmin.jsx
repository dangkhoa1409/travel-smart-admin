import React, { useState } from "react";

const LoginAdmin = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({email, password});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="px-24">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
          required
        />
      </div>
      <div className="px-24">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none"
          required
        />
      </div>
      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="w-1/4 py-3 px-2 mt-2 font-bold text-white bg-primary rounded-md hover:bg-buttondark focus:outline-none transition duration-150 ease-in-out"
        >
          Đăng Nhập
        </button>
      </div>
    </form>
  );
};

export default LoginAdmin;
