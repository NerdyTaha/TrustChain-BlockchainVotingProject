"use client";
import { Institute } from "@/types/Institute";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const SignUp = () => {
  const [disabled, setDisabled] = useState(true);
  const [institute, setInstitute] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "candidate",
    institute: "",
    profileImage: "",
  });
  const router = useRouter();

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.profileImage ||
      !formData.institute
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    const response = axios.post("/api/auth/candidate-signup", { formData });
    toast.promise(response, {
      loading: "Creating Account",
      success: () => {
        router.push("/login");
        return "Account Created Successfully";
      },
      error: (err: any) => {
        console.log(err);
        return err.response.data.message;
      },
    });
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB");
        return;
      }
      const imageResponse = axios.postForm("/api/helper/upload-img", { file });
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setFormData({
            ...formData,
            profileImage: data.data.data.url,
          });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };
  const fetchInstitute = async () => {
    try {
      const response = await axios.get("/api/institutions/getAll");
      setInstitute(response.data.institute);
      console.log(institute);
    } catch {
      console.log("Something went wrong");
    }
  };

  useEffect(() => {
    fetchInstitute();
  }, []);

  return (
    <div className="flex justify-center items-center w-full bg-base-200 px-5 py-5 min-h-[calc(100vh-5rem)]">
      <div className="xl:max-w-7xl bg-base-100 drop-shadow-xl border border-base-content/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5 my-auto">
        <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
          <img src="../login.png" alt="../login" className="h-[500px]" />
        </div>
        <div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0">
          <h1 className="text-center text-2xl sm:text-3xl font-semibold text-primary">
            Create Account
          </h1>
          <div className="w-full mt-5 sm:mt-8">
            <div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
              <input
                type="text"
                placeholder="Enter Your Full Name"
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
              />

              <div className="flex flex-col sm:flex-row gap-3 text-base-content">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                />
                <input
                  type="tel"
                  placeholder="Enter Your Contact No"
                  className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                  value={formData.phone}
                  minLength={10}
                  maxLength={10}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                  }}
                />
              </div>

              <select
                className="input input-bordered input-primary w-full text-base-content placeholder:text-base-content/70"
                value={formData.institute}
                onChange={(e) => {
                  setFormData({ ...formData, institute: e.target.value });
                }}
              >
                <option value="" disabled>
                  Select Your Institute
                </option>
                {institute.map((int: Institute) => {
                  return (
                    <option value={int._id} key={int._id}>
                      {int.name}
                    </option>
                  );
                })}
              </select>
              <input
                type="file"
                className="file-input file-input-bordered w-full text-base-content"
                accept="image/* .png .jpeg .jpg"
                onChange={handleProfileImageChange}
              />
              <div className="flex items-center gap-1.5  justify-start pl-2">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      onChange={() => {
                        setDisabled(!disabled);
                      }}
                    />
                  </label>
                </div>
                <h3 className="flex items-center whitespace-nowrap text-base text-base-content">
                  I agree to the
                  <span className="text-primary">&nbsp;Terms</span>
                  &nbsp;and
                  <span className="text-primary">&nbsp;Privacy Policy</span>.
                </h3>
              </div>
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
                <button
                  className="btn btn-outline btn-primary btn-block max-w-[200px]"
                  onClick={handleSubmit}
                  disabled={disabled}
                >
                  Sign Up
                </button>
              </div>
              <p className="text-center mt-3 text-base text-base-content">
                Already have an account?{" "}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => router.push("/login")}
                >
                  Login
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
