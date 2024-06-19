"use client";
import React, { useEffect, useState } from 'react';

export default function Category() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = await fetch("http://localhost:3001/getCategory");
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                let data = await response.json();
                console.log(data);
                setCategories(data); 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); 
    }, []); 

    return (
        <>
            <h1 className="text-white mx-20 font-bold">What are you looking at?</h1>

            <section className="text-gray-100 body-font">
                <div className="container mx-auto">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                        {categories.map((categories) => (
                            <div className="p-1 md:p-4 w-full" key={categories.id}>
                                <div className="h-full border-2 border-gray-200 border-opacity-10 rounded-lg overflow-hidden">
                                    <img
                                        className="h-10 md:h-20 w-full object-cover object-center"
                                        src={categories.icon}
                                    />
                                    <h4 className="title-font text-sm font-medium text-gray-900 text-white text-center">
                                        {categories.name}
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
