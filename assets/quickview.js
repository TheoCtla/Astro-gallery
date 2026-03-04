//Quick View

$(document).ready(function () {
	$.getScript("//cdnjs.cloudflare.com/ajax/libs/fancybox/2.1.5/jquery.fancybox.min.js").done(function () {
		quickView();
	});
});


function quickView() {
	$(".quick-view").click(function (e) {
		let content;
		e.preventDefault();
		if ($('#quick-view').length == 0) {
			$("body").append('<div id="quick-view"><div class="qv-content"><div class="qv-wrapper"></div></div></div>');
		}
		var product_handle = $(this).data('handle');
		$('#quick-view').addClass(product_handle);
		$.ajax({
			url: '/products/' + product_handle,
		}).done(function (text) {
			const newDiv = document.createElement("div");
			newDiv.innerHTML = text;

			$(newDiv).find('variant-selects').addClass('variant-selects--quick-view');
			$(newDiv).find('variant-radios').addClass('variant-selects--quick-view');
			$(newDiv).find(".product__additional").remove();
			$(newDiv).find(".shopify-payment-button").remove();
			$(newDiv).find(".share-buttons").remove();
			$(newDiv).find(".product__pickup-availabilities").remove();
			$(newDiv).find(".pickup-availability-preview").remove();
			if ($(newDiv).find(".customer")) {
				$(newDiv).find(".customer").remove();
			}
			let scripts = $(newDiv).find("script");

			for (let i = 0; i < scripts.length; i++) {
				let source = "" + $(scripts[i]).attr("src");

				if(source){
					if( source.indexOf("copy.js") > -1 || source.indexOf("pickup-availability.js") > -1 ){
						$(scripts[i]).remove();
					}
				}

			}


			if (theme.quickviewMore.length > 0) {
				$(newDiv).find(".product-form__buttons").append(`
					<a class='product-form__buttons-more' href='${'/products/' + product_handle}'>${theme.quickviewMore}</a>
				`);
			}


			content = $(newDiv).find(".product-section");

			$("#quick-view .qv-wrapper").append(content).each(function () {
				$('.product-section .product__media-list').slick(getSliderSettings());

				$('.product-section .product__media-sublist').each( function () {
					$(this).slick(getSubSliderProductSettings($(this).parent().find('.product__media-list')));
				});

				$('.product-section .product__media-list').on('afterChange', function(event, slick, currentSlide, nextSlide){
					window.pauseAllMedia();
				});
			});

		});

		$.fancybox({
			href: '#quick-view',
			maxWidth: 1076,
			maxHeight: 650,
			fitToView: true,
			width: '90%',
			height: '90%',
			autoSize: false,
			closeClick: false,
			openEffect: 'none',
			closeEffect: 'none',
			'beforeLoad': function () {
				var product_handle = $('#quick-view').attr('class');
				$('.fancybox-wrap').css('overflow', 'hidden !important');
			},
			'afterShow': function () {

				if (theme.quickviewText.length > 0) {
					$(".fancybox-outer").append(`
					<div class = "qv-announcement color-inverse">
						${theme.quickviewText}
					</div>
					`);
				}
			},
			'afterClose': function () {
				$('#quick-view').removeClass();
				$('#quick-view .qv-wrapper').empty();
			}
		});
	});
};

document.addEventListener('shopify:section:load', function () {
	quickView();
});

