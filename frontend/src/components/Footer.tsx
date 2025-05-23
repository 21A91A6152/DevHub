import { useRecoilValue } from 'recoil';
import { Link } from "react-router-dom";
import { loggedInState } from '../store/atoms/auth';
import { CgProfile } from 'react-icons/cg';
import { BsFilePost } from 'react-icons/bs';
import { FaHome, FaGithub, FaEnvelope, FaInfoCircle, FaTools, FaLock, FaFileAlt, FaCookieBite, FaFileContract} from 'react-icons/fa';
import logo from "../assets/favicon.png";
import { FaRegHandshake } from "react-icons/fa6";
import "../styles/Footer.css"; 

const Footer = () => {
    const isLoggedIn = useRecoilValue(loggedInState);
    const currentYear = new Date().getFullYear();

    return (
        <div className='bg-black text-white p-10'>
            <div className='md:flex'>
                <div className="md:w-1/2 lg:-mt-8 md:-mt-14 sm:mt-1 sm:w-full content-center">
                    <div className=" flex flex-col  md:items-start">
                        <div className="flex items-center sm:w-full">
                            <Link to="/app" className="flex items-center gap-2">
                                <img src={logo} className="h-8" alt="Styleshare Logo" />
                                <span className="ml-4 text-2xl font-semibold whitespace-nowrap text-white">
                                DevHub
                                </span>
                            </Link>
                        </div>
                        <p className="mt-2 text-gray-300 text-sm md:text-base md:text-left lg:w-1/2 sm:w-full pr-2">
                            A simple web-based platform where users can easily contribute, create, explore, and share components.
                        </p>
                    </div>
                </div>
                <div className='md:w-3/4 md:flex'>
                    <div className='md:w-1/3'>
                        <p className='text-gray-200 font-bold mt-8 md:mt-0 section-title'>Company</p>
                        <ul className='text-gray-300 py-4'>
                            <li className='py-1 cursor-pointer'>
                                <Link to='/app/about' className='flex items-center gap-2 link-hover'>
                                    <FaInfoCircle />
                                    About Us
                                </Link>
                            </li>
                            <li className='py-1 cursor-pointer'>
                                <Link to='/app/contact-us' className='flex items-center gap-2 link-hover'>
                                    <FaEnvelope />
                                    Contact Us
                                </Link>
                            </li>
                            <li className='py-1 cursor-pointer'>
                                <a href='/admin' className='flex items-center gap-2 link-hover'>
                                    <FaTools />
                                    Admin Dashboard
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className='md:w-1/3'>
                        <p className='text-gray-200 font-bold section-title'>Quick Links</p>
                        <ul className='text-gray-300 py-4 cursor-pointer'>
                            <li className='py-1 cursor-pointer'>
                                <Link className='flex items-center gap-2 link-hover' to='/app/posts'>
                                    <BsFilePost size={20} />
                                    Posts
                                </Link>
                            </li>
                            <li className='py-1 cursor-pointer'>
                                <Link className='flex items-center gap-2 link-hover' to={isLoggedIn ? '/app/profile' : '/app/signin'}>
                                    <CgProfile size={20} />
                                    Profile
                                </Link>
                            </li>
                            <li className='py-1 cursor-pointer'>
                                <Link to="/app/" className='flex items-center gap-2 link-hover'>
                                    <FaRegHandshake size={20} /> Our Contributors
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='md:w-1/3'>
                        <p className='text-gray-200 font-bold section-title'>Legal</p>
                        <ul className='text-gray-300 py-4 cursor-pointer'>
                            <li className='py-1 cursor-pointer'>
                                <Link to='/app/policy#privacy-policy' className='flex items-center gap-2 link-hover'>
                                    <FaLock />
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className='py-1 cursor-pointer'>
                                <Link to='/app/policy#terms-and-conditions' className='flex items-center gap-2 link-hover'>
                                    <FaFileAlt />
                                    Terms and Conditions
                                </Link>
                            </li>
                            <li className='py-1 cursor-pointer'>
                                <Link to='/app/policy#licensing' className='flex items-center gap-2 link-hover'>
                                <FaFileContract className="w-4 h-4 mr-0.5" />
                                    Licensing
                                </Link>
                            </li>
                            <li className='py-1 cursor-pointer'>
                                <Link to='/app/policy#cookie-policy' className='flex items-center gap-2 link-hover'>
                                    <FaCookieBite />
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className='block w-3/4 m-auto mt-10'>
                <div className='flex gap-4 justify-center md:justify-end'>
                    <a href="https://github.com/21A91A6152/StyleShare" className="hover:scale-110 hover:shadow-[0_0_10px_2px_blue] transition-transform duration-300 ease-in-out flex items-center justify-center p-2 rounded-full">
                        <FaGithub size={35} className="text-white" />
                    </a>
                    <Link to='/app' className="hover:scale-110 hover:shadow-[0_0_10px_2px_blue] transition-transform duration-300 ease-in-out flex items-center justify-center p-2 text-white rounded-full focus:outline-none">
                        <FaHome size={35} />
                    </Link>
                </div>
            </div>
            <div className='mt-10 text-gray-300 flex justify-center text-md lg:text-xl xl:text-md'>
                © {currentYear} DevHub. All Rights Reserved.
            </div>
        </div>
    )
}

export default Footer;
