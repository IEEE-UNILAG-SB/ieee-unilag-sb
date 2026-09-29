import Image from 'next/image'

const Spotlight = () => {
  return (
    <div id='spotlight' className='flex flex-col xl:flex-row min-h-fit justify-center items-center gap-10 xl:px-20 px-6 py-12 md:py-16 xl:py-20'>
      <div className='w-full xl:w-auto flex justify-center'>
        <Image
          src={`/Image-16.jpg`}
          alt="IEEE UNILAG"
          width={453}
          height={365}
          className="rounded-lg object-cover w-full max-w-md xl:max-w-none h-auto"
        />
      </div>
      <div className='w-full xl:w-106.25 space-y-4'>
        <div className='font-sans text-[#00629B] text-3xl md:text-4xl font-bold'>Students Spotlight</div>
        <div>
          <div className='font-sans text-[#00629B] text-xl font-bold'>Chioma Adeyemi</div>
          <div className='font-text text-[16px]'>Computer Engineering, Class of 2024</div>
        </div>
        <div className='flex space-x-3'>
          <div className='mt-1 border h-16 border-[#657d8b] shrink-0'></div>
          <div className='font-text text-[14px] italic'>"IEEE UNILAG didn't just teach me engineering—it taught me how to think like an innovator, collaborate across disciplines, and turn ambitious ideas into real solutions."</div>
        </div>
        <div className='font-text text-base md:text-lg text-[#64748B]'>Chioma led her team to victory at the 2023 National Robotics Competition with an autonomous agricultural drone system. Her project, developed through IEEE's mentorship program, has attracted interest from agritech startups and earned her a full scholarship for graduate studies at MIT. She now mentors junior members while developing AI-powered solutions for Nigerian farmers.</div>
      </div>
    </div>
  )
}

export default Spotlight