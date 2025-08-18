import Navbar from "@/components/ui/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 relative">
        <div className="absolute top-0 right-0 w-full lg:w-3/5 h-full z-[-1]">
          <Image
            src="/images/hero.jpg"
            alt="Find your scene"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="absolute top-0 left-0 w-full lg:w-3/5 h-full z-10 flex flex-col justify-center p-8 lg:p-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-black p-6 rounded-lg text-left">
            Bored every weekend? Find your scene.
          </h1>
          <p className="text-lg lg:text-2xl text-white sm:text-lg leading-relaxed bg-black/20 backdrop-blur-sm lg:text-black lg:bg-transparent lg:backdrop-blur-none p-6 rounded-lg max-w-xl text-left ">
            Life&apos;s best moments happen when we come together. Discover
            events that inspire you, connect with people who share your
            passions, and make every day an opportunity for something amazing.
          </p>
        </div>
      </div>
    </div>
  );
}
