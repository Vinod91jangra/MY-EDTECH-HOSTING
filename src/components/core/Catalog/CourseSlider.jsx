import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper";
import CourseCard from './Course_Card';




const CourseSlider = ({courses}) => {




  return (
    <div>
      {
        courses?.length ? 
        (<Swiper
          loop={true}
          // rewind={true}
          spaceBetween={40}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={true}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          breakpoints={{
            650: {slidesPerView: 2},
            1024: {slidesPerView: 3}
          }}
        >
          {
            courses.map((course, index)=>(
              <SwiperSlide key={index}>
                <CourseCard course={course} height={"h-[250px]"}/>
              </SwiperSlide>
            ))
          }
        </Swiper>) : 
        (<p>No course Found</p>)
      }
    </div>
  )
}

export default CourseSlider
