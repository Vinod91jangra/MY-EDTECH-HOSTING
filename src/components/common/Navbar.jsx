import React, { useEffect, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import {NavbarLinks} from '../../data/navbar-links';
import Logo from '../../assets/Logo/Logo-Full-Light.png';
import { useSelector } from 'react-redux';
import {AiOutlineMenu, AiOutlineShoppingCart} from "react-icons/ai"
import ProfileDropDown from '../core/Auth/ProfileDropDown';
import { APIConnector } from '../../services/APIConnector';
import { categories } from '../../services/APIS';
import {IoIosArrowDropdownCircle} from 'react-icons/io'
import { ACCOUNT_TYPE } from "../../utils/constants"



const Navbar = () => {

  const {token} = useSelector((state) => state.auth);
  const {user} = useSelector((state) => state.profile);
  const {totalItems} = useSelector((state) => state.cart);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
   const[mobileMenuOpen,setMobileMenuOpen] = useState(false);


  const fetchSubLinks = async() => {
    setLoading(true);
    try{
      const result = await APIConnector("GET", categories.CATEGORIES_API);
      console.log("Printing SubLinks result : ", result);
      setSubLinks(result.data.data);

    }
    catch(err){
      console.log("Could not fetch the category list ",err);
    }
    setLoading(false);
  }



  useEffect(()=>{
    fetchSubLinks();
  },[]);



  const matchRoute = (route)=>{
    return matchPath({path:route}, location.pathname);
  }


  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-richblack-700'>
        <div className='w-11/12 max-w-maxContent flex items-center justify-between mx-auto'>
            
            {/* Image */}
            <Link to='/'>
              <img src={Logo} alt="StudyNotion logo" width={160} height={32}/>
            </Link>


            {/* Nav Links */}
            <nav className='hidden md:block'>
              <ul className='flex flex-row gap-x-6 text-richblack-25'>
                {
                  NavbarLinks.map((element, index)=>{
                    return (
                      <li key={index}>
                        {
                          element.title === 'Explore Courses' ?
                          (<div className={`relative flex flex-row items-center font-semibold gap-1 group
                            ${matchRoute("/catalog/:catalogName") ? "text-yellow-25" : "text-richblack-25"}
                          `}>
                            <p>{element.title}</p>
                            <IoIosArrowDropdownCircle/>

                            <div className='invisible absolute left-[50%] top-[50%] translate-x-[-50%]
                            translate-y-[3em] flex flex-col rounded-lg bg-richblack-5 p-4
                            text-richblack-900 opacity-0 transition-all duration-150
                            group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 w-[200px] lg:w-[300px] z-[1000]'>
                            
                              <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded
                              bg-richblack-5 translate-x-[80%] translate-y-[-40%] select-none'>
                              </div>

                              { 
                                loading ? 
                                (<div className="flex flex-col gap-2 p-2">
                                  {[1,2,3,4].map((_, i) => (
                                    <div 
                                      key={i}
                                      className="h-6 bg-richblack-200 rounded animate-pulse"
                                    ></div>
                                  ))}
                                </div>) :
                                subLinks.length ? 
                                  (
                                    subLinks
                                      ?.map((subLink, index)=> (
                                        <Link to={`/catalog/${subLink.name.split(" ").join("-").toLowerCase()}`}
                                          key={index}
                                          className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50'
                                        >
                                          <p>{subLink.name}</p>
                                        </Link>
                                      )) 
                                  ) : 
                                  (
                                    <p className='text-center'>No courses Found</p>
                                  )

                              }
                            </div>

                          </div>) : 
                          (
                            <Link to={element?.path}>
                              <p className={`${matchRoute(element?.path) ? "text-yellow-25" : "text-richblack-25"} font-semibold`}>
                                {element.title}
                              </p>
                            </Link>
                          ) 
                        }
                      </li>
                    )
                  })
                }
              </ul>
            </nav>


            {/* Login / SingUp / Dashboard */}
            <div className='hidden items-center gap-x-4 md:flex'>
                {
                  user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                    <Link to="/dashboard/cart" className='relative'>
                      <AiOutlineShoppingCart size={26} fill="#AFB2BF"/>
                      {
                        totalItems > 0 && (
                          <span className='absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center
                          overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold 
                          text-yellow-100'>
                            {totalItems}
                          </span>
                        )
                      }
                    </Link>
                  )
                }

                {
                  token === null && (
                    <Link to="/login">
                      <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                        Login
                      </button>
                    </Link>
                  )
                }
                {
                  token === null && (
                    <Link to="/signup">
                      <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                        signup
                      </button>
                    </Link>
                  )
                }

                {token !== null && (<ProfileDropDown/>)}

            </div>

            <button className='mr-4 md:hidden'
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <AiOutlineMenu fontSize={24} fill="#AFB2BF"/>
            </button>


        </div>
    
    {/* Overlay */}
{
  mobileMenuOpen && (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[900]"
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-richblack-800 p-5 flex flex-col gap-4 z-[1000]
        transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Nav Links (except Explore Courses) */}
        {
          NavbarLinks.map((element, index) => (
            element.title !== "Explore Courses" && (
              <Link
                key={index}
                to={element?.path}
                onClick={() => setMobileMenuOpen(false)}
                className='text-richblack-25 font-semibold'
              >
                {element.title}
              </Link>
            )
          ))
        }

        {/* Categories Heading */}
        <p className="text-yellow-25 font-bold mt-4">Categories</p>

        {/* Categories Content */}
        {
          loading ? (
            // 🔥 Skeleton Loader
            <div className="flex flex-col gap-3 py-4">
              <div className="h-5 w-[90%] bg-richblack-700 rounded animate-pulse"></div>
              <div className="h-5 w-[70%] bg-richblack-700 rounded animate-pulse"></div>
              <div className="h-5 w-[85%] bg-richblack-700 rounded animate-pulse"></div>
              <div className="h-5 w-[60%] bg-richblack-700 rounded animate-pulse"></div>
            </div>
          ) : subLinks.length ? (
            subLinks.map((cat, index) => (
              <Link
                key={index}
                to={`/catalog/${cat.name.split(" ").join("-").toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className='text-richblack-25 pl-2 hover:text-yellow-25 transition-all'
              >
                {cat.name}
              </Link>
            ))
          ) : (
            <p className="text-richblack-300 text-sm">No categories found</p>
          )
        }

        {/* Auth Section */}
        {
          token === null && (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className='text-richblack-25'>Login</button>
              </Link>

              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <button className='text-richblack-25'>Signup</button>
              </Link>
            </>
          )
        }

        {
          token !== null && (
            <div className="mt-4">
              <ProfileDropDown />
            </div>
          )
        }

      </div>
    </>
  )
}
    
    </div>

  )
}

export default Navbar