"use client";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const router = useRouter();
  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    const response = axios.post("/api/auth/login", { formData });
    toast.promise(response, {
      loading: "Signing in...",
      success: (data: AxiosResponse) => {
        router.push(data.data.route);
        return data.data.message;
      },
      error: (err: any) => {
        console.log(err);
        return err.response.data.message;
      },
    });
  };
  return (
    <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 h-[calc(100vh-5rem)]">
      <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
          <img src="login.png" alt="login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Login to your account
          </h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                }}
              />
              <select
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                }}
              >
                <option value="" disabled>
                  Select User Type
                </option>
                <option value="admin">Admin | Head Of Organisation</option>
                <option value="voter">Voter</option>
              </select>
              {formData.role === "voter" && (
                <div className="p-4 rounded-lg border border-base-content shadow-md">
                  <p className="text-lg font-semibold text-primary">
                    Check if you are a registered voter:
                    <a href="/voters" className="link-primary ml-2">
                      Click here
                    </a>
                  </p>
                  <div className="mt-3">
                    <p className="text-base-content/70 font-medium">
                      Your password is generated using:
                    </p>
                    <ul className="list-disc list-inside text-base-content/60 mt-2">
                      <li>
                        <span className="font-semibold">Step 1:</span> The first
                        half of your password is the first four letters of your
                        first name in capitalized way.
                      </li>
                      <li>
                        <span className="font-semibold">Step 2:</span> The
                        second half of your password is four digits of your
                        birth year.
                      </li>
                    </ul>
                    <p className="text-sm text-base-content/50 mt-2">
                      Ensure you use this format to create a secure password.
                    </p>
                  </div>
                </div>
              )}

              <input
                type="Password"
                placeholder="Enter Your Password"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                }}
              />
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </div>
              <p className="text-center mt-3 text-base text-base-content">
                Don't have an account ?{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => router.push("/signup")}
                >
                  signup
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
