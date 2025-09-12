"use client";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Testimonials } from "../Testimonials";

export function Hero() {
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-regular">
              <span className="text-foreground">Find Your Next</span>
              <motion.span
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  ease: "easeIn",
                }}
                className="text-primary font-semibold"
              >
                {" "}
                Million Dollar Idea
              </motion.span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl text-center text-muted-foreground">
              From idea to IPO, we provide the tools and resources to help you
              find your next big idea.
            </p>
          </div>
          <div className="flex gap-4">
            <Button size={"lg"}>Get Started</Button>
            <Button size={"lg"} variant={"outline"}>
              Learn More
            </Button>
          </div>
        </div>
      </div>
      <Testimonials />
    </div>
  );
}