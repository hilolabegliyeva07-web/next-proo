import Header from "@/components/header";
import ImagesSection from "@/components/images-section";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white w-full min-h-screen">
      <Header />
      <main className="h-[70vh] bg-linear-135 from-blue-200 to-purple-200 flex flex-col justify-center">
        <div className="w-[500px] mx-auto items-center flex justify-center flex-col gap-4">

          <h1 className="font-bold text-6xl font-sans">Best Appliances for your
            home.</h1>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempore, aperiam quibusdam! Vel et sunt fuga quidem sed? Accusamus, dicta blanditiis!</p>
          <Link href="/sign-up">
            <Button className="p-5 hover:scale-105 group">Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>
        </div>
      </main>
      <ImagesSection />
    </div>
  );
}
