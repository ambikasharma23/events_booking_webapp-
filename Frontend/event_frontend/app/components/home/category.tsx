"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Categories {
  id: number;
  icon: string;
  name: string;
}

export default function Category() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch("http://localhost:3001/getCategory?limit=8&offset=0");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: Categories[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (id: number) => {
    router.push(`/event/${id}`);
  };

  return (
    <>
      <div className="flex justify-between items-center p-5">
        <h1 className="text-white font-bold">What Are You Looking At?</h1>
        <p className="text-white cursor-pointer">View All</p>
      </div>
      <section className="text-gray-100 body-font">
        <div className="container mx-auto">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {categories.map((category) => (
              <div
                className="p-1 md:p-4 w-full cursor-pointer"
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                  <img
                    className="h-10 md:h-20 w-full object-cover object-center"
                    src={category.icon}
                    alt={category.name}
                  />
                  <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">
                    {category.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
