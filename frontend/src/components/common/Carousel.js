import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css';

const Carousel = ({ 
  items = [], 
  renderItem, 
  itemsPerView = 3, 
  autoPlay = true, 
  autoPlayInterval = 4000,
  showDots = true,
  showArrows = true,
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const intervalRef = useRef(null);
  const carouselRef = useRef(null);

  // Calculate total slides based on items per view
  const totalSlides = Math.max(0, items.length - itemsPerView + 1);

  // Auto play functionality
  useEffect(() => {
    if (autoPlay && items.length > itemsPerView) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoPlay, autoPlayInterval, items.length, itemsPerView]);

  // Clear interval on manual interaction
  const clearAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const nextSlide = () => {
    if (isTransitioning || items.length <= itemsPerView) return;

    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= totalSlides ? 0 : nextIndex;
    });

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning || items.length <= itemsPerView) return;
    
    clearAutoPlay();
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? totalSlides - 1 : nextIndex;
    });
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex || items.length <= itemsPerView) return;
    
    clearAutoPlay();
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Handle touch/swipe for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className={`carousel ${className}`}>
        <div className="carousel-empty">
          <p>Aucun élément à afficher</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`carousel ${className}`}>
      <div className="carousel-container">
        {/* Navigation Arrows */}
        {showArrows && items.length > itemsPerView && (
          <>
            <button 
              className="carousel-arrow carousel-arrow-prev"
              onClick={prevSlide}
              disabled={isTransitioning}
              aria-label="Précédent"
            >
              &#8249;
            </button>
            <button 
              className="carousel-arrow carousel-arrow-next"
              onClick={nextSlide}
              disabled={isTransitioning}
              aria-label="Suivant"
            >
              &#8250;
            </button>
          </>
        )}

        {/* Carousel Track */}
        <div 
          className="carousel-track"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            width: `${(items.length / itemsPerView) * 100}%`
          }}
        >
          {items.map((item, index) => (
            <div 
              key={item.id || index} 
              className="carousel-item"
              style={{ width: `${100 / items.length}%` }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {/* Dots Navigation */}
      {showDots && items.length > itemsPerView && (
        <div className="carousel-dots">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
