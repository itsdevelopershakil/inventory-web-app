import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { Link } from "react-router-dom";
import { z } from "zod";
import logo from "../assets/logo/logo.png";

// zod schema
const loginSchema = z.object({
    username: z.string().min(1, "Username or Email is required"),
    password: z.string().min(1, "Password is required"),
});

type loginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const [theme, setTheme] = useState(
        () => localStorage.getItem("theme") || "light"
    );

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    const handleToggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<loginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = (data: loginForm) => {
        console.log("Login Data: ", data);
        // Handle Login logic here
    };

    return (
        <div className="h-screen p-4 bg-white dark:bg-[#18191A] transition-colors duration-300 relative flex items-center justify-center">
            <div className="p-6 md:p-8 gap-4 absolute top-0 right-0">
                <button onClick={handleToggleTheme} className="cursor-pointer">
                    {theme === "light" ? (
                        <MdOutlineLightMode className="size-6 text-[#1a1a1a]" />
                    ) : (
                        <MdOutlineDarkMode className="size-6 text-white" />
                    )}
                </button>
            </div>

            <div className="max-w-[520px] border rounded-md pb-10 bg-white dark:bg-[#242526] border-gray-300 dark:border-gray-800">
                <div className="bg-[#1a1a1a] dark:bg-[#ddd] flex justify-center rounded-t-md">
                    <img
                        src={logo}
                        alt="logo"
                        className="object-contain size-18 p-2"
                    />
                </div>
                <p className="text-xs pt-10 p-4 text-[#1a1a1a] dark:text-gray-300">
                    Welcome to the Fit and Found Point Of Sale System. To
                    continue, please login using your username and password
                    below.
                </p>
                <h3 className="text-xl md:text-3xl font-medium text-center py-2 text-gray-500 dark:text-[#838aa0]">
                    Press login to continue
                </h3>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="p-4 space-y-3 text-base"
                >
                    <input
                        type="text"
                        placeholder="Username or Email"
                        {...register("username")}
                        className="w-full border border-gray-400 outline-0 p-2 rounded-sm text-sm md:text-base placeholder:text-gray-500 dark:text-gray-200 dark:placeholder:text-gray-400"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.username.message}
                        </p>
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        className="w-full border border-gray-400 outline-0 p-2 rounded-sm text-sm md:text-base placeholder:text-gray-500 dark:text-gray-200 dark:placeholder:text-gray-400"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                        </p>
                    )}
                    <Link
                        to={"/reset-password"}
                        className="block text-right text-gray-400 hover:underline text-sm"
                    >
                        Reset Password?
                    </Link>
                    <button
                        type="submit"
                        className="w-full p-2 rounded-sm cursor-pointer text-sm md:text-base bg-[#1a1a1a] text-white dark:bg-gray-300 dark:text-[#1a1a1a]"
                    >
                        LOGIN
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
