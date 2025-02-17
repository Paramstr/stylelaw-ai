'use client'

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

const showcaseItems = [
  {
    title: '"Summarize the child custody arrangements in Smith v. Smith, focusing on the shared parenting schedule."',
  },
  {
    title: '"What are the financial disclosure requirements outlined in this divorce settlement agreement?"',
  },
  {
    title: '"Extract the key terms regarding spousal maintenance and child support from this separation agreement."',
  }
]

export function ShowcaseCarousel() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Carousel
        opts={{
          align: "center",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {showcaseItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="bg-white rounded-xl">
                  <CardContent className="p-8">
                    <div>
                      <h2 className="text-[32px] leading-tight font-serif text-black">{item.title}</h2>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:flex">
          <CarouselPrevious className="absolute -left-12" />
          <CarouselNext className="absolute -right-12" />
        </div>
      </Carousel>
    </div>
  )
} 