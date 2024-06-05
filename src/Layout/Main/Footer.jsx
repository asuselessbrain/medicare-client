import { FaFacebook, FaGithub, FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logoImage from "../../assets/logo.png";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-gray-950 px-3">
            <div className="mx-auto w-full max-w-screen-xl py-6 lg:py-8">
                <div className="flex flex-col md:flex-row justify-between px-5 lg:px-0">
                    <div className="mb-6 md:mb-0 md:w-1/3">
                        <Link href="/" className="flex items-center">
                            <img src={logoImage} className="h-20 me-3" alt="MediCare Logo" />
                        </Link>
                        <p className="py-2 text-gray-400">
                            Welcome to MediCamp, where healthcare meets compassion. Our mission is
                            to provide accessible and quality medical services to all. Join us in
                            our efforts to promote well-being and community health. Together, let&apos;s
                            create a healthier tomorrow.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase">
                                Resources
                            </h2>
                            <ul className="text-gray-400 font-medium">
                                <li className="mb-2">
                                    <Link to="/login" className="hover:underline">
                                        Login
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link to="/register" className="hover:underline">
                                        Register
                                    </Link>
                                </li>
                                <li className="mb-4">
                                    <Link to="/available-camps" className="hover:underline">
                                        All Camps
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-300 uppercase">
                                Contact
                            </h2>
                            <p className="mb-2 flex items-center justify-start text-gray-400 font-medium">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="mr-3 h-5 w-5"
                                >
                                    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                                    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                                </svg>
                                New York, NY 10012, US
                            </p>
                            <p className="mb-2 flex items-center text-gray-400 font-medium">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="mr-3 h-5 w-5"
                                >
                                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                </svg>
                                info@example.com
                            </p>
                            <p className="mb-2 flex items-center  text-gray-400 font-medium">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="mr-3 h-5 w-5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                + 01 234 567 88
                            </p>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-300 sm:mx-auto lg:my-5" />
                <div className="flex items-center justify-center flex-col sm:flex-row sm:justify-between">
                    <span className="text-sm text-gray-400 sm:text-center">
                        © {currentYear}{" "}
                        <Link href="https://flowbite.com/" className="hover:underline">
                            MediCare™
                        </Link>
                        . All Rights Reserved.
                    </span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0">
                        <Link className="text-gray-400 hover:text-gray-900  ms-5 bg-white rounded-full shadow p-2">
                            <FaFacebook fill="#0866FF" />
                            <span className="sr-only">Facebook page</span>
                        </Link>
                        <Link className="text-gray-400 hover:text-gray-900 ms-5 bg-white rounded-full shadow p-2">
                            <FaSquareXTwitter fill="#020202" />
                            <span className="sr-only">Twitter page</span>
                        </Link>
                        <Link className="text-gray-400 hover:text-gray-900 ms-5 bg-white rounded-full shadow p-2">
                            <FaYoutube fill="#FF0000" />
                            <span className="sr-only">Youtube</span>
                        </Link>
                        <Link className="text-gray-400 hover:text-gray-900 ms-5 bg-white rounded-full shadow p-2">
                            <FaGithub fill="#000" />
                            <span className="sr-only">GitHub account</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
