(function () {
	'use strict';

	/**
	 * Slider de témoignages - Vanilla JS
	 * Remplace jQuery/Slick par un slider natif
	 */
	function initTestimonialsSlider() {
		const sliderContainers = document.querySelectorAll('.testimonials__slider');
		
		sliderContainers.forEach(function(container) {
			const slides = container.querySelectorAll('.testimonials__slide');
			const wrapper = container.closest('.testimonials__slider-wrapper');
			const prevButton = container.closest('.testimonials').querySelector('.testimonials__button--prev');
			const nextButton = container.closest('.testimonials').querySelector('.testimonials__button--next');
			const countsElement = container.closest('.testimonials').querySelector('.testimonials__counts');
			
			if (!slides.length || !prevButton || !nextButton || !countsElement) {
				return;
			}

			let currentSlide = 0;
			const totalSlides = slides.length;

			// Fonction pour ajuster la hauteur du wrapper au slide actif
			function updateWrapperHeight() {
				if (wrapper && slides[currentSlide]) {
					const activeSlide = slides[currentSlide];
					const slideHeight = activeSlide.offsetHeight;
					wrapper.style.height = slideHeight + 'px';
				}
			}

			// Fonction pour mettre à jour la position du slider
			function updateSlider() {
				const translateX = -currentSlide * 100;
				container.style.transform = `translateX(${translateX}%)`;
				updatePagination();
				updateWrapperHeight();
			}

			// Fonction pour mettre à jour la pagination
			function updatePagination() {
				if (countsElement) {
					countsElement.textContent = `${currentSlide + 1}/${totalSlides}`;
				}
			}

			// Fonction pour aller au slide suivant
			function nextSlide() {
				if (currentSlide < totalSlides - 1) {
					currentSlide++;
				} else {
					currentSlide = 0; // Loop vers le début
				}
				updateSlider();
			}

			// Fonction pour aller au slide précédent
			function prevSlide() {
				if (currentSlide > 0) {
					currentSlide--;
				} else {
					currentSlide = totalSlides - 1; // Loop vers la fin
				}
				updateSlider();
			}

			// Event listeners
			if (nextButton) {
				nextButton.addEventListener('click', nextSlide);
			}

			if (prevButton) {
				prevButton.addEventListener('click', prevSlide);
			}

			// Initialisation
			updateSlider();

			// Recalculer la hauteur après le chargement des images
			const images = container.querySelectorAll('img');
			let loadedImages = 0;
			images.forEach(function(img) {
				if (img.complete) {
					loadedImages++;
					if (loadedImages === images.length) {
						updateWrapperHeight();
					}
				} else {
					img.addEventListener('load', function() {
						loadedImages++;
						if (loadedImages === images.length) {
							updateWrapperHeight();
						}
					});
				}
			});

			// Recalculer la hauteur lors du redimensionnement de la fenêtre
			window.addEventListener('resize', function() {
				updateWrapperHeight();
			});

			// Support du clavier (optionnel)
			container.addEventListener('keydown', function(e) {
				if (e.key === 'ArrowLeft') {
					prevSlide();
				} else if (e.key === 'ArrowRight') {
					nextSlide();
				}
			});
		});
	}

	// Initialisation au chargement de la page
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initTestimonialsSlider);
	} else {
		initTestimonialsSlider();
	}

	// Réinitialisation lors du chargement d'une section Shopify
	document.addEventListener('shopify:section:load', function(event) {
		if (event.detail.sectionId && event.target.querySelector('.testimonials')) {
			initTestimonialsSlider();
		}
	});

})();
