import { useState } from "react";
import { Input } from "./ui/input";
import { Eye, EyeIcon, EyeOff } from "lucide-react";
export default function PasswordInputPage({ fieldValue }) {
  const [isPasswordVisible, setisPasswordVisible] = useState(false);

  function togglePasswordVisibilty() {
    setisPasswordVisible(!isPasswordVisible);
  }

  return (
    <div className="relative">
      <Input
        type={isPasswordVisible ? "text" : "password"}
        className="text-black text-sm font-semibold pr-10"
        {...fieldValue}
        placeholder="enter your password"
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 focus:outline-none"
        onClick={togglePasswordVisibilty}
      >
        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
