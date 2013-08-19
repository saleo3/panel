/**
*
* Paneles 
* Emir Salazar, 2013.
*
*
* #### Estilos en el head: ####
*
* <link rel="stylesheet" type="text/css" href="css/panel.css" />
*
*
* ### Scripts al final del body: ####
*
* <script src="js/jquery.js"></script>
* <script src="js/panel.js"></script>
* <script>
* 		panel.new({ width: 500 });
* </script>
* de igual forma acepta: speed y lapping.
*
*
* #### Para llamar a los paneles #### 
*
* <a class="npanel" id="p1"  href="$tuarchivo" data-type="">Abrir panel</a>
* id acepta: p1, p2, p3.
* data-type acepta: modal o vacio.
* 
* Dentro de cada $tuarchivo es necesario que este dentro de: 
* <div id="secondary"></secondary>
* 
**/

var conf = {
	speed: 500,
	lapping: 50,
	width: 800
};

var panel = {
	vars: {},
	create: function(id, href, type) {
		var p_id 	= '#p'+id,
			$href	= href,
			$type 	= type,
			$right;
			
		//En caso de que exista un panel anterior
		$('.panel').removeClass('active');		

		if( $(p_id).length == 0 ) {
			//Creamos el panel si es que no existe

			//Identificamos si es un panel normal o uno modal
			$class = ($type === 'modal')? 'panel modal': 'panel';			
			//Calculamos el solapamiento de cada panel
			$right = this.margin();

			$('<div />', {
				id:           'p'+id,
				class:        $class,
				'data-right': $right
			})
				.css({
					'display': 	'none',
					'width': 	this.vars.width+'px'
                })
                .appendTo( $('body') );		//'height': 	$('#ContenedorCRM').height()

		} else {
			//Recuperamos el solapamiento ya que el panel existe
			$right = $(p_id).attr('data-right');
		} 

		//Mostramos el panel y el ultimo siempre tendra clase activo
		//por alguna razon no podemos usar $id ya que necesita 2 click
		$(p_id)
			.load($href, function() {
				if( $(p_id).hasClass('modal') ) {
					$(p_id)
						.find('#secondary')
							.append('<a href="#" class="cpanel">Cerrar</a>');
					$('body').addClass('dontscroll');

					if( $('.overlay').length == 0 ) {
						$('<div/>', { class: 'overlay' })
							.appendTo('body');
					} else {
						$('.overlay').show();
					}

				} else {
					$('body').removeClass('dontscroll');
					$('.overlay').hide();
				}

				$(p_id)
					.find('#secondary')
						.css({ 'margin-right': (-1)*($right)+20 });
			})
			.show()
			.stop()
			.animate({
				'right': $right
			}, this.vars.speed)
			.addClass('active');	

	},
	close: function(id) {
		//Cerramos el panel y lo vaciamos. Hacemos activo al anterior panel
		
		$('#'+id)
			.removeClass('active')
			.stop()
			.animate({
				'right': -$('#'+id).outerWidth(true)
				}, 
				this.vars.speed, 
				function() {
					$(this).hide().empty();
			})
			.prevAll('.panel:first')
				.addClass('active');

		if( $('#'+id).prevAll('.panel.active').hasClass('modal') ) {
			$('.overlay').show();
			$('body').addClass('dontscroll');
		} else {
			$('body').removeClass('dontscroll');
			$('.overlay').hide();
		}


	},
	margin: function() {
		return -( $('.panel').length * this.vars.lapping );
	},
	new: function(options) {
		//Listeners para los paneles
		var $body = $('body');
		var	ele;
		//this.vars.width = (w)? w: this.vars.width;
		this.vars = $.extend({}, conf, options);

		$body.on('click', 'a.npanel', function(e) {
			//Evento para crear un nuevo panel
			e.preventDefault();
		    ele = $(e.target);
		    panel.create( ele.attr('id'), ele.attr('href'), ele.attr('data-type') );
		});

		$body.on('click', 'a.npanel, div.panel', function(e) {
			//Evita cerrar los paneles cuando se hace click en 
			//los links y en el area del los paneles
			e.stopPropagation();
		});

		$body.on('click', 'a.cpanel', function(e) {
			//Evento para cerrar los paneles modales
			e.preventDefault();
			//panel.close( $('.panel:visible:last').prop('id') );
			var id = $('.panel:visible:last').prop('id');
			panel.close(id);
		});

		$(document).bind('click keyup', function(e) {
			//Evento para cerrar los paneles que no sean modales
			//Se cierra haciendo click fuera del area de los paneles
			//o con la ESC

			//Obtiene pp1
			var id = $('.panel:visible:last').prop('id');

			if( e.type == 'keyup' && e.keyCode != 27) return;
					
			if( !$('#'+id).hasClass('modal') ) { panel.close(id); }	
		});

	}

}
