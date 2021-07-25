$(document).ready(function(){
	/**
    * Global Variables
	*/
	var showPerPage = 12;
	var page = 1;
	var searchParameter = '';
	var foodParameter = '';
	var brewedBefore = '';
	var abv = '';
	var abvGt = 0.6;
	var abvLt = 54;
	/**
    * Append Products
	*/
	function appendProducts(result){
		$(result).each(function(index,element){
			if(element.image_url == null){
				element.image_url = '../images/placeholder.png'
			}
			var ingredientsMalt = '';
			var ingredientsHops = '';
			$(element.ingredients).each(function(indexinner,elementinner){
				$(elementinner.malt).each(function(indexmalt,elementmalt){
					ingredientsMalt += '<p class="malt-name">' + elementmalt.name + '</p>';
				});
				$(elementinner.hops).each(function(indexhops,elementhops){
					ingredientsHops += '<p class="hops-name">' + elementhops.name + '</p>';
				});
			});
			$('.product-list').append('<li class="product-item">'+ 
				'<div class="product-item-info">' +
					'<div class="product-img-container"><a href="#"><img src="'+ element.image_url +'" alt="'+ element.name +'"></a></div>' +
					'<div class="product-details">' + 
						'<p class="product-name">'+ element.name +'</p>' +
						'<p class="product-description">'+ element.description +'</p>' +
						'<p class="product-alcohol-content">'+ element.abv +'<span>%</span></p>' +
						'<div class="add-to-cart"><a href="#">Add to cart</a></div>' +
					'</div>' +
				'</div>' +
				'<div class="modal-info">'+ 
					'<div class="product-img-container"><div class="product-img-container-inner"><img src="'+ element.image_url +'" alt="'+ element.name +'"></div></div>' +
					'<div class="product-details">' +
						'<p class="product-name">' + element.name + '</p>' +
						'<div class="malt-container"><p class="malt-title">Malt:</p>'+ ingredientsMalt +'</div>' +
						'<div class="hops-container"><p class="hops-title">Hops:</p>'+ ingredientsHops +'</div>' +
						'<div class="yeast-container"><p class="yeast-title">Yeast:</p><p class="yeast-name">'+ element.ingredients.yeast +'</p></div>' + 
						'<div class="food-pairing-container"><p class="food-pairing-title">Food Pairing</p><p class="food-pairing-name">'+ element.food_pairing +'</p></div>' +
						'<div class="add-to-cart"><a href="#">Add to cart</a></div>' +
					'</div>' +
				'</div>' + 
			'</li>')
		});
	}
	/**
    * Init Product Load
    * Loaded only once  
	*/
	function initLoad(){
		$.ajax({
			url: 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage, 
			success: function(result){	
				appendProducts(result);
				if(localStorage.getItem('product-mode') == 'grid-mode'){
					$('.products').removeClass('list-mode grid-mode');
					$('.products').addClass('grid-mode');
					$('.product-mode').removeClass('active');
					$('.grid-button').addClass('active');
				}else if (localStorage.getItem('product-mode') == 'list-mode'){
					$('.products').removeClass('list-mode grid-mode');
					$('.products').addClass('list-mode');
					$('.product-mode').removeClass('active');
					$('.list-button').addClass('active');
				}
	  		},
	  		error: function (error) {
			    console.log(error);
			},
			complete: function() {
	  			$('.column-main').addClass('loaded-products');
		    }
	  	});		
	}
	initLoad();
	/**
    * Product numbers
	*/
	function productNumber(){
		var selectedNumber;
		$('.show-per-page select').change(function(){
			selectedNumber = $(this).children('option:selected').val();
			showPerPage = selectedNumber;  
			showPerPageFnc();     
	    });
	}
	productNumber();
	/**
    * Show per page
	*/
	function showPerPageFnc(){
		page = 1;
		
		$('.next').attr('disabled', false);
		$('.prev').attr('disabled', true);
		var url;
		url = queryString();
		$.ajax({
			url: url, 
			beforeSend: function() {
		        $('.products').addClass('loading-products');
		    },
			success: function(result){
				if(result.length != showPerPage){
					$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
					setTimeout(function(){
						$('.product-item').remove();
						appendProducts(result);
					}, 800);
					$('.next').attr('disabled', true);
				}else{
					$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
					setTimeout(function(){
						$('.product-item').remove();
						appendProducts(result);
					}, 800);
				}
	  		},
	  		error: function (error) {
	  			$('.next').attr('disabled', true);
				$('.prev').attr('disabled', true);
			    console.log(error);
			},
	  		complete: function() {
	  			setTimeout(function(){
					$('.products').removeClass('loading-products');
				}, 800);
		    }
	  	});
	}
	/**
    * Pagination
	*/
	function pagination(){

		$('.next').on('click', function(){
			page++;
			$('.prev').attr('disabled', false);
			var url;
			url = queryString();
			$.ajax({
				url: url, 
				beforeSend: function() {
			        $('.products').addClass('loading-products');
			    },
				success: function(result){
					if(result.length != showPerPage){
						$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
						setTimeout(function(){
							$('.product-item').remove();
							appendProducts(result);
						}, 800);
						$('.next').attr('disabled', true);
					}else{
						$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
						setTimeout(function(){
							$('.product-item').remove();
							appendProducts(result);
						}, 800);
					}
		  		},
		  		error: function (error) {
				    console.log(error);
				},
				complete: function() {
		  			setTimeout(function(){
						$('.products').removeClass('loading-products');
					}, 800);
			    }
		  	});
		});

		$('.prev').on('click', function(){
			page--;
			$('.next').attr('disabled', false);
			var url;
			url = queryString();
			if(page < 2){
				page = 1;
				$('.prev').attr('disabled', true);
				$.ajax({
					url: url, 
					beforeSend: function() {
				        $('.products').addClass('loading-products');
				    },
					success: function(result){
						$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
						setTimeout(function(){
							$('.product-item').remove();
							appendProducts(result);
						}, 800);
			  		},
			  		error: function (error) {
					    console.log(error);
					},
					complete: function() {
			  			setTimeout(function(){
							$('.products').removeClass('loading-products');
						}, 800);
				    }
			  	});
			}else{				
				$.ajax({
					url: url, 
					beforeSend: function() {
				        $('.products').addClass('loading-products');
				    },
					success: function(result){
						$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
						setTimeout(function(){
							$('.product-item').remove();
							appendProducts(result);
						}, 800);
			  		},
			  		error: function (error) {
					    console.log(error);
					},
					complete: function() {
			  			setTimeout(function(){
							$('.products').removeClass('loading-products');
						}, 800);
				    }
			  	});
			}
		});
	}
	pagination();
	/**
    * Search Product
	*/
	function searchProduct(){
		$('.search-form').on('submit', function(event){
			event.preventDefault();
			page = 1;
    		searchParameter = $.trim($('.search-input').val());
    		$('.empty-search').remove();
						
			$('.next').attr('disabled', false);
			$('.prev').attr('disabled', true);

			var url;
			url = queryString();

			if(!searchParameter == ''){
				$('.active-search-filters').remove();
				$('.selected-filters').append('<span class="active-filters active-search-filters">Search by: <span class="filter-active">'+ searchParameter +'</span></span>');
				$('.validation').removeClass('active-validation');
				$.ajax({
						url: url, 
						beforeSend: function() {
					        $('.products').addClass('loading-products');
					    },
						success: function(result){
							if(result.length == 0){
								$('.empty-search').remove();
								$('.product-list').append('<li class="empty-search"><p>Product not found</p></li>')
							}else{
								$('.empty-search').remove();
							}
							if(result.length != showPerPage){
								$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
								setTimeout(function(){
									$('.product-item').remove();
									appendProducts(result);
								}, 800);
								$('.next').attr('disabled', true);
							}else{
								$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
								setTimeout(function(){
									$('.product-item').remove();
									appendProducts(result);
								}, 800);
							}
				  		},
				  		error: function (error) {
				  			$('.product-list').html('<li class="empty-search"><p>Product not found</p></li>');
				  			$('.next').attr('disabled', true);
							$('.prev').attr('disabled', true);
						    console.log(error);
						},
						complete: function() {
				  			setTimeout(function(){
								$('.products').removeClass('loading-products');
							}, 800);
					    }
				});
			}else{
				$('.validation').addClass('active-validation');
			}
		})
	}
	searchProduct();
	/**
    * AJAX filter function
	*/
	function ajaxFilterFnc(url){
		$.ajax({
			url: url, 
			beforeSend: function() {
		        $('.products').addClass('loading-products');
		    },
			success: function(result){
				if(result.length == 0){
					$('.empty-search').remove();
					$('.product-list').append('<li class="empty-search"><p>Product not found</p></li>')
				}else{
					$('.empty-search').remove();
				}
				if(result.length != showPerPage){
					$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
					setTimeout(function(){
						$('.product-item').remove();
						appendProducts(result);
					}, 800);
					$('.next').attr('disabled', true);
				}else{
					$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
					setTimeout(function(){
						$('.product-item').remove();
						appendProducts(result);
					}, 800);
				}
	  		},
	  		error: function (error) {
	  			$('.product-list').html('<li class="empty-search"><p>Product not found</p></li>');
	  			$('.next').attr('disabled', true);
				$('.prev').attr('disabled', true);
			    console.log(error);
			},
			complete: function() {
	  			setTimeout(function(){
					$('.products').removeClass('loading-products');
				}, 800);
		    }
		});
	}
	/**
    * Food filter
	*/
	function foodFilter(){
		$('.radio-button').on('change', function(){
			foodParameter = $(this).val(); 
			page = 1;
			$('.next').attr('disabled', false);
			$('.prev').attr('disabled', true);
			$('.empty-search').remove();
			var url;
			url = queryString();
			$('.active-food-filters').remove();
			$('.selected-filters').append('<span class="active-filters active-food-filters">Food: <span class="filter-active">'+ foodParameter +'</span></span>');
			ajaxFilterFnc(url);
		})
	}
	foodFilter();
	/**
	* Brewed before
	*/
	function brewedBeforeFilter(){
		page = 1;
		$('.next').attr('disabled', false);
		$('.prev').attr('disabled', true);
		$('.empty-search').remove();
		var url;
		url = queryString();
		$('.active-brewed-before-filters').remove();
		$('.selected-filters').append('<span class="active-filters active-brewed-before-filters">Brewed before: <span class="filter-active">'+ brewedBefore +'</span></span>');
		ajaxFilterFnc(url);
	}
	/**
	* ABV greater than and ABV less than
	*/
	function abvFilter(){
		page = 1;
		$('.next').attr('disabled', false);
		$('.prev').attr('disabled', true);
		$('.empty-search').remove();
		var url;
		url = queryString();
		$('.active-abv-filters').remove();
		$('.selected-filters').append('<span class="active-filters active-abv-filters">ABV: <span class="filter-active">'+ abvGt +'%'+' - '+ abvLt +'%</span></span>');
		ajaxFilterFnc(url);
	}
	/**
    * Remove Filter
	*/
	function removeFilter(){
		$(document).on('click', '.active-filters', function(){
			$('.empty-search').remove();
			$(this).remove();
			if($(this).hasClass('active-search-filters')){
				$('.search-input').val('');
				searchParameter = ''; 
			}
			if($(this).hasClass('active-food-filters')){
				$('.radio-button').prop('checked', false);
				foodParameter = '';
			}
			if($(this).hasClass('active-brewed-before-filters')){
				$('#brewed-before-input').val('');
				brewedBefore = '';
			}
			if($(this).hasClass('active-abv-filters')){
				var range = $(".js-range-slider").data("ionRangeSlider");
				range.reset();
				abv = '';
			}

			page = 1;
			$('.next').attr('disabled', false);
			$('.prev').attr('disabled', true);
			var url;
			url = queryString();
			
			$.ajax({
				url: url, 
				beforeSend: function() {
			        $('.products').addClass('loading-products');
			    },
				success: function(result){
					if(result.length != showPerPage){
						$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
						setTimeout(function(){
							$('.product-item').remove();
							appendProducts(result);
						}, 800);
						$('.next').attr('disabled', true);
					}else{
						$('html, body').animate({ scrollTop: $('.column-main').offset().top - 100 }, '2000');
						setTimeout(function(){
							$('.product-item').remove();
							appendProducts(result);
						}, 800);
					}
		  		},
		  		error: function (error) {
		  			$('.product-list').html('<li class="empty-search"><p>Product not found</p></li>');
		  			$('.next').attr('disabled', true);
					$('.prev').attr('disabled', true);
				    console.log(error);
				},
		  		complete: function() {
		  			setTimeout(function(){
						$('.products').removeClass('loading-products');
					}, 800);
			    }
		  	});

		});
	}
	removeFilter();
	/**
	* Query String (Need to rewrite this function and get dynamic query string) 
	*/
	function queryString(){
		var url;
		if(searchParameter == '' && foodParameter =='' && brewedBefore == '' && abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage;
			return url;
		}
		// Search 
		else if(!searchParameter == '' && foodParameter =='' && brewedBefore == '' && abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&beer_name='+searchParameter;
			return url;
		}
		else if(!searchParameter == '' && !foodParameter =='' && brewedBefore == '' && abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&beer_name='+searchParameter+'&food='+foodParameter;
			return url;
		}
		else if(!searchParameter == '' && foodParameter =='' && !brewedBefore == '' && abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&beer_name='+searchParameter+'&brewed_before='+brewedBefore;
			return url;
		}
		else if(!searchParameter == '' && foodParameter =='' && brewedBefore == '' && !abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&beer_name='+searchParameter+abv;
			return url;
		}
		else if(!searchParameter == '' && !foodParameter =='' && !brewedBefore == '' && abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&beer_name='+searchParameter+'&food='+foodParameter+'&brewed_before='+brewedBefore;
			return url;
		}
		else if(!searchParameter == '' && !foodParameter =='' && brewedBefore == '' && !abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&beer_name='+searchParameter+'&food='+foodParameter+abv;
			return url;
		}
		else if(!searchParameter == '' && foodParameter =='' && !brewedBefore == '' && !abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&beer_name='+searchParameter+'&brewed_before='+brewedBefore+abv;
			return url;
		}
		// Food
		else if(searchParameter == '' && !foodParameter =='' && brewedBefore == '' && abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&food='+foodParameter
			return url;
		}
		else if(searchParameter == '' && !foodParameter =='' && !brewedBefore == '' && abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&food='+foodParameter+'&brewed_before='+brewedBefore;
			return url;
		}
		else if(searchParameter == '' && !foodParameter =='' && brewedBefore == '' && !abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&food='+foodParameter+abv;
			return url;
		}
		else if(searchParameter == '' && !foodParameter =='' && !brewedBefore == '' && !abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&food='+foodParameter+'&brewed_before='+brewedBefore+abv;
			return url;
		}
		// Brewed
		else if(searchParameter == '' && foodParameter =='' && !brewedBefore == '' && abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&brewed_before='+brewedBefore;
			return url;
		}
		else if(searchParameter == '' && foodParameter =='' && !brewedBefore == '' && !abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&brewed_before='+brewedBefore+abv;
			return url;
		}
		// ABV
		else if(searchParameter == '' && foodParameter =='' && brewedBefore == '' && !abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+abv;
			return url;
		}
		else if(!searchParameter == '' && !foodParameter =='' && !brewedBefore == '' && !abv == ''){
			url = 'https://api.punkapi.com/v2/beers?page='+page+'&per_page='+showPerPage+'&beer_name='+searchParameter+'&food='+foodParameter+'&brewed_before='+brewedBefore+abv;
			return url;
		}
	}
	/**
	* Datepicker
	*/
	$('#brewed-before-input').datepicker( {
        changeMonth: true,
        changeYear: true,
        showButtonPanel: true,
        dateFormat: 'mm-yy',
        maxDate: new Date(new Date().getFullYear(), 11, 31),
        yearRange: '-20:+0', 
        beforeShow:function(){
        	$('.brewed-before').append($('#ui-datepicker-div'));
        },
        onClose: function() { 
            var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
            var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
            $(this).datepicker('setDate', new Date(year, month, 1));
            brewedBefore = $('#brewed-before-input').val(); 
            brewedBeforeFilter();
        }
    });
    /**
	* Range slider
	*/
	function rangeSlider(){
		$('.js-range-slider').ionRangeSlider({
	        type: "double",
	        min: 0.6,
	        max: 54,
	        from: abvGt,
	        to: abvLt,
	        step: 0.1,
	        grid: false,
	        onFinish: function (data) {
	            abvGt = data.from;
	            abvLt = data.to;
	        },
	    });
	}
	rangeSlider();
    $('.range-filter').on('click', function(){
    	abv = '&abv_gt='+abvGt+'&abv_lt='+abvLt+'';
    	abvFilter();
    });
	/**
    * Product Mode
	*/
	function productMode(){
		var buttonMode = $('.product-mode');

		buttonMode.on('click', function(){
			if(!$(this).hasClass('active')){
				buttonMode.removeClass('active');
				$(this).addClass('active');
				$('.products').removeClass('list-mode grid-mode');
				$('.products').addClass($(this).attr('data-mode'));
				localStorage.setItem('product-mode', $(this).attr('data-mode'));
			}else{
				return false;
			}
		})
	}
	productMode();
	/**
    * Scroll to Top
	*/
	function scrollToTop(){
		var scrollToTop = $('.scroll-to-top a');
		var timer;

        $(window).scroll(function(){
        	if(timer) {
				window.clearTimeout(timer);
			}
			timer = window.setTimeout(function() {
				if ($(this).scrollTop() > 1) {
	                scrollToTop.css({bottom:"25px"});
	            } else {
	                scrollToTop.css({bottom:"-45px"});
	            }
			}, 100);
        });
        scrollToTop.click(function(){
            $('html, body').animate({scrollTop: 0}, 550);
            return false;
        });

	}
	scrollToTop();
	/**
    * Product Modal
	*/
	function productModal(){
		var modal = $('#product-modal');
		$(document).on('click', '.product-img-container a', function(event){
			event.preventDefault();
		});
		$(document).on('click', '.product-img-container img', function(){
			$('.modal-content').animate({ scrollTop: 0 }, 100);
			modal.addClass('active-modal');
			$($(this).parents('.product-item')).addClass('modal-activated');
			$('.modal-body').html($('.modal-activated .modal-info').clone());
		});
		$(document).on('click', '.close', function(){
			modal.removeClass('active-modal');
			$('.product-item').removeClass('modal-activated');
		})
		window.onclick = function(event) {
			if ($(event.target).hasClass('active-modal')) {
				modal.removeClass('active-modal');
				$('.product-item').removeClass('modal-activated');
			}
		}
	}
	productModal();
	/**
    * Loader
	*/
	function loader(){
		$(document).ready(function(){
			setTimeout(function(){
				$('.loader-container').fadeOut();
			}, 800);
		});	
	}
	loader();
	/**
    * Mobile menu
	*/
	function mobileMenu(){
		$('.menu-opener').on('click', function(){
			$('html, body').toggleClass('menu-open');
		})
	}
	mobileMenu();
	/**
    * Sidebar open
	*/
	function openSidebar(){
		$('.sidebar-opener').on('click', function(){
			$('html, body').addClass('sidebar-open');
		})
	}
	openSidebar();
	/**
    * Sidebar close
	*/
	function openClose(){
		$('.sidebar-close').on('click', function(){
			$('html, body').removeClass('sidebar-open');
		})
	}
	openClose();
	
});