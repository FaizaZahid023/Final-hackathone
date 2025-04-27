import React from 'react'
import { useState, useEffect } from "react";

const images = [
	"https://www.visitberlin.de/system/files/styles/visitberlin_hero_visitberlin_desktop_2x/private/image/Shopping_03_c_Fragasso_web.jpg.webp?itok=i0s_vN8Q",
	"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiz2BDWBogGgQNtyfi5QFpimHzs0mHRpAYlcx6W1r3vPMzFjA_j6qJ5CAKCAQNJgm_bfE&usqp=CAU",
	"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcGuAGUDzP_bydQeecZm4VLKIbiyV-8cvmpA&s",
	"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCAqIQZzg21SxBiEU8eIsu8aCZcWtfi_grPOFkYdf08EU9B5y-w3kEyC1CAmt2EyXr8R8&usqp=CAU"
];

const Hero = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((currentInd) => (currentInd === images.length - 1 ? 0 : currentInd + 1));
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	const prevSlide = () => {
		setCurrentIndex((previousImg) => (previousImg === 0 ? images.length - 1 : previousImg - 1));
	};

	const nextSlide = () => {
		setCurrentIndex((nextImg) => (nextImg === images.length - 1 ? 0 : nextImg + 1));
	};

	return (
		<>
			<div className="relative w-full h-auto mt-1 mx-auto bg-black">
				{/* Images */}
				<div className="overflow-hidden">
					<img
						src={images[currentIndex]}
						alt={`Slide ${currentIndex+1}`}
						className="w-full h-160 object-cover transition-transform duration-100"
					/>
				</div>

				{/* Left Arrow */}
				<button
					onClick={prevSlide}
					className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/80"
				>
					❮
				</button>

				{/* Right Arrow */}
				<button
					onClick={nextSlide}
					className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/80"
				>
					❯
				</button>

				{/* Dots */}
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
					{images.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-3 h-3 rounded-full ${currentIndex === index ? "bg-white" : "bg-gray-400"
								}`}
						/>
					))}
				</div>
			</div>
		</>
	)
}

export default Hero
